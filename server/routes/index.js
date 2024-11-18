// routes/index.js

const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const teamController = require("../controllers/teamController");
const playerController = require("../controllers/playerController");

// Match routes
router.get("/matches", matchController.getAllMatches);
router.post("/matches", matchController.createMatch);

// Team routes
router.get("/teams", teamController.getAllTeams);
router.post("/teams", teamController.createTeam);
router.get("/teams/:id", teamController.getTeamById);
router.get("/teams/:id/players", teamController.getTeamPlayers);  // New route for getting team players

// Player routes
router.get("/players", playerController.getAllPlayers);
router.post("/players", playerController.createPlayer);

module.exports = router;