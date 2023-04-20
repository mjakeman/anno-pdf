import {User} from '../../models/User';

async function getUsers() {
    return User.find();
}

async function createUser(user: any) {
    return await User.create(user);
}

export { createUser, getUsers }