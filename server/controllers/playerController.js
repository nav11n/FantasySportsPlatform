// controllers/playerController.js

const Player = require('../models/player');

exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPlayer = async (req, res) => {
   const player = new Player({
        name: req.body.name,
        score: req.body.score,
        role: req.body.role
    });

    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
