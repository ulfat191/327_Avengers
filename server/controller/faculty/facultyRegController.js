// FACULTY ------------------------------------------------------------------------------------------------- (Register)

const Faculty = require("../../model/facultySchema.js");
const bcrypt = require("bcrypt");
/**
 * The function is used to register the faculty into the system
 */
exports.faculty_register_get = (req, res) => {
    res.render('register/faculty/faculty-register');
}
/**
 * The function is used to register the faculty into the system, it checks whether the information given during registration is acceptable
 */
exports.faculty_register_post = async (req, res) => {

    const {email, facultyPassword, facultyPasswordConfirm} = req.body;

    if (facultyPassword !== facultyPasswordConfirm) {

        const error = {code: 'ERROR', msg: 'Password mismatch!'};
        res.render('register/faculty/faculty-register', {error});

    } else {
        // READ Faculty
        Faculty.findOne({email: email}, async (err, foundFaculty) => {
            if (!err) {
                if (foundFaculty !== null) {
                    if (foundFaculty.registrationStatus === false) {
                        // Hashing Faculty Password
                        const hashedPassword = await bcrypt.hash(facultyPassword, 10);
                        // UPDATE Faculty
                        Faculty.updateOne(
                            {email: email},
                            {
                                $set: {
                                    password: hashedPassword,
                                    registrationStatus: true
                                }
                            }, (err) => {
                                if (!err) {
                                    res.redirect('/');
                                } else {
                                    console.log(err);
                                }
                            });
                    } else {
                        const error = {code: 'ERROR', msg: 'Faculty is already registered!'};
                        res.render('register/faculty/faculty-register', {error});
                    }
                } else {
                    const error = {code: 'ERROR', msg: 'Faculty email is invalid!'};
                    res.render('register/faculty/faculty-register', {error});
                }
            } else {
                console.log(err);
            }
        });
    }
}

// FACULTY ------------------------------------------------------------------------------------------- (Password Reset)
/**
 * The function is used to enable the faculty to change their password
 */
exports.faculty_password_reset_get = (req, res) => {
    res.render('register/faculty/faculty-password-reset');
}
/**
 * The faculty can use the updated password
 */
exports.faculty_password_reset_post = (req, res) => {
    res.redirect('faculty-password-reset');
}