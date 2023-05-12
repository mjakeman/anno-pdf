import {User} from '../../models/User';

/**
 * This module is responsible for mongo queries related to the Document model.
 */

async function getUsers() {
    return User.find();
}

async function getUser(uid: String) {
    return User.findOne({uid: uid});
}

async function getUsersByEmailList(emails: String[]) {
    const users: any[] = [];

    for (const email of emails) {
        const user = await getUserByEmail(email);

        if (user) {
            users.push({
                uid: user.uid,
                email: user.email,
                name: user.name
            });
        } else {
            users.push({
                uid: null,
                email: email,
                name: null
            });
        }
    }

    return users;
}

async function getUserByEmail(email: String) {
    return User.findOne({email: email});
}

async function createUser(user: any) {
    try {
        return await User.create(user);
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export { createUser, getUsers, getUser, getUsersByEmailList, getUserByEmail }