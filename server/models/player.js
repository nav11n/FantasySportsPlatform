// models/player.js

const mongoose = require("mongoose");

const Player = mongoose.model(
    "Player",
    new mongoose.Schema({
        name: { type: String, required: true },
        score: { type: Number, default: 0 },
        role: {
            type: String,
            enum: [
                "Batsman",
                "Bowler",
                "Wicketkeeper",
                "Captain",
                "Vice Captain",
                "Allrounder",
            ],
            required: true,
        },
    })
);

module.exports = Player;
