import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {createUser, getUser, getUserByEmail, getUsers, getUsersByEmailList} from "../users/users-dao";
import {User} from "../../models/User";

let mongod: MongoMemoryServer;

const user1 = {
    uid: '0001',
    name: 'User1',
    email: 'User1@email.com',
}

const user2 = {
    uid: '0002',
    name: 'User2',
    email: 'User2@email.com',
}

const user3 = {
    uid: '0003',
    name: 'User3',
    email: 'User3@email.com',
}

const users = [user1, user2, user3];

const connectDB = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
};

const dropDB = async () => {
    if (mongod) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    }
}

const dropCollections = async () => {
    if (mongod) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
        }
    }
};

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await dropDB();
});

beforeEach(async () => {
    try {
        await mongoose.connection.db.collection('users').insertMany(users);
    } catch (e) {
        console.log(e);
    }
})
afterEach(async () => {
    await dropCollections();
})

describe('Test users-dao', () => {

    it ('getUsers returns all users', async () => {
        let dbUsers = await getUsers();

        expect(dbUsers).toBeTruthy();
        expect(dbUsers.length).toBe(3);

        expect(dbUsers[0].name).toBe(users[0].name);
        expect(dbUsers[0].uid).toBe(users[0].uid);
        expect(dbUsers[0].email).toBe(users[0].email);

        expect(dbUsers[1].name).toBe(users[1].name);
        expect(dbUsers[1].uid).toBe(users[1].uid);
        expect(dbUsers[1].email).toBe(users[1].email);

        expect(dbUsers[2].name).toBe(users[2].name);
        expect(dbUsers[2].uid).toBe(users[2].uid);
        expect(dbUsers[2].email).toBe(users[2].email);
    })

    it ('getUser returns user', async () => {
        let dbUser = await getUser(users[0].uid);

        expect(dbUser).toBeTruthy();
        expect(dbUser!.name).toBe(users[0].name);
        expect(dbUser!.uid).toBe(users[0].uid);
        expect(dbUser!.email).toBe(users[0].email);
    })

    it ('getUserByEmail returns user', async () => {
        let dbUser = await getUserByEmail(users[1].email);

        expect(dbUser).toBeTruthy();
        expect(dbUser!.name).toBe(users[1].name);
        expect(dbUser!.uid).toBe(users[1].uid);
        expect(dbUser!.email).toBe(users[1].email);
    })

    it ('getUsersByEmailList returns correct users', async () => {
        const emails = [users[1].email, users[2].email]
        let dbUsers = await getUsersByEmailList(emails);

        expect(dbUsers).toBeTruthy();
        expect(dbUsers.length).toBe(2);
    })

    it ('getUsersByEmailList returns users including those not in db', async () => {
        const emails = [users[0].email, "fake@email.com"]
        let dbUsers = await getUsersByEmailList(emails);

        expect(dbUsers).toBeTruthy();
        expect(dbUsers.length).toBe(2);

        expect(dbUsers[0].name).toBe(users[0].name);
        expect(dbUsers[0].uid).toBe(users[0].uid);
        expect(dbUsers[0].email).toBe(users[0].email);

        expect(dbUsers[1].name).toBe(null);
        expect(dbUsers[1].uid).toBe(null);
        expect(dbUsers[1].email).toBe("fake@email.com");
    })

    it ('createUser adds User to db', async () => {
        const newUser = new User({
            uid: '0004',
            name: 'User4',
            email: 'User4@email.com',
        });

        await createUser(newUser);
        let allUsers = await getUsers();
        expect(allUsers.length).toBe(4);
    })

    it ('createUser fails when missing a field', async () => {
        const newUser = new User({
            uid: '0004',
            name: 'User4',
        });

        const dbUser = await createUser(newUser);
        expect(dbUser).toBeFalsy();

        const allUsers = await getUsers();
        expect(allUsers.length).toBe(3);
    })

})