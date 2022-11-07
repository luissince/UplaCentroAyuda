const users = [];

const adUser = (value) => {
    const existingUser = users.find(user => user.id == value.id);

    if (existingUser) {
        return { error: "El usuario ya existe" };
    }

    const user = value ;
    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find(user => user.id === id);

module.exports = { adUser, removeUser, getUser };