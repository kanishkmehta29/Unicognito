const mongoose = require('mongoose');


const skillsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
});

const Skills = mongoose.model('Skills', skillsSchema);

module.exports = Skills;
