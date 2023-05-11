import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {getDocument, createDocument, deleteDocument, updateDocument, addSharedUser, removeSharedUser, getDocuments} from "../documents/documents-dao";
import {Document} from "../../models/Document";

let mongod: MongoMemoryServer;

const document1 = {
    owner: {
        uid: '001',
        email: 'User1@email.com',
        name: 'User1'
    },
    title: 'Document1',
    uuid: '0001',
    sharedWith: ['shared1@email.com'],
    annotations: {},
}

const document2 = {
    owner: {
        uid: '002',
        email: 'User2@email.com',
        name: 'User2'
    },
    title: 'Document2',
    uuid: '0002',
    sharedWith: ['User1@email.com'],
    annotations: {},
}

const document3 = {
    owner: {
        uid: '003',
        email: 'User3@email.com',
        name: 'User3'
    },
    title: 'Document3',
    uuid: '0003',
    sharedWith: ['shared3@email.com'],
    annotations: {},
}

const documents = [document1, document2, document3];

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
        await mongoose.connection.db.collection('documents').insertMany(documents);
    } catch (e) {
        console.log(e);
    }
})
afterEach(async () => {
    await dropCollections();
})
