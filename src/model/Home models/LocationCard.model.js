const mongoose = require('mongoose');

const locationCardSchema = new mongoose.Schema({
    sectiontitle:{
        type: String,
    },
    image:{
        type: String,
    },
    contryname:{
        type: String,
    },
    cityname:{
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    }, { timestamps: true });

const LocationCard = mongoose.model('LocationCard', locationCardSchema);

module.exports = LocationCard;