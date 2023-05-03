import {User} from '../../models/User';

async function getUsers() {
    return User.find();
}

async function getUser(uid: String) {
    return User.findOne({uid: uid});
}

async function createUser(user: any) {
    try {
        return await User.create(user);
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export { createUser, getUsers, getUser }