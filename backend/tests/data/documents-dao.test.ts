import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {getDocument, createDocument, deleteDocument, updateDocument, addSharedUser, removeSharedUser, getDocuments} from "../../src/data/documents/documents-dao";
import {Document} from "../../src/models/Document";
import {document1, document2, document3, user1, user4} from "../testingData";

let mongod: MongoMemoryServer;

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
    })

    it ('getDocument fails when uuid does not exist', async () => {
        let dbDocument = await getDocument('9999');

        expect(dbDocument).toBeFalsy();
    })

    it ('getDocuments returns documents owned by and shared to User', async () => {
        let dbDocuments = await getDocuments(user1);

        expect(dbDocuments).toBeTruthy();
        expect(dbDocuments.length).toBe(2);

        expect(dbDocuments[0]!.owner!.uid).toBe(documents[0].owner.uid);
        expect(dbDocuments[0]!.owner!.email).toBe(documents[0].owner.email);
        expect(dbDocuments[0]!.owner!.name).toBe(documents[0].owner.name);

        expect(dbDocuments[0]!.title).toBe(documents[0].title);
        expect(dbDocuments[0]!.uuid).toBe(documents[0].uuid);
        expect(dbDocuments[0]!.sharedWith).toStrictEqual(documents[0].sharedWith);

        expect(dbDocuments[1]!.owner!.uid).toBe(documents[1].owner.uid);
        expect(dbDocuments[1]!.owner!.email).toBe(documents[1].owner.email);
        expect(dbDocuments[1]!.owner!.name).toBe(documents[1].owner.name);

        expect(dbDocuments[1]!.title).toBe(documents[1].title);
        expect(dbDocuments[1]!.uuid).toBe(documents[1].uuid);
        expect(dbDocuments[1]!.sharedWith).toStrictEqual(documents[1].sharedWith);
    })

    it ('createDocument adds Document to db', async () => {
        const newDocument = new Document({
            owner: user4,
            title: 'Document4',
            uuid: '0004',
            sharedWith: [],
            annotations: {},
        });

        await createDocument(newDocument);
        
        let dbDocument = await getDocument('0004');

        expect(dbDocument).toBeTruthy();
        expect(newDocument).toBeTruthy();

        expect(dbDocument!.owner!.uid).toBe(newDocument.owner!.uid);
        expect(dbDocument!.owner!.email).toBe(newDocument.owner!.email);
        expect(dbDocument!.owner!.name).toBe(newDocument.owner!.name);

        expect(dbDocument!.title).toBe(newDocument.title);
        expect(dbDocument!.uuid).toBe(newDocument.uuid);
        expect(dbDocument!.sharedWith).toStrictEqual(newDocument.sharedWith);
    })

    it ('createDocument fails when missing a field', async () => {
        const newDocument = new Document({
            owner: {
                uid: '0005',
                email: 'User5@email.com',
                name: 'User5'
            },
            uuid: '0005',
            sharedWith: [],
            annotations: {},
        });

        const dbDocument = await createDocument(newDocument);
        expect(dbDocument).toBeFalsy();
    })

    it ('deleteDocument deletes Document from db', async () => {
        await deleteDocument('0003');

        let dbDocument = await getDocument('0003');
        expect(dbDocument).toBeFalsy();
    })

    it ('deleteDocument fails when document does not exist', async () => {
        let dbDocument = await deleteDocument('9999');
        expect(dbDocument).toBeFalsy();
    })

    it ('updateDocument updates Document from db', async () => {
        await updateDocument('0001', {title: 'NewTitle'});

        let dbDocument = await getDocument('0001');
        
        expect(dbDocument).toBeTruthy();
        expect(dbDocument!.title).toBe('NewTitle');
    })

    it ('addSharedUser adds user to Document', async () => {
        await addSharedUser('0001', 'shared2@email.com');

        let dbDocument = await getDocument('0001');

        expect(dbDocument).toBeTruthy();
        expect(dbDocument!.sharedWith).toStrictEqual(['shared1@email.com', 'shared2@email.com']);
    })

    it ('removeSharedUser removes user from Document', async () => {
        await removeSharedUser('0003', 'shared3@email.com');

        let dbDocument = await getDocument('0003');
        
        expect(dbDocument).toBeTruthy();
        expect(dbDocument!.sharedWith).toStrictEqual([]);

    })
})