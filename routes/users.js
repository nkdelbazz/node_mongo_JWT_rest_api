const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utilis');

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!" , user: req.user});
});



router.get('/a', function(req, res, next){
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});




router.get('/userprotected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    
    if(req.user.roles==="user")
    {
        res.status(200).json({ success: true, msg: "You are successfully authenticated to this route! user" , user: req.user.username});
    }
    if(req.user.roles==="admin")
    {
        res.status(200).json({ success: true, msg: "You are adimin"});
    }
    if(req.user.roles==="superuser")
    {
        res.status(200).json({ success: true, msg: "You are superuser"});
    }
});




// Validate an existing user and issue a JWT
router.post('/login', function(req, res, next){

    User.findOne({ username: req.body.username })
        .then((user) => {

            if (!user) {
                return res.status(401).json({ success: false, msg: "could not find user" });
            }
            
            // Function defined at bottom of app.js
            const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
            
            if (isValid) {

                const tokenObject = utils.issueJWT(user);

                res.status(200).json({ success: true,user: user, token: tokenObject.token, expiresIn: tokenObject.expires });

            } else {

                res.status(401).json({ success: false, msg: "you entered the wrong password" });

            }

        })
        .catch((err) => {
            next(err);
        });
});

// Register a new user
router.post('/register', function(req, res, next){
    const saltHash = utils.genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        roles: "user",
        hash: hash,
        salt: salt
        });

    User.findOne({ username: req.body.username })
    .then((user) => {

        if (user) {
            return res.status(409).json({ success: false, msg: "name as already exist" });
        }

        else

        {
        
            try {

                newUser.save()
                    .then((user) => {
                        // serve per testare il tutto 
                        const jwt = utils.issueJWT(user);
                        res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
                    });
        
            } catch (err) {
                
                res.json({ success: false, msg: err });
            
            }


        }

    })



      

});




  
  


module.exports = router;