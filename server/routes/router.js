const express = require('express');
/**
 * Router is used to handle the response from the from end.
 * It enables the system to link the response from the front end with the back end functionalities.
 */
const router = express.Router();

/**
 * const studentController is adding the studentController.js module with the router.js module.
 */
const studentController = require('../controller/student/studentController');
/**
 * const studentRegController is adding the studentController.js module with the router.js module.
 */
const studentRegController = require('../controller/student/studentRegController');

/**
 * const facultyController is adding the facultyController.js module with the router.js module.
 */
const facultyController = require('../controller/faculty/facultyController');
/**
 * const facultyRegController is adding the facultyRegController.js module with the router.js module.
 */
const facultyRegController = require('../controller/faculty/facultyRegController');

/**
 * const adminController is adding the adminController.js module with the router.js module.
 */
const adminController = require('../controller/admin/adminController');
/**
 * const adminGenController is adding the adminGenController.js module with the router.js module.
 */
const adminGenController = require('../controller/admin/adminGenController');

/**
 * const logController is adding the loginController.js module with the router.js module.
 */
const loginController = require('../controller/login/loginController');
/**
 * const logoutController is adding the loginoutController.js module with the router.js module.
 */
const logoutController = require('../controller/logout/logoutController');

adminGenController.admin_generate();

// ======================= Login Portal ======================= //
/**
 * route method for loginControl.
 */
router.route('/')
    .get(loginController.root_get)
    .post(loginController.root_post)

// ======================= Student Portal ======================= //
/**
 * Student Portal routes.
 * route method for student-register option.
 */
router.route('/student-register')
    .get(studentRegController.student_register_get)
    .post(studentRegController.student_register_post)

/**
 * route method for student password reset option.
 */    
router.route('/student-password-reset')
    .get(studentRegController.student_password_reset_get)
    .get(studentRegController.student_password_reset_post)

// ---------------------- Student Dashboard --------------------- //
/**
 * Student Dashboard routes.
 * route method for reseting student dashboard.
 */  
router.route('/student-dashboard')
    .get(studentController.student_dashboard_get)
    .post(studentController.student_dashboard_post)

/**
 * route method for student profile access.
 */  
router.route('/student-profile')
    .get(studentController.student_profile_get)
    .post(studentController.student_profile_post)

/**
 * route method for student courses access.
 */ 
router.route('/student-courses')
    .get(studentController.student_courses_get)
    .post(studentController.student_courses_post)

/**
 * route method for student grades view.
 */ 
router.route('/student-grades')
    .get(studentController.student_grades_get)
    .post(studentController.student_grades_post)

// ======================= Faculty Portal ======================= //
/**
 * Faculty Portal routes.
 */
router.route('/faculty-register')
    .get(facultyRegController.faculty_register_get)
    .post(facultyRegController.faculty_register_post)

router.route('/faculty-password-reset')
    .get(facultyRegController.faculty_password_reset_get)
    .get(facultyRegController.faculty_password_reset_post)

// ---------------------- Faculty Dashboard --------------------- //
/**
 * route method for faculty dashboard access.
 */
router.route('/faculty-dashboard')
    .get(facultyController.faculty_dashboard_get)
    .post(facultyController.faculty_dashboard_post)

/**
 * route method for faculty profile access.
 */
router.route('/faculty-profile')
    .get(facultyController.faculty_profile_get)
    .post(facultyController.faculty_profile_post)

/**
 * route method for faculty course access.
 */
router.route('/faculty-courses')
    .get(facultyController.faculty_courses_get)
    .post(facultyController.faculty_courses_post)

/**
 * route method for faculty grades assigning.
 */
router.route('/faculty-grades')
    .get(facultyController.faculty_grades_get)
    .post(facultyController.faculty_grades_post)


// ======================= Admin Portal ======================= //
/**
 * Admin Portal routes.
 */
router.route('/admin-dashboard')
    .get(adminController.admin_dashboard_get)
    .post(adminController.admin_dashboard_post)

/**
 * route method for admin to handle the students portal.
 */
router.route('/admin-students')
    .get(adminController.admin_students_get)
    .post(adminController.admin_students_post)

/**
 * route method for admin to handle the faculties portal.
 */
router.route('/admin-faculties')
    .get(adminController.admin_faculties_get)
    .post(adminController.admin_faculties_post)

/**
 * route methods for admin to handle the courses.
 */
router.route('/admin-courses')
    .get(adminController.admin_courses_get)
    .post(adminController.admin_courses_post)

// ======================= Logout Portal ======================= //
/**
 * Logout router.
 */
router.route('/logout')
    .post(logoutController.logout_post)

module.exports = router;