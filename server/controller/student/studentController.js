const Student = require('../../model/studentSchema.js');
const Grade = require("../../model/gradeSchema.js");
const Scholarship = require("../../model/scholarshipSchema.js");

// STUDENT ----------------------------------------------------------------------------------------------------- (Home)
/**
 * The student will only be able to log in/register in the system.
 * The student will be able to change or reset login credentials. 
 * Upon giving the email and password, the student has to click the ‘login’ button. The system will then verify the login credentials and redirect the student to the student portal if they are correct. 
 * If the wrong credentials are given, the system will show error messages to the student.
*/
exports.student_dashboard_get = (req, res) => {
    if (req.session.studentAuth === true) {
        const sidebarNav = {home: 'active'};
        res.render('student/student-dashboard', {sidebarNav});
    }
}
/**
 * The student can log out of the system by clicking the ‘logout’ button. The system will immediately take the student to the login screen after the logout.
 */
exports.student_dashboard_post = (req, res) => {
    if (req.session.studentAuth === true) {
        res.redirect('/student-dashboard');
    }
}

// STUDENT -------------------------------------------------------------------------------------------------- (Profile)
/**
 * This function will check and retrieve the student profile of the student if he is logged in properly.
 */
 exports.student_profile_get = (req, res) => {
    if (req.session.studentAuth === true) {
        Student.findOne({studentId: req.session.studentLoginId}, (err, foundStudent) => {
            if (!err) {
                Scholarship.findOne({studentId: req.session.studentLoginId}, (err, foundScholarship) => {
                    if (!err) {
                        const sidebarNav = {profile: 'active'};
                        res.render('student/student-profile', {foundStudent, foundScholarship, sidebarNav});
                    } else console.log(err);
                });
            } else console.log(err);
        });
    }
}
/**
 * This function is used for updating the student's profile information.
 * Updatable information includes phone, email, DoB, citizenship and address.
 */
exports.student_profile_post = (req, res) => {
    if (req.session.studentAuth === true) {
        const {studentId, phone, email, dob, citizenship, address} = req.body;
        Student.updateOne(
            {studentId: studentId},
            {
                $set: {
                    phone: phone,
                    email: email,
                    dob: dob,
                    citizenship: citizenship,
                    address: address
                }
            }, (err) => {
                if (!err) {
                    res.redirect('/student-profile');
                } else console.log(err);
            });
    }
}

// STUDENT -------------------------------------------------------------------------------------------------- (Courses)
/**
 * The function retrieves the list of courses accessible and available for the student to register in.
 * Student will not be able to see courses he cannot take.
 */
exports.student_courses_get = (req, res) => {
    if (req.session.studentAuth === true) {
        Grade.find({}, (err, foundGrades) => {
            if (!err) {
                const sidebarNav = {courses: 'active'};
                const studentId = req.session.studentLoginId;
                res.render('student/student-courses', {foundGrades, studentId, sidebarNav});
            } else console.log(err);
        });
    }
}
/**
 * The function is used for the CRUD operations involving students and courses. It allows the student to
 * take courses, drop courses and to retrieve the courses the student is enrolled in.
 */
exports.student_courses_post = (req, res) => {
    if (req.session.studentAuth === true) {

        const {CRUD} = req.body;
        console.log(CRUD);

        switch (CRUD) {

            case 'STUDENT_TAKE_COURSE': {
                Student.findOne(
                    {studentId: req.session.studentLoginId},
                    (err, foundStudent) => {
                        if (!err) {
                            Grade.findOne(
                                {_id: req.body._id, 'courseStudent.courseStudentId': req.session.studentLoginId},
                                (err, foundGrade) => {
                                    if (!err) {
                                        if (foundGrade === null) {
                                            Grade.updateOne(
                                                {_id: req.body._id},
                                                {
                                                    $push: {
                                                        courseStudent: {
                                                            courseStudentId: foundStudent.studentId,
                                                            courseStudentFirstName: foundStudent.firstName,
                                                            courseStudentLastName: foundStudent.lastName,
                                                            courseStudentStatus: true,
                                                            courseStudentGradeStatus: false
                                                        }
                                                    }
                                                }, (err) => {
                                                    if (!err) {
                                                        res.redirect('/student-courses');
                                                    } else console.log(err);
                                                });
                                        } else {
                                            res.redirect('/student-courses');
                                        }
                                    } else console.log(err);
                                });
                        } else console.log(err);
                    });
            }
                break;

            case 'STUDENT_READ_COURSE': {
                res.redirect('/student-courses');
            }
                break;

            case 'STUDENT_DROP_COURSE': {
                Grade.findOneAndUpdate(
                    {_id: req.body._id},
                    {
                        $pull: {
                            courseStudent: {
                                courseStudentId: req.session.studentLoginId
                            }
                        }
                    },
                    (err) => {
                        if (!err) {
                            res.redirect('/student-courses');
                        } else console.log(err);
                    });
            }
                break;

            default:
                console.log("Error occurred in { student_courses_post }");

        }
    }
}

// STUDENT --------------------------------------------------------------------------------------------------- (Grades)
/**
 * The function is used to retrieve the grades assigned to the student by the respective courses.
 */
exports.student_grades_get = (req, res) => {
    if (req.session.studentAuth === true) {
        Grade.find(
            {'courseStudent.courseStudentId': req.session.studentLoginId},
            (err, foundGrades) => {
                if (!err) {
                    const sidebarNav = {grades: 'active', studentId: req.session.studentLoginId};
                    res.render('student/student-grades', {foundGrades, sidebarNav});
                } else console.log(err);
            });
    }
}
/**
 * The function is used to change or assign a grade of the student. It is hidden and not accessible to the student
 * as they should not be able to change their own grades.
 */
exports.student_grades_post = (req, res) => {
    if (req.session.studentAuth === true) {
        res.redirect('/student-grades');
    }
}

