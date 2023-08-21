const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, registerUser, registerUserIp, deleteUserIp } = require('./../controllers/UserController');
const { validateKey, validateUser } = require('../middlewares/validations/apiKeys');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(404).json({ msg: 'No key provided. Register for one at /api/user/register'});
});
router.get('/register/:username', registerUser); // This is for testing purposes [DEBUGGING PURPOSE]
router.post('/register/:username', registerUser);
router.get('/:apikey', validateKey, getAllUsers);
// router.get('/:id', getUser);
router.put('/:apikey', updateUser);
router.delete('/:apikey', validateKey, deleteUser);

router.get('/ip/add', (req, res) => {
    res.status(404).json({ msg: 'Provide id and apikey (ip/add/<YourIdHere>/<YourApikeyHere>) to add ip'});
});

router.get('/ip/add/:_', (req, res) => {
    res.status(404).json({ msg: 'Provide id and apikey (ip/add/<YourIdHere>/<YourApikeyHere>) to add ip'});
});
router.get('/ip/add/:id/:apikey', validateUser, registerUserIp);
router.post('/ip/add/:id/:apikey', validateUser, registerUserIp);
router.get('/ip/delete/:id/:apikey', validateUser, deleteUserIp);
router.delete('/ip/delete/:id/:apikey', validateUser, deleteUserIp);

module.exports = router;