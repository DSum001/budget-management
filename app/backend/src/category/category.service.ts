import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(
    userId: string,
    createDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = new this.categoryModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
      isSystem: createDto.isSystem ?? false,
    });

    if (createDto.parentId) {
      const parent = await this.findById(userId, createDto.parentId);
      if (parent.parentId) {
        throw new BadRequestException(
          'Cannot create nested subcategories more than 2 levels deep',
        );
      }
    }

    return category.save();
  }

  async findAll(userId: string, type?: string): Promise<Category[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (type) {
      filter.type = type;
    }
    return this.categoryModel.find(filter).sort({ type: 1, name: 1 }).exec();
  }

  async findById(userId: string, categoryId: string): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId).exec();

    if (!category) {
      throw new NotFoundException('ไม่พบหมวดหมู่นี้');
    }

    if (category.userId.toString() !== userId && !category.isSystem) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงหมวดหมู่นี้');
    }

    return category;
  }

  async findWithSubCategories(userId: string): Promise<any[]> {
    const categories = await this.findAll(userId);

    const categoryMap = new Map<string, any>();
    const result: any[] = [];

    // สร้าง map และเตรียม structure
    categories.forEach((cat) => {
      categoryMap.set(cat._id.toString(), {
        id: cat._id,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
        parentId: cat.parentId?.toString() || null,
        isSystem: cat.isSystem,
        subCategories: [],
      });
    });

    // จัดกลุ่ม parent-child
    categoryMap.forEach((cat) => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.subCategories.push(cat);
        }
      } else {
        result.push(cat);
      }
    });

    return result;
  }

  async update(
    userId: string,
    categoryId: string,
    updateDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findById(userId, categoryId);

    if (category.isSystem) {
      throw new ForbiddenException('ไม่สามารถแก้ไขหมวดหมู่ระบบได้');
    }

    Object.assign(category, updateDto);
    return category.save();
  }

  async delete(userId: string, categoryId: string): Promise<void> {
    const category = await this.findById(userId, categoryId);

    if (category.isSystem) {
      throw new ForbiddenException('ไม่สามารถลบหมวดหมู่ระบบได้');
    }

    // ตรวจสอบว่ามี sub-categories หรือไม่
    const subCategories = await this.categoryModel
      .find({ parentId: new Types.ObjectId(categoryId) })
      .exec();

    if (subCategories.length > 0) {
      throw new BadRequestException(
        'ไม่สามารถลบหมวดหมู่ที่มีหมวดหมู่ย่อยได้ กรุณาลบหมวดหมู่ย่อยก่อน',
      );
    }

    await category.deleteOne();
  }

  async initializeDefaultCategories(userId: string): Promise<void> {
    const existingCategories = await this.categoryModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (existingCategories) {
      return; // มีหมวดหมู่อยู่แล้ว
    }

    const defaultCategories = [
      // Income categories
      { name: 'เงินเดือน', type: 'income', icon: '💰', color: '#4CAF50' },
      { name: 'โบนัส', type: 'income', icon: '🎁', color: '#8BC34A' },
      { name: 'รายได้เสริม', type: 'income', icon: '💼', color: '#CDDC39' },
      { name: 'เงินลงทุน', type: 'income', icon: '📈', color: '#FFC107' },
      { name: 'อื่นๆ', type: 'income', icon: '💵', color: '#9E9E9E' },

      // Expense categories
      { name: 'อาหาร', type: 'expense', icon: '🍔', color: '#FF5722' },
      { name: 'เดินทาง', type: 'expense', icon: '🚗', color: '#FF9800' },
      { name: 'ที่อยู่อาศัย', type: 'expense', icon: '🏠', color: '#795548' },
      {
        name: 'ค่าใช้จ่ายส่วนตัว',
        type: 'expense',
        icon: '👔',
        color: '#9C27B0',
      },
      { name: 'ความบันเทิง', type: 'expense', icon: '🎬', color: '#E91E63' },
      { name: 'สุขภาพ', type: 'expense', icon: '⚕️', color: '#F44336' },
      { name: 'การศึกษา', type: 'expense', icon: '📚', color: '#3F51B5' },
      { name: 'ช้อปปิ้ง', type: 'expense', icon: '🛍️', color: '#2196F3' },
      { name: 'บิล/ค่าบริการ', type: 'expense', icon: '💡', color: '#00BCD4' },
      { name: 'อื่นๆ', type: 'expense', icon: '📝', color: '#607D88' },
    ];

    const categories = defaultCategories.map((cat) => ({
      ...cat,
      userId: new Types.ObjectId(userId),
      isSystem: true,
    }));

    await this.categoryModel.insertMany(categories);
  }
}
