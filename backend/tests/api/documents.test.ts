import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import appRoutes from "../../src/routes/appRoutes";
import express, {NextFunction, Request, Response} from 'express';
import request from 'supertest';
import {document1, document2, document3, user1, user2, user3, user4} from '../testingData';
import {getDocument} from "../../src/data/documents/documents-dao";


// Provide auth middleware mocks here (in order of tests as we require different implementations for some)
jest.mock("../../src/firebase/middleware", () => ({
    validateToken: jest.fn()
        // it('checks viewing permissions for getting document')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user4.email,
                uid: user4.uid
            }
            return next();
        })
        // it('404 when document does not exist')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => {
            return next();
        })
        // it('checks owner permissions for deleting document')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it('404 when document does not exist')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => {
            return next();
        })
        // it('checks viewing permissions for updating document')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user4.email,
                uid: user4.uid
            }
            return next();
        })
        // it('404 when document does not exist')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => {
            return next();
        })
        // it('Updates the document correctly')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it('checks viewing permissions for copying document')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user4.email,
                uid: user4.uid
            }
            return next();
        })
        // it('404 when document does not exist')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => {
            return next();
        })
        // it('checks viewing permissions for sharing document')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user4.email,
                uid: user4.uid
            }
            return next();
        })
        // it('404 when document does not exist')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => {
            return next();
        })
        // it('400 when no email in request body')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it ('400 when sharing with own user')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it('Shares the document correctly')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it('checks owner permissions for removing user from document')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it('404 when document does not exist')
        .mockImplementationOnce((_req: Request, _res: Response, next: NextFunction) => {
            return next();
        })
        // it('400 when no email in request body')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it ('400 when removing own user')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it('Removes user correctly')
        .mockImplementationOnce((req: Request, _res: Response, next: NextFunction) => {
            req.user = {
                email: user1.email,
                uid: user1.uid
            }
            return next();
        })
        // it('Create document error when user not found')
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
    jest.clearAllMocks();

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

describe('GET /documents/:uuid error checks', () => {

    it('checks viewing permissions for getting document', async () => {
        request(app)
            .get(`/documents/${document1.uuid}`)
            .send()
            .expect(403) // doesn't have document viewing permissions
            .end((err, res) => {
                if (err) return err;

                expect(res.text).toBe('Insufficient permissions (Viewing)');
            })
    });

    it ('404 when document does not exist', (done) => {
        request(app)
            .get(`/documents/DOES_NOT_EXIST`)
            .send()
            .expect(404, done);
    });
})

describe('DELETE /documents/:uuid/delete error checks', () => {

    it('checks owner permissions for deleting document', async () => {
        // User 1 has viewing access but is not the owner of document2
        request(app)
            .delete(`/documents/${document2.uuid}/delete`)
            .send()
            .expect(403) // doesn't have document viewing permissions
            .end((err, res) => {
                if (err) return err;
                expect(res.text).toBe('Insufficient permissions (Owner)');
            })
    });

    it ('404 when document does not exist', (done) => {
        request(app)
            .delete(`/documents/DOES_NOT_EXIST/delete`)
            .send()
            .expect(404, done);
    });

})

describe('POST /documents/:uuid/update', () => {

    it('checks viewing permissions for updating document', (done) => {
        request(app)
            .post(`/documents/${document2.uuid}/update`)
            .send()
            .expect(403) // doesn't have document viewing permissions
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('Insufficient permissions (Viewing)');
                return done();
            })
    });

    it('404 when document does not exist', (done) => {
        request(app)
            .post(`/documents/DOES_NOT_EXIST/update`)
            .send()
            .expect(404, done);
    });

    it('Updates the document correctly', async () => {
        const originalDoc = await getDocument(document1.uuid);
        expect(originalDoc!.title).toBe(document1.title);

        request(app)
            .post(`/documents/${document1.uuid}/update`)
            .send({title: 'New Title'})
            .expect(200)
            .end(async (err, _res) => {
                if (err) return err;

                const updatedDoc = await getDocument(document1.uuid);
                expect(updatedDoc!.title).toBe('New Title');
                expect(updatedDoc!.lastUpdatedBy).toBe(user1.uid);

                return;
            });
    });

})

describe('POST /documents/:uuid/copy error checks', () => {

    it('checks viewing permissions for copying document', (done) => {
        request(app)
            .post(`/documents/${document2.uuid}/copy`)
            .send()
            .expect(403) // doesn't have document viewing permissions
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('Insufficient permissions (Viewing)');
                return done();
            })
    });

    it('404 when document does not exist', (done) => {
        request(app)
            .post(`/documents/DOES_NOT_EXIST/copy`)
            .send()
            .expect(404, done);
    });

})

describe('POST /documents/:uuid/share', () => {

    it('checks viewing permissions for sharing document', (done) => {
        request(app)
            .post(`/documents/${document2.uuid}/share`)
            .send()
            .expect(403) // doesn't have document viewing permissions
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('Insufficient permissions (Viewing)');
                return done();
            })
    });

    it('404 when document does not exist', (done) => {
        request(app)
            .post(`/documents/DOES_NOT_EXIST/share`)
            .send()
            .expect(404, done);
    });

    it('400 when no email in request body', (done) => {
        request(app)
            .post(`/documents/${document1.uuid}/share`)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('"email" field is required in the request body');
                return done();
            })
    });

    it('400 when sharing with own user', (done) => {
        request(app)
            .post(`/documents/${document1.uuid}/share`)
            .send({email: user1.email})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('Trying to share/remove own user from document');
                return done();
            })
    });

    it('Shares the document correctly', (done) => {
        request(app)
            .post(`/documents/${document1.uuid}/share`)
            .send({email: 'NewUser@email.com'})
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                const updatedDoc = res.body;
                expect(updatedDoc!.sharedWith).toContain('NewUser@email.com');
                done();
            });
    });

})

describe('POST /documents/:uuid/removeUser', () => {

    it('checks owner permissions for removing user from document', (done) => {
        request(app)
            .post(`/documents/${document2.uuid}/removeUser`)
            .send()
            .expect(403) // doesn't have document viewing permissions
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('Insufficient permissions (Owner)');
                return done();
            })
    });

    it('404 when document does not exist', (done) => {
        request(app)
            .post(`/documents/DOES_NOT_EXIST/removeUser`)
            .send()
            .expect(404, done);
    });

    it('400 when no email in request body', (done) => {
        request(app)
            .post(`/documents/${document1.uuid}/removeUser`)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('"email" field is required in the request body');
                return done();
            })
    });

    it('400 when removing own user', (done) => {
        request(app)
            .post(`/documents/${document1.uuid}/removeUser`)
            .send({email: user1.email})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('Trying to share/remove own user from document');
                return done();
            })
    });

    it('Removes user correctly', async () => {
        const originalDoc = await getDocument(document1.uuid);
        expect(originalDoc!.sharedWith).toContain(document1.sharedWith[0]);

        request(app)
            .post(`/documents/${document1.uuid}/removeUser`)
            .send({email: document1.sharedWith[0]})
            .expect(200)
            .end((err, res) => {
                if (err) return err;

                const updatedDoc = res.body;
                const stillContainsUser = updatedDoc!.sharedWith.includes(document1.sharedWith[0])
                expect(stillContainsUser).toBe(false);

                return;
            });
    });

})

describe('POST /documents/create error check', () => {

    it('Create document error when user not found', (done) => {
        // Given: User 4 not in mongo
        request(app)
            .post(`/documents/create`)
            .send({})
            .expect(500)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).toBe('Error fetching user details');
                done();
            });
    });

});