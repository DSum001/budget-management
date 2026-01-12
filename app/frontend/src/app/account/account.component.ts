import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { RouterLink } from '@angular/router';
import { Account } from '../models';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  accounts: Account[] = [];
  showForm = false;
  loading = false;
  errorMessage = '';
  editingAccount: Account | null = null;

  currentAccount: Partial<Account> = this.getEmptyAccount();

  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.getAll().subscribe({
      next: (data: Account[]) => {
        console.log('✅ Accounts loaded:', data);
        this.accounts = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err: any) => {
        console.error('❌ Error loading accounts:', err);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลบัญชีได้: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  saveAccount() {
    this.loading = true;
    this.errorMessage = '';

    // Remove fields that backend doesn't accept
    const { isArchived, includeInTotal, _id, createdAt, updatedAt, ...accountData } = this
      .currentAccount as any;

    if (this.editingAccount && this.editingAccount._id) {
      this.accountService.update(this.editingAccount._id, accountData).subscribe({
        next: () => {
          this.loadAccounts();
          this.cancelEdit();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถอัพเดทบัญชีได้: ' + (err.error?.message || err.message);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.accountService.create(accountData).subscribe({
        next: () => {
          this.loadAccounts();
          this.cancelEdit();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.errorMessage = 'ไม่สามารถสร้างบัญชีได้: ' + (err.error?.message || err.message);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  editAccount(account: Account) {
    this.editingAccount = account;
    this.currentAccount = { ...account };
    this.showForm = true;
  }

  deleteAccount(id: string) {
    if (!confirm('คุณต้องการลบบัญชีนี้ใช่หรือไม่?')) {
      return;
    }

    this.loading = true;
    this.accountService.delete(id).subscribe({
      next: () => {
        this.loadAccounts();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = 'ไม่สามารถลบบัญชีได้: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelEdit() {
    this.showForm = false;
    this.editingAccount = null;
    this.currentAccount = this.getEmptyAccount();
    this.loading = false;
  }

  getEmptyAccount(): Partial<Account> {
    return {
      name: '',
      type: 'bank',
      balance: 0,
      currency: 'THB',
      description: '',
    };
  }

  get totalBalance(): number {
    return this.accounts
      .filter((a) => !a.isArchived && a.includeInTotal)
      .reduce((sum, a) => sum + a.balance, 0);
  }

  getAccountIcon(type: string): string {
    const icons: { [key: string]: string } = {
      bank: '🏦',
      cash: '💵',
      credit_card: '💳',
      e_wallet: '📱',
      investment: '📈',
      crypto: '₿',
    };
    return icons[type] || '💼';
  }

  getAccountTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      bank: 'ธนาคาร',
      cash: 'เงินสด',
      credit_card: 'บัตรเครดิต',
      e_wallet: 'กระเป๋าเงินอิเล็กทรอนิกส์',
      investment: 'การลงทุน',
      crypto: 'สกุลเงินดิจิทัล',
    };
    return labels[type] || type;
  }

  formatNumber(value: number): string {
    return value.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
