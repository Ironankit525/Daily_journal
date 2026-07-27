import mongoose from 'mongoose';

const uri = 'mongodb+srv://aka_ankit:ankit5706@cluster0.vqn6mtv.mongodb.net/TT';

async function test() {
  await mongoose.connect(uri);
  const admin = mongoose.connection.db.admin();
  const dbs = await admin.listDatabases();
  console.log('=== DATABASES ON ATLAS CLUSTER ===');
  console.log(dbs.databases.map(d => d.name));

  for (const dbInfo of dbs.databases) {
    if (['admin', 'local'].includes(dbInfo.name)) continue;
    const db = mongoose.connection.useDb(dbInfo.name);
    const collections = await db.db.listCollections().toArray();
    console.log(`\nDB [${dbInfo.name}] Collections:`, collections.map(c => c.name));
    if (collections.some(c => c.name === 'users')) {
      const count = await db.collection('users').countDocuments();
      const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
      console.log(`DB [${dbInfo.name}] Users (${count}):`, users);
    }
  }
  process.exit(0);
}

test().catch(err => {
  console.error('Atlas error:', err);
  process.exit(1);
});
