const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('../localStorage');

const setItem = (key, value) => {
    localStorage.setItem(key, value);
}

const getItem = (key) => {
    return localStorage.getItem(key);
}

const removeItem = (key) => {
    localStorage.removeItem(key);
}

const clearItem = () => {
    localStorage.clear()
}

module.exports = {
    setItem,
    getItem,
    removeItem,
    clearItem
}