// controllers/matchController.js

const Match = require('../models/match');

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMatch = async (req, res) => {
    const match = new Match({
        date: req.body.date,
        teams: req.body.teams,
        winner: req.body.winner,
    });

    try {
        const newMatch = await match.save();
        res.status(201).json(newMatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
