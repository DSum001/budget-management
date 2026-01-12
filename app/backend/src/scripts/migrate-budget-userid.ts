import { MongoClient, ObjectId } from 'mongodb';

async function migrateBudgets() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('budget-management');
    const budgetsCollection = db.collection('budgets');

    // Find all budgets
    const budgets = await budgetsCollection.find({}).toArray();
    console.log(`📊 Found ${budgets.length} budgets`);

    let updated = 0;
    let skipped = 0;

    for (const budget of budgets) {
      if (budget.userId && typeof budget.userId === 'string') {
        // Convert string to ObjectId
        try {
          const userIdObjectId = new ObjectId(budget.userId);

          await budgetsCollection.updateOne(
            { _id: budget._id },
            { $set: { userId: userIdObjectId } },
          );

          console.log(
            `✅ Updated budget ${budget._id}: "${budget.userId}" -> ObjectId(${userIdObjectId})`,
          );
          updated++;
        } catch (error) {
          console.error(
            `❌ Failed to convert userId for budget ${budget._id}:`,
            error.message,
          );
        }
      } else if (budget.userId instanceof ObjectId) {
        console.log(`⏭️  Budget ${budget._id} already has ObjectId userId`);
        skipped++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   Total: ${budgets.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateBudgets();
