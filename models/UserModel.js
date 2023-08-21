const fs = require('fs');
const path = require('path');

// const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString());

class User {
    static readData() {
        try{
            const users = fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString();
            return JSON.parse(users);
        }catch(err){
            return [];
        }
    }

    static updateData(users) {
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(users, null, 2));
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            try{
                // const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString());
                const users = User.readData();
                users.forEach(user => {
                    user._id = user.apiKey = user.ips = undefined;
                });
                resolve(users);
            }catch(error){
                reject(error);
            }
    });
    }

    static find(id) {
        return new Promise((resolve, reject) => {
            try{
                // const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString());
                const users = User.readData();
                const user = users.find(user => user._id == id);
                if(user) resolve(user);
                else resolve();
            }catch(error){
                reject(error);
            }
        });
    }

    static update(user) {
        return new Promise((resolve, reject) => {
            // try{
                // const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString());
                const users = User.readData();
                const userIndex = users.findIndex(u => u._id === user._id && u.apiKey === user.apiKey);
                if(userIndex === -1) reject('No user found');
                else {
                    users[userIndex] = user;
                    User.updateData(users);
                    resolve(user);
                }
            // }catch(error){
                // reject(error);
            // }
        });
    }

    static create(user) {
        return new Promise((resolve, reject) => {
            try{
                // const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString());
                const users = User.readData();
                const _id = parseInt(Math.random() * 99) + 1;
                const apiKey = [...Array(5)].map(e => parseInt(Math.random() * 9)).join('');
                const usage = [{
                    date: new Date().toISOString().split('T')[0], // format yyyy-mm-dd
                    count: 0
                }];
                users.push({_id, apiKey, ...user, usage});
                User.updateData(users);
                resolve({_id, apiKey, ...user, usage});
            }catch(error){
                reject(error);
            }
        });
    }

    static delete(apiKey) {
        return new Promise((resolve, reject) => {
            try{
                if(!apiKey) reject({ ok: false, msg: 'Need apikey delete a user'});
                // const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString());
                const users = User.readData();
                const index = users.findIndex(user => user.apiKey == apiKey);
                if(index === -1) reject({ ok: false, msg: 'No user found'});
                else {
                    const user = users[index];
                    users.splice(index, 1);
                    User.updateData(users);
                    resolve(user);
                }
            }catch(error){
                reject(error);
            }
        });
    }
}
// User.readData();
module.exports = User;