import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import appRoutes from "../../src/routes/appRoutes";
import express, {Request, Response, NextFunction} from 'express';
import request from 'supertest';
import {document1, document2, document3, user1, user2, user3, user4} from '../testingData';

// Provide auth middleware mocks here (in order of tests as we require different implementations for some)
jest.mock("../../src/firebase/middleware", () => ({
    validateToken: jest.fn()
        // it('gets all users from server')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => next())
        // it ('gets user by id')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => next())
        // it ('returns 404 when user doesnt exist')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => next())
        // it ('creates a new user')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user4.email,
                uid: user4.uid
            }
            return next();
        })
        // it ('returns the existing user')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user3.email,
                uid: user3.uid
            }
            return next();
        })
        // it ('gets all documents for user')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it ('returns an empty list when no documents found')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user4.email,
                uid: user4.uid
            }
            return next();
        })
        // it ('returns a 404 when the user isnt found')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user4.email,
                uid: user4.uid
            }
            return next();
        })
}));

// Test data
const users = [user1, user2, user3];
const documents = [document1, document2, document3];

const app = express();
app.use(express.json());
app.use('/', appRoutes);

let mongod: MongoMemoryServer;
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
        await mongoose.connection.db.collection('documents').insertMany(documents);
    } catch (e) {
        console.log(e);
    }
})

afterEach(async () => {
    await dropCollections();
})

describe('GET /users', () => {

    it('gets all users from server', (done) => {

        request(app)
            .get('/users')
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                const usersFromApi = res.body;
                expect(usersFromApi).toBeTruthy();
                expect(usersFromApi.length).toBe(3);

                return done();
            })
    });

});


describe('GET /users/:uid', () => {

    it('gets user by id', (done) => {
        request(app)
            .get('/users/0001')
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                const userFromApi = res.body;
                expect(userFromApi).toBeTruthy();

                expect(userFromApi.uid).toBe('0001');
                expect(userFromApi.name).toBe('User1');
                expect(userFromApi.email).toBe('User1@email.com');

                return done();
            })
    });

    it('returns 404 when user doesnt exist', (done) => {
        request(app)
            .get('/users/0005')
            .send()
            .expect(404, done);
    });

});

describe(('POST /user'), () => {

    it ('creates a new user', (done) => {
        request(app)
            .post('/user')
            .send({name: user4.name})
            .expect(201, done);
    });

    it ('returns the existing user', (done) => {
        request(app)
            .post('/user')
            .send({name: user3.name})
            .expect(200, done);
    });

})

describe(('GET /user/documents'), () => {

    it('gets all documents for user (owned and shared with this user)', (done) => {
        request(app)
            // User 1
            .get('/user/documents')
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                let docsFromApi = res.body;
                expect(docsFromApi).toBeTruthy();
                expect(docsFromApi.length).toBe(2);

                // owned by user1
                expect(docsFromApi[0]!.owner.uid).toEqual(user1.uid);
                expect(docsFromApi[0]!.owner.email).toBe(user1.email);
                expect(docsFromApi[0]!.owner.name).toBe(user1.name);
                expect(docsFromApi[0]!.title).toBe(documents[0].title);
                expect(docsFromApi[0]!.uuid).toBe(documents[0].uuid);
                expect(docsFromApi[0]!.sharedWith).toStrictEqual(documents[0].sharedWith);

                // owned by user2
                expect(docsFromApi[1]!.owner.uid).toBe(user2.uid);
                expect(docsFromApi[1]!.owner.email).toBe(user2.email);
                expect(docsFromApi[1]!.owner.name).toBe(user2.name);
                expect(docsFromApi[1]!.title).toBe(documents[1].title);
                expect(docsFromApi[1]!.uuid).toBe(documents[1].uuid);
                expect(docsFromApi[1].sharedWith).toContain(user1.email)

                return done();
            })
    })

    it('returns an empty list when no documents found', async () => {
        // insert new user, has no documents
        await mongoose.connection.db.collection('users').insertOne(user4);

        request(app)
            // User  (no documents)
            .get('/user/documents')
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) return err;

                let docsFromApi = res.body;
                expect(docsFromApi).toBeTruthy();
                expect(docsFromApi).toEqual([]);
            })
    });

    it('returns a 404 when the user isnt found', (done) => {
        request(app)
            // User  (no documents)
            .get('/user/documents')
            .send()
            .expect(404, done);
    })

})
