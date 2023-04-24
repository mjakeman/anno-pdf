import { Request, Response } from 'express';
import {getUsers, getUser, createUser} from "../data/users/users-dao";
import {getDocuments} from "../data/documents/documents-dao";

class UserController {

  async getUsers(_req: Request, res: Response) {
    return res.json(await getUsers());
  }

  async getUser(req: Request, res: Response) {
    const dbUser = await getUser(req.params.uuid);

    if (dbUser) {
      return res.status(200).json(dbUser);
    }

    return res.status(404).send("Could not find user");
  }

  async getDocuments(req: Request, res: Response) {
    const documents = await getDocuments(req.params.uuid);
    return res.json(documents);
  }

  async createUser(req: Request, res: Response) {
    const dbUser = await createUser(req.body);

    if (dbUser) {
      console.log('User created - uuid : ' + dbUser.uuid);
      return res.status(201).json(dbUser);
    }

    return res.status(422).send('User already exists');
  }
}

export { UserController };
