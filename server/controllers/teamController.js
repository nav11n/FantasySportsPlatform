// controllers/teamController.js

const Team = require("../models/team");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTeam = async (req, res) => {
  const team = new Team({
    name: req.body.name,
    players: req.body.players,
  });

  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    console.error("Error retrieving team:", error);
    res.status(500).json({ message: "Error retrieving team", error: error.message });
  }
};

exports.getTeamPlayers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team.players);
  } catch (error) {
    console.error("Error retrieving team players:", error);
    res.status(500).json({ message: "Error retrieving team players", error: error.message });
  }
};