import {User} from '../../models/User';

async function getUsers() {
    return User.find();
}

async function getUser(id: String) {
    return User.findOne({uuid: id});
}

async function createUser(user: any) {
    try {
        return await User.create(user);
    } catch (e) {
        // User already exists
        return null;
    }
}

export { createUser, getUsers, getUser }