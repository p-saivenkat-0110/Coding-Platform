const { MongoClient } = require('./app_modules/node_modules/mongodb');
const url = 'mongodb://localhost:27017';

const client = new MongoClient(url);
const myDB = client.db('myAPP');
async function connectToDB() {
    try {
        await client.connect();
        const collection1 = myDB.collection('user_login_info');
        const collection2 = myDB.collection('contests');
        const collection3 = myDB.collection('problems');
        // console.log('Connected to MongoDB');
        return [collection1, collection2, collection3];
    } catch (error) {
        // console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { connectToDB };