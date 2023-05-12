import { Request, Response } from 'express';
import {getUsers, getUser, createUser} from "../data/users/users-dao";
import {getDocuments} from "../data/documents/documents-dao";
import {User} from "../models/User";
import admin from "firebase-admin";


class UserController {

  getUsers = async (_req: Request, res: Response) => {
    return res.json(await getUsers());
  }

  getUser = async (req: Request, res: Response) => {
    const dbUser = await getUser(req.params.uid);

    if (dbUser) {
      return res.status(200).json(dbUser);
    }

    return res.status(404).send("Could not find user");
  }

  getDocuments = async (req: Request, res: Response) => {
    let currentUserUid = req.user!.uid;

    const currentUserObj = await getUser(currentUserUid);
    if (!currentUserObj) return res.status(404).send('User not found');

    const documents = await getDocuments(currentUserObj);
    return res.json(documents);
  }

  createUser = async (req: Request, res: Response) => {
    const user = req.user!;

    let displayName;
    if (req.body.name) {
      displayName = req.body.name;
    } else {
      displayName = "User";
    }

    // Check for existing user
    const existingUser = await User.findOne({ uid: user.uid });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Create new user
    const dbUser = await createUser({
      uid: user.uid,
      name: displayName,
      email: user.email
    });

    if (dbUser) {
      console.log('User created - firebase uid : ' + dbUser.uid);
      return res.status(201).json(dbUser);
    }

    // Didn't work - give up
    return res.status(500).send('Could not create user');
  }

  /** For cypress test cleanup only **/
  deleteUser = async (req: Request, res: Response) => {
    const dbUser = await User.findOneAndDelete({ email: req.body.email });

    if (dbUser) {
      // delete from firebase
      try {
        await admin.auth().deleteUser(dbUser.uid);
      } catch (e) {
        console.log(e);
        return res.status(500).send()
      }

      return res.status(200).send("Deleted user successfully");
    }

    return res.status(404).send("Could not find user");
  }
}

export { UserController };
