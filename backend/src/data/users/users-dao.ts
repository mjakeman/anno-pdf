import {User} from '../../models/User';

async function getUsers() {
    return User.find();
}

async function createUser(user: any) {
    const existingUser = await User.findOne({ uuid: user.uuid });
    if (existingUser) {
        return null;
    }
    return await User.create(user);
}

export { createUser, getUsers }