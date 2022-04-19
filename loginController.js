
const bcrypt = require('bcrypt');
/**
 * Login Object.
 * Once registerd it will include options for the users (admin, faculty and students) to log in to the Education Management System.
 * Admin and faculty can login using their respective email and password. 
 * Students can login using their respective students ID and password. 
 * Details of the login procedure is documented below.
 * Login validation for admin.
 * The following require is used to add the adminSchema.js file to this loginController.js file.
 * The admin is only allowed to log in and out of the system.
 * Admin will get the login credentials which includes email id and password from the software development team. 
 * The admin can login to the system using the provided credentials and then by clicking on the login button. 
 * The admin can not change the login credentials provided by the development team. 
 * The login credentials once entered for login by the admin will be verified by the system. 
 * Once verified the admin will be redirected to the admin portal dashboard. 
 * If invalid information is provided in the login page, the admin will be kept on the login page and an error message will be displayed.
 * By clicking the logout button the admin can logout and the system will take the admin back to the login page immediately.
*/
const Admin = require('../../model/adminSchema.js');
/**
 * Login validation for student.
 * The following require is used to add the studentSchema.js file to this loginController.js file.
 * The student will require an admin approved credentials to register. 
 * The student can login to the system using his/her unique ID and password and then clicking on the login button.
 * The system will check for validation of the student information.
 * If the unique ID and password is correct and verified the student can access the student portal dashboard.  
 * If invalid information is provided in the login page, the student will be kept on the login page and an error message will be displayed.
 * By clicking the logout button the student can logout and the system will take the student back to the login page immediately.
 */
const Student = require('../../model/studentSchema.js');
/**
 * Login validation for faculty.
 * The following require is used to add the facultySchema.js file to this loginController.js file.
 * A faculty can register and log in or out of the system. 
 * The faculty will need an admin approved email address as credential to register. 
 * The faculty can login to the system using the email address and password and then clicking on the login button.
 * The system will check for validation of the faculty information.
 * If the email ID and password is correct and verified the faculty can access the faculty portal dashboard.  
 * If invalid information is provided in the login page, the faculty will be kept on the login page and an error message will be displayed.
 * By clicking the logout button the faculty can logout and the system will take the faculty back to the login page immediately.
*/
const Faculty = require('../../model/facultySchema.js');
 
exports.root_get = (req, res) => {
    const navBarAnimation = { student: 'active' };
    res.render('login', { navBarAnimation });
}

exports.root_post = async (req, res) => {

    const { adminEmail, adminPassword } = req.body;
    const { studentId, studentPassword } = req.body;
    const { facultyEmail, facultyPassword } = req.body;


    switch (req.body.auth) {

        // Login Validation ----------------------------------------------------------------------------------- (ADMIN)

        case 'admin-auth':
            Admin.findOne({ email: adminEmail }, async (err, foundAdmin) => {
                if (!err) {
                    const navBarAnimation = { admin: 'active' };
                    if (foundAdmin !== null) {
                        await bcrypt.compare(adminPassword, foundAdmin.password, async (error, result) => {
                            if (result === true) {
                                req.session.adminAuth = true;
                                // Initial Admin Login
                                const sidebarNav = { dashboard: 'active' };
                                res.render('admin/admin-dashboard', { sidebarNav });
                            } else {
                                const error = { code: 'ERROR', msg: 'Password is incorrect!' };
                                res.render('login', { navBarAnimation, error });
                            }
                        });
                    } else {
                        const error = { code: 'ERROR', msg: 'Email is incorrect!' };
                        res.render('login', { navBarAnimation, error });
                    }
                } else {
                    console.log(err);
                }
            });
            break;

        // Login Validation --------------------------------------------------------------------------------- (Student)

        case 'student-auth':
            Student.findOne({ studentId: studentId }, async (err, foundStudent) => {
                if (!err) {
                    const navBarAnimation = { student: 'active' };
                    if (foundStudent !== null) {
                        if (foundStudent.registrationStatus === true) {
                            await bcrypt.compare(studentPassword, foundStudent.password, async (error, result) => {
                                if (result === true) {
                                    req.session.studentAuth = true;
                                    req.session.studentLoginId = studentId;
                                    // Initial Student Login
                                    const sidebarNav = { home: 'active' };
                                    res.render('student/student-dashboard', { sidebarNav });
                                } else {
                                    const error = { code: 'ERROR', msg: 'Password is incorrect!' };
                                    res.render('login', { navBarAnimation, error });
                                }
                            });
                        } else {
                            const error = { code: 'ERROR', msg: 'Student is not registered!' };
                            res.render('login', { navBarAnimation, error });
                        }
                    } else {
                        const error = { code: 'ERROR', msg: 'Student ID is invalid!' };
                        res.render('login', { navBarAnimation, error });
                    }
                } else {
                    console.log(err);
                }
            });
            break;

        // Login Validation --------------------------------------------------------------------------------- (FACULTY)

        case 'faculty-auth':
            Faculty.findOne({ email: facultyEmail }, async (err, foundFaculty) => {
                if (!err) {
                    const navBarAnimation = { faculty: 'active' };
                    if (foundFaculty !== null) {
                        if (foundFaculty.registrationStatus === true) {
                            await bcrypt.compare(facultyPassword, foundFaculty.password, async (error, result) => {
                                if (result === true) {
                                    req.session.facultyAuth = true;
                                    req.session.facultyEmail = facultyEmail;
                                    // Initial Faculty Login
                                    const sidebarNav = { home: 'active' };
                                    res.render('faculty/faculty-dashboard', { sidebarNav });
                                } else {
                                    const error = { code: 'ERROR', msg: 'Password is incorrect!' };
                                    res.render('login', { navBarAnimation, error });
                                }
                            });
                        } else {
                            const error = { code: 'ERROR', msg: 'Faculty is not registered!' };
                            res.render('login', { navBarAnimation, error });
                        }
                    } else {
                        const error = { code: 'ERROR', msg: 'Faculty email is invalid!' };
                        res.render('login', { navBarAnimation, error });
                    }
                } else {
                    console.log(err);
                }
            });
            break;
        default:
            console.log("Error Occurred in { root_post }");
    }
}
