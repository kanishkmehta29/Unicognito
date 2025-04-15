const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    commentsId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments',
        }
    ],
    courseLink: {
        type: String,
        required: true,
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    coursePic: {
        type: String,
    },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
