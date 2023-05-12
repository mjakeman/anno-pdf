const user1 = {
    uid: '0001',
    name: 'User1',
    email: 'User1@email.com',
}

const user2 = {
    uid: '0002',
    name: 'User2',
    email: 'User2@email.com',
}

const user3 = {
    uid: '0003',
    name: 'User3',
    email: 'User3@email.com',
}

const user4 = {
    uid: '0004',
    name: 'User4',
    email: 'User4@email.com',
}

const document1 = {
    owner: user1,
    title: 'Document1',
    uuid: '0001',
    sharedWith: ['shared1@email.com'],
}

const document2 = {
    owner: user2,
    title: 'Document2',
    uuid: '0002',
    sharedWith: [user1.email],
}

const document3 = {
    owner: user3,
    title: 'Document3',
    uuid: '0003',
    sharedWith: ['shared3@email.com'],
}

export {user1, user2, user3, user4, document1, document2, document3}