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

describe('Test documents-dao', () => {

    it ('getDocument returns document from uuid', async () => {
        let dbDocument = await getDocument('0001');

        expect(dbDocument).toBeTruthy();

        expect(dbDocument!.owner!.uid).toBe(documents[0].owner.uid);
        expect(dbDocument!.owner!.email).toBe(documents[0].owner.email);
        expect(dbDocument!.owner!.name).toBe(documents[0].owner.name);

        expect(dbDocument!.title).toBe(documents[0].title);
        expect(dbDocument!.uuid).toBe(documents[0].uuid);
        expect(dbDocument!.sharedWith).toStrictEqual(documents[0].sharedWith);
        expect(dbDocument!.annotations).toMatchObject(documents[0].annotations);
    })

    it ('getDocument fails when uuid does not exist', async () => {
        let dbDocument = await getDocument('9999');

        expect(dbDocument).toBeFalsy();
    })

    it ('getDocuments returns documents owned by and shared to User', async () => {
        let dbDocuments = await getDocuments({uid: '001', email: 'User1@email.com'});

        expect(dbDocuments).toBeTruthy();
        expect(dbDocuments.length).toBe(2);

        expect(dbDocuments[0]!.owner!.uid).toBe(documents[0].owner.uid);
        expect(dbDocuments[0]!.owner!.email).toBe(documents[0].owner.email);
        expect(dbDocuments[0]!.owner!.name).toBe(documents[0].owner.name);

        expect(dbDocuments[0]!.title).toBe(documents[0].title);
        expect(dbDocuments[0]!.uuid).toBe(documents[0].uuid);
        expect(dbDocuments[0]!.sharedWith).toStrictEqual(documents[0].sharedWith);
        expect(dbDocuments[0]!.annotations).toMatchObject(documents[0].annotations);

        expect(dbDocuments[1]!.owner!.uid).toBe(documents[1].owner.uid);
        expect(dbDocuments[1]!.owner!.email).toBe(documents[1].owner.email);
        expect(dbDocuments[1]!.owner!.name).toBe(documents[1].owner.name);

        expect(dbDocuments[1]!.title).toBe(documents[1].title);
        expect(dbDocuments[1]!.uuid).toBe(documents[1].uuid);
        expect(dbDocuments[1]!.sharedWith).toStrictEqual(documents[1].sharedWith);
        expect(dbDocuments[1]!.annotations).toMatchObject(documents[1].annotations);
    })

