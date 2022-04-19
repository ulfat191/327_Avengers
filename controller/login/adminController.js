const data = require('../../database/data.js');
/**
 * This will add the student javascript file fom the student javascript module.
 */
const Student = require('../../model/studentSchema.js');
/**
 * This will add the faculty javascript file fom the faculty javascript module.
 */
const Faculty = require('../../model/facultySchema.js');
/**
 * This will add the course javascript file fom the course javascript module.
 */
const Course = require('../../model/courseSchema.js');

// ADMIN -------------------------------------------------------------------------------------------------- (Dashboard)
/**
 * admin_dashboar_get method. 
 * The admin will only be able to log in/out of the system.
 * The software development team will give the admin the login email and password for the admin access.
 * The admin will be able to log into the admin portal using these credentials. 
 * The admin will not be able to change or reset login credentials. 
 * Upon giving the email and password, the admin has to click the ‘login’ button. The system will then verify the login credentials and redirect the admin to the admin portal if they are correct. 
 * If the wrong credentials are given, the system will show error messages to the admin.
*/
exports.admin_dashboard_get = (req, res) => {
    if (req.session.adminAuth === true) {
        const sidebarNav = {dashboard: 'active'};
        res.render('admin/admin-dashboard', {sidebarNav});
    }
}
/**
 * admin_dashboard_post method.
 * The admin can log out of the system by clicking the ‘logout’ button. The system will immediately take the admin to the login screen after the logout.
 */
exports.admin_dashboard_post = (req, res) => {
    if (req.session.adminAuth === true) {
        res.redirect('/admin-dashboard');
    }
}

// ADMIN ---------------------------------------------------------------------------------------------------- (Student)
/**
 * admin_student_get method.
 * Using exports.admin_students_get the admin will be able to check for already registered student. 
 * It will enable the admin to restrict the creation of student ids.
 */
exports.admin_students_get = async (req, res) => {
    if (req.session.adminAuth === true) {

        const sidebarNav = {student: 'active'};

        Student.find({}, (err, foundStudents) => {
            if (!err) {
                if (req.session.msg === 'DUPLICATE_SID') {

                    req.session.msg = 'NULL';
                    const error = {code: 'ERROR', msg: 'Student ID is already in use!'};
                    res.render('admin/admin-students', {foundStudents, sidebarNav, error});

                } else res.render('admin/admin-students', {foundStudents, sidebarNav});
            } else console.log(err);
        });
    }
}

/**
 * admin_student_post method.
 * Using exports.admin_students_port the admin will be able to add new students into the system and view student information.
 * The admin will be able to add new students, update existing student information and delete students from the system.  .  
 * Students who are already added cannot be added anymore. 
 * The admin can add a new student with a unique identification number by filling out a form and clicking the ‘register’ button.
 * The system will reserve this identification number for the student to create a student account.
 * The admin can also update student information by clicking the ‘update’ button and refilling the existing form. 
 * Once a student is registered into the system, the admin will not be allowed to change the unique identification number.  
 * The admin can delete a student from the system. Deletion will be completed with a pop-up for a final confirmation message. Once the deletion is done, it cannot be reversed
 */
exports.admin_students_post = (req, res) => {
    if (req.session.adminAuth === true) {

        const {CRUD} = req.body;
        console.log(CRUD);

        switch (CRUD) {

            // CREATE Student
            case 'ADMIN_CREATE_STUDENT': {
                const {firstName, lastName, studentId, entrySemester, program, dob, citizenship} = req.body;
                Student.findOne({studentId: studentId}, async (err, foundStudent) => {
                    if (!err) {
                        if (foundStudent === null) {
                            const student = new Student({
                                firstName: firstName,
                                lastName: lastName,
                                studentId: studentId,
                                entrySemester: entrySemester,
                                degree: data.Registration(program).degree,
                                degreeShort: data.Registration(program).degreeShort,
                                major: data.Registration(program).major,
                                credits: data.Registration(program).credits,
                                dob: dob,
                                citizenship: citizenship,
                                registrationStatus: false
                            });

                        } else {
                            req.session.msg = 'DUPLICATE_SID';
                            res.redirect('/admin-students');
                        }
                    } else console.log(err);
                });
                break;
            }

            // READ Student
            case 'ADMIN_READ_STUDENT': {
                res.redirect('/admin-students');
                break;
            }

            // UPDATE Student
            case 'ADMIN_UPDATE_STUDENT': {
                const {firstName, lastName, program, dob, citizenship} = req.body;
                Student.findOne({studentId: req.body.studentId}, async (err) => {
                    if (!err) {
                        Student.updateOne(
                            {studentId: req.body.studentId},
                            {
                                $set: {
                                    firstName: firstName,
                                    lastName: lastName,
                                    degree: data.Registration(program).degree,
                                    degreeShort: data.Registration(program).degreeShort,
                                    major: data.Registration(program).major,
                                    credits: data.Registration(program).credits,
                                    dob: dob,
                                    citizenship: citizenship
                                }
                            }, (err) => {
                                if (!err) {
                                    res.redirect('/admin-students');
                                } else console.log(err);
                            });
                    } else console.log(err);
                });
                break;
            }

            // DELETE Student
            case 'ADMIN_DELETE_STUDENT': {
                Student.deleteOne({studentId: req.body.studentId}, (err) => {
                    if (!err) {
                        res.redirect('/admin-students');
                    } else console.log(err);
                });
                break;
            }

            default:
                console.log("Error occurred in { admin_students_post }");
        }
    }
}

// ADMIN ---------------------------------------------------------------------------------------------------- (Faculty)
/**
 * admin_faculties_get method.
 * Using exports.admin_faculties_get the admin will be able to check for already registered faculties. 
 * It will enable the admin to restrict the creation of duplicate faculty ids. 
 */
exports.admin_faculties_get = (req, res) => {
    if (req.session.adminAuth === true) {

        const sidebarNav = {faculty: 'active'};

        Faculty.find({}, (err, foundFaculties) => {
            if (!err) {
                if (req.session.msg === 'DUPLICATE_EMAIL') {

                    req.session.msg = 'NULL';
                    const error = {code: 'ERROR', msg: 'Email is already in use!'};
                    res.render('admin/admin-faculties', {foundFaculties, sidebarNav, error});

                } else res.render('admin/admin-faculties', {foundFaculties, sidebarNav});
            } else console.log(err);
        });
    }
}
/**
 * admin_faculties_post method.
 * Using export.admin_faculties_get the admin will be able to add new faculties, update existing faculty information, see faculty details and status, and delete faculty from the system.  
 * The admin can add a new faculty with a unique email address by filling out a form and clicking the ‘register’ button.
 * The system will reserve this email address for the faculty to create a faculty account.
 * The admin can update faculty information by clicking the ‘update’ button and refilling the existing form. 
 * The admin can see the faculty registration status and current semester status.
 * Once a faculty is registered into the system, the admin will not be allowed to change the unique email address.  
 */
exports.admin_faculties_post = (req, res) => {
    if (req.session.adminAuth === true) {

        const {CRUD} = req.body;
        console.log(CRUD);

        switch (CRUD) {

            // CREATE Faculty
            case 'ADMIN_CREATE_FACULTY': {
                const {firstName, lastName, email, university} = req.body;
                Faculty.findOne({email: email}, async (err, foundFaculty) => {
                    if (!err) {
                        if (foundFaculty === null) {
                            const faculty = new Faculty({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                university: university,
                                registrationStatus: false,
                                semesterStatus: false
                            });
                            await faculty.save();
                            res.redirect('/admin-faculties');
                        } else {
                            req.session.msg = 'DUPLICATE_EMAIL';
                            res.redirect('/admin-faculties');
                        }
                    } else console.log(err);
                });
                break;
            }


            // READ Faculty
            case 'ADMIN_READ_FACULTY': {
                res.redirect('/admin-faculties');
                break;
            }

            // UPDATE Faculty
            case 'ADMIN_UPDATE_FACULTY': {
                const {firstName, lastName, email, university} = req.body;
                Faculty.findOne({email: email}, async (err, foundFaculty) => {
                    if (!err) {
                        Faculty.updateOne(
                            {email: email},
                            {
                                $set: {
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    university: university,
                                    registrationStatus: foundFaculty.registrationStatus,
                                    semesterStatus: foundFaculty.semesterStatus
                                }
                            }, (err) => {
                                if (!err) {
                                    res.redirect('/admin-faculties');
                                } else console.log(err);
                            });
                    } else console.log(err);
                });
                break;
            }

            // DELETE Faculty
            case 'ADMIN_DELETE_FACULTY': {
                Faculty.deleteOne({email: req.body.email}, (err) => {
                    if (!err) {
                        res.redirect('/admin-faculties');
                    } else console.log(err);
                });
                break;
            }

            default:
                console.log("Error occurred in { admin_faculties_post }");
        }
    }
}

// ADMIN ---------------------------------------------------------------------------------------------------- (Courses)
/**
 * admin_courses_get method.
 * Using exports.admin_courses_get the admin will be able to check for alredy opened or created courses. 
 * It will enable the admin to restrict the creation of duplicate courses. 
 */
exports.admin_courses_get = (req, res) => {
    if (req.session.adminAuth === true) {

        const sidebarNav = {courses: 'active'};

        Course.find({}, (err, foundCourses) => {
            if (!err) {
                if (req.session.msg === 'DUPLICATE_COURSE') {

                    req.session.msg = 'NULL';
                    const error = {code: 'ERROR', msg: 'Course already exists!'};
                    res.render('admin/admin-courses', {foundCourses, sidebarNav, error});

                } else res.render('admin/admin-courses', {foundCourses, sidebarNav});
            } else console.log(err);
        });
    }
}
/**
 * admin_courses_post method.
 * The admin can add new courses, update existing course information, and delete courses from the system. 
 * The admin can new courses with unique course code and course details by filling out a form and clicking the ‘create’ button.
 * The existing course code and details can be updated by clicking the ‘update’ button.
 * The courses can be deleted from the system by clicking the ‘delete’ button. Once the deletion is done, it cannot be reversed. 
 */
exports.admin_courses_post = (req, res) => {
    if (req.session.adminAuth === true) {

        const {CRUD} = req.body;
        console.log(CRUD);

        switch (CRUD) {

            // CREATE Course
            case 'ADMIN_CREATE_COURSE': {
                const {courseCode, courseDetails, courseCredit} = req.body;
                Course.findOne({courseCode: courseCode}, async (err, foundCourse) => {
                    if (!err) {
                        if (foundCourse === null) {
                            const course = new Course({
                                courseCode: courseCode,
                                courseDetails: courseDetails,
                                courseCredit: courseCredit
                            });
                            await course.save();
                            res.redirect('/admin-courses');
                        } else {
                            req.session.msg = 'DUPLICATE_COURSE';
                            res.redirect('/admin-courses');
                        }
                    } else console.log(err);
                });
                break;
            }

            // READ Course
            case 'ADMIN_READ_COURSE': {
                res.redirect('/admin-courses');
                break;
            }

            // UPDATE Course
            case 'ADMIN_UPDATE_COURSE': {
                const {_id, courseCode, courseDetails, courseCredit} = req.body;
                Course.updateOne(
                    {_id: _id},
                    {
                        $set: {
                            courseCode: courseCode,
                            courseDetails: courseDetails,
                            courseCredit: courseCredit
                        }
                    }, (err) => {
                        if (!err) {
                            res.redirect('/admin-courses');
                        } else console.log(err);
                    });
                break;
            }

            // DELETE Course
            case 'ADMIN_DELETE_COURSE': {
                Course.deleteOne({courseCode: req.body.courseCode}, (err) => {
                    if (!err) {
                        res.redirect('/admin-courses');
                    } else console.log(err);
                });
                break;
            }

            default:
                console.log("Error occurred in { admin_courses_post }");
        }
    }
}
