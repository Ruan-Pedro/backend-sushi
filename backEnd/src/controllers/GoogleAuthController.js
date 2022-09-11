const passport = require('passport');
const session = require('express-session');
const GoogleUser = require('../models/GoogleUser');
const User = require('../models/Users');
let moment = require('moment-timezone');
let dateNow = moment.tz('America/Sao_Paulo').format('MMMM Do YYYY, h:mm:ss a');

const SiteLinkAuth = async (req, res) => {
    return res.status(200).send('<a href="/sushi/auth/google">Authenticate with Google</a>');
}

const Callback = async (req, res) => {
    const userInDB = await User.findOne({ email: req.user.email }).select('+password');
    if (userInDB && userInDB.privilege != 'cliente') return res.status(401).send({ error: 'google login must be used only for client users' });

    if (!userInDB) {
        const googleUserDb = await GoogleUser.findOne({ email: req.user.email });
        if (!googleUserDb) {
            const googleUser = new GoogleUser({
                name: req.user.displayName,
                username: req.user.givenName,
                email: req.user.email,
                profile_img: req.user.picture ? req.user.picture : "https://media.istockphoto.com/vectors/male-profile-flat-blue-simple-icon-with-long-shadow-vector-id522855255?b=1&k=20&m=522855255&s=612x612&w=0&h=hU2lBVV4_3z5K3V-KhnoAausfOx8zcHAgHkHz6sB3Jk=",
                privilege: 'cliente',
                phone: req.user.phone ? req.user.phone : null,
                address: req.user.address ? req.user.address : ''
            });
            try {
                const savedUser = await googleUser.save();
                if (!savedUser) return res.status(500).send({ error: "Fail in register a new google user" });

                res.status(201).send({ newUser: savedUser, msg: "User logged successfully", logged: dateNow });
            } catch (error) {
                console.error(error);
                return res.status(500).send({ error: "Internal Error" });
            }
        }
        // else return res.status(200).send({ msg: "User logged successfully", logged: dateNow });
        else return res.status(200).redirect('http://localhost:3030/sushi');
    }

    // else return res.status(200).send({ msg: "User logged successfully", logged: dateNow });
    else return res.status(200).redirect('http://localhost:3030/sushi');
}


const Logout = async (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) console.error(err);
            return res.status(200).send({ msg: 'logout successfully', logout: dateNow });
        })
    });
}

const AuthFailure = async (req, res) => {
    return res.status(401).send({ error: `Failed to authenticate to Google` });
}

const getGoogleUsers = async (req, res) => {
    if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

    switch (req.user.privilege) {
        case 'cliente':
            return res.status(401).send({ error: "Acess Denied" });
        case 'operador':
        case 'admin':
            try {
                let googleUsers = await GoogleUser.find(req.query);
                if (!googleUsers) res.status(404).send({ error: "Google Users not found" });

                return res.status(200).send({ data: googleUsers });
            } catch (error) {
                console.error(error);
                return res.status(500).send({ error: "Internal Error" });
            }
    }
}

const getProfile = async (req, res) => {
    if (!req.user) return res.status(400).send({ error: "Login is required" });
    try {
        const profile = await GoogleUser.findOne({ email: req.user.email });
        if (!profile) return res.status(404).send({ error: "User not found" });
        else return res.status(200).send({ data: profile });
    } catch (error) {
        console.error(error);
        return res.status(404).send({ error: 'Profile not found' });
    }
}
const updateUser = async (req, res) => {
    if (!req.user) return res.status(400).send({ error: "Login is required" });
    switch (req.user.privilege) {
        case 'cliente':
            try {
                const user = await GoogleUser.findOneAndUpdate({email:req.user.email}, req.body);
                if (!user) res.status(404).send({ msg: "User not found" });
                return res.status(200).send({ msg: "user updated successfully", data: user });
            } catch (error) {
                console.error(error);
                return res.status(500).send({ error: "Internal Error" });
            }

        case 'operador':
        case 'admin':
            try {
                if (!req.params.id) return res.status(500).send({ error: "User Id is required" });
                const user = await GoogleUser.findByIdAndUpdate(req.params.id, req.body);
                if (!user) res.status(404).send({ msg: "User not found" });
                return res.status(200).send({ msg: "user updated successfully", data: user });
            } catch (error) {
                console.error(error);
                return res.status(500).send({ error: "Internal Error" });
            }

    }
}

const setStatus = async (req, res) => {
    if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

    if (req.user.privilege == 'operador' || req.user.privilege == 'admin') {
        try {
            let user = await User.findById(req.params.id);
            if (!user) res.status(404).send({ msg: "User not found" });
            const userUpdated = await User.findOneAndUpdate(req.params.id, { status: !user.status });
            if (!userUpdated) res.status(404).send({ msg: "Fail in update User" });
            res.status(200).send({ msg: "user status updated successfully", data: userUpdated });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal Error" });
        }
    } else {
        return res.status(401).send({ error: "Acess Denied" });
    }
}

module.exports = {
    SiteLinkAuth,
    Callback,
    Logout,
    AuthFailure,
    getGoogleUsers,
    updateUser,
    getProfile,
    setStatus
}