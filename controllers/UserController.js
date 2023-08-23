
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

const getAllUsers = asyncHandler(async(req, res) => {
        const users = await User.find();
        if(users.length) {
            users.forEach(user => user.apiKey = user.ips = undefined);
            res.status(200).json({ ok: true, users});
        }
        else res.status(404).json({ ok: true, msg: 'No users present', users});
});

const getUser = asyncHandler(async(req, res) => {
    if(req.query.apikey){
        const user = await User.find({apiKey: req.query.apikey});
        if(user.length) res.status(200).json(user);
        else res.status(200).json({ msg: 'No user with apikey'});
    } else res.status(200).json({ msg: 'Please pass apikey as query parameter'});

});

const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.deleteOne({apiKey: req.params.apikey});
    if(user) res.status(201).json({ ok: true, msg: 'User deleted successfuly'});
});

const registerUser = asyncHandler(async(req, res) => { 
    const userData = {
        apiKey : [...Array(5)].map(e => parseInt(Math.random() * 9)).join(''),
        username: req.params.username,
        ips: [req.ip]
    };
    const user = await User.create(userData);
    res.status(201).json({ ok: true, msg: 'User created successfuly', user});
});

const registerUserIp = asyncHandler(async(req, res) => { 
    try {
        if(!req.user.ips.includes(req.ip)) req.user.ips.push(req.ip);
        req.user.save();
        res.status(200).json({ok:true, msg: 'Ip added successfuly', user: req.user});
    } catch (error) {
        throw new Error(error);
    }
});

const deleteUserIp = asyncHandler(async(req, res) => { 
    try {
        const ipIndex = req.user.ips.indexOf(req.ip);
        if(ipIndex !== -1) req.user.ips.splice(ipIndex, 1); // remove one value from ips from index of given ip
        req.user.save();
        res.status(200).json({ok:true, msg: 'Ip removed successfuly', user: req.user});
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    registerUser,
    registerUserIp,
    deleteUserIp
}