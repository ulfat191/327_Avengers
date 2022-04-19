const mongoose = require('mongoose');
/**
 * adminSchema.
 */
const Schema = mongoose.Schema;

let adminSchema = new Schema({
    /**
     * @type {String}
     */
    email: {
        type: String,
        required: true
    },
    /**
     * @type {String}
     */
    password: {
        type: String,
        required: true
    },
    /**
     * @type {String}
     */
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Admin', adminSchema);



