const User = require('../models/user.model.js');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
const saltRounds = 10;
const Token = require('../models/Token');
// Create and Save a new Note

//router.post ('/',multer,async (req,res) => {
    exports.create = async(req, res) => {
    await User.init();


    const hashedPass = await bcrypt.hash(req.body.password,10)
    const user = new User({
        nom : req.body.nom || "Untitled Note",
                prenom : req.body.prenom ,
                email :req.body.email ,
                password :hashedPass,
                phone :req.body.phone ,
                address :req.body.address,
                job :req.body.job,
                urlImg : `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    })

    
    try {
        const newUser = await user.save()
        const tokenJWT = jwt.sign({username: req.body.email}, "SECRET")
        res.status(201).json({token:tokenJWT,
                            user:newUser,
                            reponse: "good"})
    } catch (error) {
        res.status(400).json({reponse: error.message})
    }
}
// exports.create = (req, res) => {
//     // Validate request
//     if(!req.body.nom) {
//         return res.status(400).send({
//             message: "User content can not be empty"
//         });
//     }
  


//     // Create a Note
//     let newuser = new User({
//         nom : req.body.nom || "Untitled Note",
//         prenom : req.body.prenom ,
//         email :req.body.email ,
//         password :req.body.password ,
//         phone :req.body.phone ,
//         address :req.body.address,
//         job :req.body.job,
//         urlImg : `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`

//     });
//     console.log(newuser.urlImg)
// // Hash password before saving in database
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(newuser.password, salt, (err, hash) => {
//       if (err) throw err;
//       newuser.password= hash;
//       newuser.save()
        
//         .then(client => res.json({user:client}))
//         .catch(err => console.log(err));
//     });
//   });
  
  
// };
//forgotpassword
exports.forgotPassword = async(req, res,next) => {

    // user is not found into database
    if (!res.user) {
        return res.status(400).send({ msg: 'We were unable to find a user with that email. Make sure your Email is correct!' });
    } else {
        var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        var token = new Token({ email: res.user.email, token: seq });
        token.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }

        });

        var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'homemaids@gmail.com',
                pass: 'maids123'
            }
        });

        var mailOptions = {
            from: 'homemaids@gmail.com', to: res.user.email, subject:
                'Mot de passe oubliè home maids', text: 'Vous recevez cet email car vous (ou quelqu\'n d\'autre) a fait cette demande de mot de passe oubliè.\n\n' +
                    'Merci de cliquer sur le lien suivant ou copier le sur votre navigateur pour completer le processus:\n\n' + 'Le code est :'+ token.token + '\n\n' +
                    '\n\n Si vous n\'avez pas fait cette requete, veuillez ignorer ce message et votre mot de passe sera le méme.\n'
        };
        // Send email (use credintials of SendGrid)

        //  var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
        smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).send({ msg: err });
            }
            else {
                return res.status(200).send({succes:true, 
                    msg:'A reset password  email has been sent to ' + res.user.email + '. It will be expire after one day. If you not get verification Email click on resend token.',
                    token: token.token
                })};

        });

    }

}
// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.json({users:users});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.userId
        });
    });
};

// Find a single note with a noteId
exports.findOneEmail = (req, res, next) => {
    
    User
    .find({email: req.params.Email})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "user not found with email " + req.params.Email
            });            
        }
        res.send(note);
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.Email
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.Email
        });
    });
    next();
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

    User.findByIdAndUpdate(req.params.userId, {
        nom : req.body.nom || "Untitled Note",
        prenom : req.body.prenom ,
        email :req.body.email ,
        phone :req.body.phone ,
        address :req.body.address,
        job :req.body.job,
        urlImg : `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });
        }
        res.json({reponse:"updated",
        user:note})
        
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.userId
        });
    });
};
//get user by id
    exports.getUserById = async(req, res,next) => {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({reponse : "Utilisateur non trouve"})
        }
    } catch (error) {
        return res.status(500).json({reponse: error.message})
    }
    res.user = user
    next()
}
// Delete a note with the specified noteId in the request
//router.delete ('/:id',getUserById,async (req,res) => {
    exports.delete = async(req, res) => {
    try {
        //delete the user
         await res.user.remove()
         res.json({reponse : "Supprime avec succes"})
    } catch (error) {
        res.json({erreur : error.message})
    }
}
/* exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.userId
        });
    });
};
*/

// Find a single note with a noteId
exports.findclient = (req, res) => {
    // Find client by email
    User.findOne({email: req.body.email}).then(client => {
        // Check if client exists
        if (!client) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }
      // Check password
          bcrypt.compare(req.body.password, client.password)
          .then(isMatch => {
            if (isMatch) {
              // client matched
              // Create JWT Payload
              const payload = {
                id: client._id,
                email : client.email
              };
      // Sign token
              jwt.sign(
                payload,
                "secret",
                {
                  expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token:"Bearer "+ token,
                
                    id : client._id
                  });
                }
              );
            } else {
              return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
            }
          });
        });
};


// Find a single note with a noteId
exports.findtoken = (req, res) => {
   
    const headers = req.headers['authorization']
    console.log(headers)
    if(headers) {
      // Bearer oabsdoabsoidabsiodabsiodbasoid
      const token = headers.split(' ')[1]
      const decoded = jwt.verify(token, 'secret')
      
      if(decoded) {
        let username = decoded.id
        console.log("////////////////////////////////////////////////////")
        console.log(username)
        User.findById(username)
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });            
            }
            res.send(note);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });                
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + username
            });
        });
      } else {
        res.json({message: 'Unauthorized access'})
      }
      
    } else {
      res.json({message: 'Unauthorized access'})
    }
};

exports.findtokenall = (req, res) => {
   
    const headers = req.headers['authorization']
    console.log(headers)
    if(headers) {
      // Bearer oabsdoabsoidabsiodabsiodbasoid
      const token = headers.split(' ')[1]
      const decoded = jwt.verify(token, 'secret')
      
      if(decoded) {
        let username = decoded.id
        console.log("////////////////////////////////////////////////////")
        console.log(username)
        User.find()
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });            
            }
            res.send(note);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });                
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + username
            });
        });
      } else {
        res.json({message: 'Unauthorized access'})
      }
      
    } else {
      res.json({message: 'Unauthorized access'})
    }
};
//creating one Using Social Media
exports.socialmedia = (req, res) => {

    const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        address: "no address",
        job: "no job",
        phone: "no phone",
        urlImg: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    })
    console.log(user)
    const tokenJWT = jwt.sign({username: req.body.email}, "SECRET")

    
    try {
        const newUser =  user.save()
        
        res.status(201).json({token:tokenJWT,
            user:user,
        reponse: "good"})
} catch (error) {
res.status(400).json({reponse: error.message})
}
       /* var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'homemaids@gmail.com',
                pass: 'maids123'
            }
        });


        var mailOptions = { from: 'homemaids@gmail.com', to: user.email, subject: 'Verification de compte', text: 'Bonjour/Bonsoir ' + user.nom + ',\n\n' + 'Pour verifier votre compte merci de cliquer sur le lien suivant: \nhttp:\/\/' + req.headers.host + '\/user\/confirmation\/' + user.email + '\/' + token.token + '\n\nMerci !\n' };
        smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });

            }
            return res.status(200)
                .json(
                    {
                        msg: 'A verification email has been sent to ' + user.email +
                            '. It will be expire after one day. If you not get verification Email click on resend token.',
                        user: user
                    });
        });*/
        // res.status(201).json({
        //     success: true,
        //     message: "User Created!",
        //     user: user
        // });


   
};
//login

    exports.login = async(req, res) => {
    if (res.user == null){
        return res.status(404).send("Utilisateur introuvable")
    }
    try {
        console.log(req.body.password)
        console.log(res.user.password)

        if (await bcrypt.compare(req.body.password,res.user.password)){
        const token = jwt.sign({username: res.user.email}, "SECRET")
        if (token){
            res.json({token: token,
            user:res.user,
            reponse:"good"})
        }
        }else
        res.json({
            nom: res.user.nom,
            prenom: res.user.prenom,
            email: res.user.email,
            password: hashedPass,
            phone: res.user.phone
        })
        
    } catch (error) {
        res.status(400).json({reponse : "mdp incorrect"})
    } 
}
//resestpassword


    exports.resetPassword = async(req, res,next) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token) {
            return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        }
        // if token is found then check valid user 
        else {
            User.findOne({email: req.params.email }, async function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                } else {

                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(req.body.Password, salt);

                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        // account successfully verified
                        else {
                            return res.status(200).json({reponse:'Your password has been successfully reset'});
                        }

                    })

                }

            });
        }});

    }
    
// send mail
exports.sendmaill = (req, res) => {
   
  
    async function main() {
   
        let transporter = nodemailer.createTransport({
          service: 'gmail',
         
          auth: {
              user: 'ella.zarmadini@esprit.tn',
              pass: 'Loulou123'
          },
       });
      
     
       
      // send mail with defined transport object
      let info = await transporter.sendMail({
          from: 'ella.zarmadini@esprit.tn',
          to: req.body.email,
          subject: 'Verification account',
          text: req.body.code
      });
      console.log("Message sent: %s", info.messageId);
     
    }
    main().catch(console.error);
  
  
};
//Auth
exports.Auth = async(req, res,next) => {
    if (res.user == null){
        return res.status(404).send("Utilisateur introuvable")
    }
    try {
        const token = jwt.sign({username: res.user.email}, "SECRET")
        if (token){
            res.json({token: token,
            user:res.user,
            reponse:"good"})
        }
        
        
    } catch (error) {
        res.status(400).json({reponse : "mdp incorrect"})
    } 
    next();
};
    exports.getUserByMail = async(req, res,next) => {
    let user
    try {
        user = await User.findOne({email:req.body.email})
        if (user == null){
            return res.status(404).json({reponse : "mail non trouve"})
        }

    } catch (error) {
        return res.status(500).json({reponse: error.message})
    }
    res.user = user
    next()
}

  
//send SMS


exports.sendnumber = (req, res) => {
   
const nexmo = new Nexmo({
    apiKey: "d3311679",
  apiSecret: "AyEH3YNyBayZZ552"
});
var to = req.body.phone;
var from = 'Home Maids';
var text = req.body.code;


nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
  
};