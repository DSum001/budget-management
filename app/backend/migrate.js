const { MongoClient } = require('mongodb');

async function migrateBudgets() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('budget-management');
    const budgetsCollection = db.collection('budgets');

    const budgets = await budgetsCollection.find({}).toArray();
    console.log(`📊 Found ${budgets.length} budgets\n`);

    // Show all budget details
    budgets.forEach((budget, index) => {
      console.log(`Budget ${index + 1}:`);
      console.log(`  _id: ${budget._id}`);
      console.log(`  name: ${budget.name}`);
      console.log(`  userId: ${budget.userId} (type: ${typeof budget.userId})`);
      console.log(`  amount: ${budget.amount}`);
      console.log(`  isActive: ${budget.isActive}`);
      console.log('');
    });

    // Fix 1: Convert userId to string if needed
    let updated = 0;
    for (const budget of budgets) {
      if (budget.userId && typeof budget.userId !== 'string') {
        const userIdString = budget.userId.toString();

        await budgetsCollection.updateOne(
          { _id: budget._id },
          { $set: { userId: userIdString } },
        );

        console.log(
          `✓ Updated budget "${budget.name}": ${budget.userId} → ${userIdString}`,
        );
        updated++;
      }
    }

    // Fix 2: Add isActive field to all budgets that don't have it
    let activatedCount = 0;
    for (const budget of budgets) {
      if (budget.isActive === undefined || budget.isActive === null) {
        await budgetsCollection.updateOne(
          { _id: budget._id },
          { $set: { isActive: true } },
        );

        console.log(`✓ Added isActive=true to budget "${budget.name}"`);
        activatedCount++;
      }
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`   - Updated userId: ${updated} budgets`);
    console.log(`   - Added isActive: ${activatedCount} budgets`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

migrateBudgets();
