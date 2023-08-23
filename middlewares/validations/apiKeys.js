
const User = require('./../../models/UserModel');

const validateKey = async(req, res, next) => {
    try {
        const userExists = await User.findOne({apiKey: (req.params.apikey || req.query.apikey)});
        if(userExists && userExists.ips.includes(req.ip)) {
            const currentDate = new Date().toISOString().split('T')[0];
            const usageIndex = userExists.usage.findIndex(u => u.date.toISOString().split('T')[0] == currentDate); // If used today
            if(usageIndex !== -1){
                if(userExists.usage[usageIndex].count < process.env.MAX_API_RATE_PER_DAY){
                    if(req.params.apikey) {
                        userExists.usage[usageIndex].count++;
                        userExists.markModified('usage'); // to tell mongoose that usage of user was modified
                        userExists.save();
                    }
                    next();
                } else res.status(429).json({ ok:false, msg: 'Max limit reached'});
            } else {
                userExists.usage.push({date: new Date(), count: req.params.apikey ? 1 : 0}); // default value for date and count
                userExists.save();
                next();
            }
        } else res.status(403).json({ ok: false, msg: 'Unauthorized Access'});
    } catch (err) {
        res.status(500).json({ 
        ok: false,
        msg: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack.replace(/(\r\n|\n|\r)/gm, ':::').split(':::') : null // replace any form of line break to make an array for better readability from stack
        });
    }
};

const validateUser = async(req, res, next) => {
    try{
        const user = await User.findOne({_id: req.params.id, apiKey: req.params.apikey});
        if(user) {
            req.user = user;
            next();
        } else res.status(404).json({ msg: 'No user with given id'});
    }catch(error){
        res.status(500).json({ ok: false, msg: 'Unable to process at the moment', error });
    }
};

module.exports = {
    validateKey,
    validateUser
};