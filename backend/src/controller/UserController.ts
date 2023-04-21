import { Request, Response } from 'express';
import {getUsers, createUser} from "../data/users/users-dao";

class UserController {

  async getUsers(_req: Request, res: Response) {
    res.json(await getUsers());
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
