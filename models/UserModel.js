
const mongoose = require('mongoose');

// To check mongodb connection [DEBUGGING PURPOSE]
// (() => {
//     mongoose.connect(process.env.MONGO_URI)
//         .then(_ => console.log('Connected successfully'))
//         .catch(err => console.error(err));
// })();

const userSchema = mongoose.Schema({
    apiKey: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true, 'Username required']
    },
    ips: {
        type: [String],
        required: true
    },
    usage: {
        type: Array,
        default: [{
        date: {
            type: Date,
            default: Date.now
        },
        count: {
            type: Number,
            default: 0
        }
    }]
}
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('users', userSchema);