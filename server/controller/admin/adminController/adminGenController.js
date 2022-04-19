// ========================================= (GENERATE ADMIN INFORMATION) =========================================== //
const bcrypt = require('bcrypt');
/**
 * The adminGenController is the engine of the admin part for the Education Management System Web Application. 
 * It will collect the admin data from the admin front end view, perform the CRUD operations with the model and update the user interface accordingly.
 * The adminGenController will communicate with the Mongo database using Mongoose Object Document Mapping (ODM). 
 * The controller is responsible for generating the admin information.
 * It will also handle all the back end functionalities of the interractive web application.
 */
const Admin = require('../../model/adminSchema.js');

// Getting information from .env file
/**
 * secretEmail const will fetch the admin email information from the .env file.
 */
const secretEmail = process.env.ADMIN_EMAIL;
/**
 * secretPassword const will fetch the admin password information from the .env file.
 */
const secretPassword = process.env.ADMIN_PASSWORD;
/**
 * secretToken const will fetch the admin token information from the .env file.
 * This secret token is reserved for the admin only and is used here to track the admin info.
 */
const secretToken = process.env.ADMIN_TOKEN;
/**
 * exports.admin_generate method will generate the admin token automatically by the system.
 * The password will be hashed and needs to be encrypted.
 * It will also update and save the admin information if any change is made in the .env file which is responsible for generating the admin information.
 */
exports.admin_generate = () => {
    Admin.findOne({}, async (err, foundAdmins) => {
        // Hashing admin password
        const hashedPassword = await bcrypt.hash(secretPassword, 10);
        if (!err) {
            // CREATE new admin
            if (foundAdmins === null) {
                const admin = new Admin({
                    email: secretEmail,
                    password: hashedPassword,
                    token: secretToken
                });
                await admin.save();
            } else {
                // UPDATE admin information if changes occurs in .env file
                // Change in password
                await bcrypt.compare(secretPassword, foundAdmins.password, (error, result) => {
                        if (result !== true) {
                            Admin.findOneAndUpdate(
                                {token: secretToken},
                                {password: hashedPassword},
                                {new: true},
                                async (err, data) => {
                                    if (!err) {
                                        console.log(data);
                                    } else {
                                        console.log(err);
                                    }
                                });
                        }
                    }
                );
                // Change in email
                if (foundAdmins.email !== secretEmail) {
                    Admin.findOneAndUpdate(
                        {token: secretToken},
                        {email: secretEmail},
                        {new: true},
                        async (err, data) => {
                            if (!err) {
                                console.log(data);
                            } else {
                                console.log(err);
                            }
                        }
                    );
                }
            }
        } else {
            console.log(err);
        }
    });
}
test('1+1=2', () => {
    expect(1+1).toBe(2);
});
// ========================================= (GENERATE ADMIN INFORMATION) =========================================== //