const passport = require("../config/passport");
const User = require("../models/User");
const { send } = require("../config/mailer");
const schema = require("../models/User");

exports.login = (req, res) => {
    passport.authenticate("local", (err, user, info ={}) => {
        const { message: err } = info;
        if(error) {
            return res.render("login", { err });
        }

        req.login((user, err) => {
            res.redirect("/profile");
        });
    })(req, res);
};

exports.signup = (req, res) => {
    const { username , email, password, confirmPass, role } = req.body;

    if(password !== confirmPass) {
        console.log("password is not a match");
        let error = "Please write the same password in both fields";
        return res.render("register", { title: "SignUp", error });
    }

    if(!password || !username || !email || !confirmPass || !role ) {
        console.log("One of fields is blank");
        let error = "All fields must not be in blank";
        return res.render("register", { title: "SignUp", error });
    }

    if(password.length <7 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/) || !password.match(/(^[a-zA-Z0-9]+$)/i)) {
        console.log("not a valid password try again");
        let error = "Not a valid password try again please";
        return res.render("register", { title: "SignUp", error});
    }

    User.register({ username, email }, password)
    .then(usr => {
        const options = {
            filename: "register",
            email: usr.email,
            message: "Validated your email",
            subject: "Confirm your email"
        };
        send(options);
        req.login((usr, errorMessage) => {
            if(errorMessage)
            return res.render("register", { title: "SignUp", errorMessage });
            res.redirect("/home");
        });
    })
    .catch(errorMessage => 
        res.render("register", { title: "SignUp", errorMessage })
    );
};
