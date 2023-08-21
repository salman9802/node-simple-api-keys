const fs = require('fs');
const path = require('path');

const User = require('./../../models/UserModel');
require('dotenv').config();

const validateKey = (req, res, next) => {
    try {
        const users = User.readData();
        const userIndex = users.findIndex(user => user.apiKey == req.params.apikey);
        // console.log(req.ip);
        if(userIndex !== -1) 
            if(users[userIndex].ips.includes(req.ip)) {
                const currentDate = new Date().toISOString().split('T')[0];
                const usageIndex = users[userIndex].usage.findIndex(usage => usage.date ===  currentDate);
                if(usageIndex !== -1) {
                    if(users[userIndex].usage[usageIndex].count < process.env.MAX_API_RATE_PER_DAY) {
                        users[userIndex].usage[usageIndex].count++;
                        // console.log(users); // [DEBUGGING PURPOSE]
                        User.updateData(users);
                        next();
                    }
                    else res.status(429).json({ ok:false, msg: 'Max limit reached'});
                } else {
                    users[userIndex].usage.push({date: currentDate, count: 0});
                    User.updateData(users);
                    next();
                }
            }
            else res.status(403).json({ ok: false, msg: 'Unauthorized Access'});
        else res.status(400).json({ ok: false, msg: 'Invalid key. Register for one at /api/user/register'});
    } catch (error) {
        res.status(500).json({ error });
    }
};

const validateUser = (req, res, next) => {
    try{
        const users = User.readData();
        const userIndex = users.findIndex(user => user._id == req.params.id && user.apiKey == req.params.apikey);
        if(userIndex !== -1) next();
        else {
            res.status(400).json({ok: false, msg: 'Invalid id or key provided.'});
        }
    }catch(error){
        res.status(500).json({ ok: false, msg: 'Unable to process at the moment', error });
    }
};

module.exports = {
    validateKey,
    validateUser
}