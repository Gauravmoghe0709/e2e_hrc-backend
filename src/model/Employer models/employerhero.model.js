const mongoose = require('mongoose');

const employerHeroSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    image: { type: String, default: '' },
    imageurl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('EmployerHero', employerHeroSchema);