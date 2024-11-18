// models/match.js

const mongoose = require("mongoose");

const Match = mongoose.model(
    "Match",
    new mongoose.Schema({
        date: { type: Date, required: true },
        teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
        winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    })
);

module.exports = Match;
