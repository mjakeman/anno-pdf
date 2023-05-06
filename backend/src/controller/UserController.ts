import { Request, Response } from 'express';
import {getUsers, getUser, createUser} from "../data/users/users-dao";
import {getDocuments} from "../data/documents/documents-dao";

class UserController {

  async getUsers(_req: Request, res: Response) {
    return res.json(await getUsers());
  }

  async getUser(req: Request, res: Response) {
    const dbUser = await getUser(req.params.uid);

    if (dbUser) {
      return res.status(200).json(dbUser);
    }

    return res.status(404).send("Could not find user");
  }

  async getDocuments(req: Request, res: Response) {
    let currentUser: string;
    if (req.user) {
      currentUser = req.user;
    } else {
      return res.status(400).send('User not found in request object.');
    }

    const currentUserObj = await getUser(currentUser);
    const documents = await getDocuments(currentUserObj);
    const result: Object[] = [];

    // Add document owner information.
    for (let doc of documents) {
      const data = JSON.parse(JSON.stringify(doc));

      const createdByUid = data.createdBy;
      const userObject = await getUser(createdByUid);
      if (userObject) {
        data['owner'] = {
          uid: createdByUid,
          email: userObject.email,
          name: userObject.name
        }
      }

      result.push(data);
    }

    return res.json(result);
  }

  async createUser(req: Request, res: Response) {
    const dbUser = await createUser(req.body);

    if (dbUser) {
      console.log('User created - firebase uid : ' + dbUser.uid);
      return res.status(201).json(dbUser);
    }

    return res.status(422).send('User already exists');
  }
}

export { UserController };
