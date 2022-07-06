const router = require('express').Router();
const User = require('../models/User'); //user model
const bcrypt = require('bcrypt');
const { request } = require('express');

//REGISTER
router.post('/register', async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
       res.status(500).json(err);
    };
});
//LOGIN

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username}); //fetch the user object
        !user && res.status(400).json("Wrong Credentials"); //if no user found
        const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json("Wrong Credentials"); //if password is incorrect
        const { password,...others} = user._doc; //filter out password from the obj returned
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router