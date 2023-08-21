const fs = require('fs');
const path = require('path');

const UserModel = require('../models/UserModel');
// const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')).toString());

const getAllUsers = async(req, res) => {
    try {
        const users = await UserModel.findAll();
        if(users.length) res.status(200).json({ ok: true, users});
        else res.status().json({ ok: true, msg: 'No users present', users});
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getUser = async(req, res) => {
    try {
        const user = await UserModel.find(req.params.id);
        if(user) res.status(200).json(user);
        else res.status(200).json({ msg: 'No user with given id'});
    } catch (error) {
        res.status(500).json({ error });
    }

};

const updateUser = async(req, res) => {

};

const deleteUser = async(req, res) => {
    const user = await UserModel.delete(req.params.apikey).catch(error => {
        res.status(500).json({error});
    });
    if(user) res.status(201).json({ ok: true, msg: 'User deleted successfuly', user});
};

const registerUser = async(req, res) => { 
    const userData = {
        username: req.params.username,
        ips: [req.ip]
    };
    const user = await UserModel.create(userData);
    res.status(201).json({ ok: true, msg: 'User created successfuly', user});
};

const registerUserIp = async(req, res) => { 
    try {
        const user = await UserModel.find(req.params.id);
        if(user) {
            if(!user.ips.includes(req.ip)) user.ips.push(req.ip);
            await UserModel.update(user);
            res.status(200).json({ok:true, msg: 'Ip added successfuly', user});
        } else res.status(404).json({ msg: 'No user with given id'});
    } catch (error) {
        res.status(500).json({ error });
    }
};

const deleteUserIp = async(req, res) => { 
    try {
        const user = await UserModel.find(req.params.id);
        if(user) {
            const ipIndex = user.ips.indexOf(req.ip);
            if(ipIndex !== -1) user.ips.splice(ipIndex, 1); // remove one value from ips from index of given ip
            await UserModel.update(user);
            res.status(200).json({ok:true, msg: 'Ip removed successfuly', user});
        } else res.status(404).json({ msg: 'No user with given id'});
    } catch (error) {
        res.status(500).json({ error });
    }
};


module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    registerUser,
    registerUserIp,
    deleteUserIp
}