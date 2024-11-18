// TeamCreation.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const TeamCreation = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:5000/players")
            .then((response) => {
                setPlayers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching players:", error);
                setLoading(false);
            });
    }, []);

    const handlePlayerSelection = (playerId) => {
        const selectedPlayer = players.find((player) => player._id === playerId);
        if (selectedPlayer) {
            const roleCount = selectedPlayers.filter(
                (player) => player.role === selectedPlayer.role
            ).length;
            const roleLimit = getRoleLimit(selectedPlayer.role);
            if (roleCount >= roleLimit) {
                console.log(
                    `You can select only ${roleLimit} ${selectedPlayer.role}s.`
                );
                return;
            }
            setSelectedPlayers([...selectedPlayers, selectedPlayer]);
        }
    };

    const getRoleLimit = (role) => {
        const roleLimits = {
            Batsman: 5,
            Bowler: 5,
            Wicketkeeper: 1,
            Captain: 1,
            "Vice Captain": 1,
            Allrounder: 2,
        };
        return roleLimits[role] || 0;
    };

    const handleTeamNameChange = (event) => {
        setTeamName(event.target.value);
    };

    const handleCreateTeam = () => {
        const requiredRoles = [
            "Batsman",
            "Bowler",
            "Wicketkeeper",
            "Captain",
            "Vice Captain",
            "Allrounder",
        ];
        for (const role of requiredRoles) {
            const roleCount = selectedPlayers.filter(
                (player) => player.role === role
            ).length;
            if (roleCount === 0) {
                alert(`Please select a ${role}.`);
                return;
            }
        }
        const newTeam = {
            name: teamName,
            players: selectedPlayers.map((player) => player._id),
        };
        axios
            .post("http://localhost:5000/teams", newTeam)
            .then((response) => {
                console.log("Team created:", response.data);
                setSelectedPlayers([]);
                setTeamName("");
            })
            .catch((error) => {
                console.error("Error creating team:", error);
            });
    };

    return (
        <div className="team-creation">
            <h2>Create Team</h2>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <div>
                    <label htmlFor="teamName">Team Name:</label>
                    <input
                        type="text"
                        id="teamName"
                        value={teamName}
                        onChange={handleTeamNameChange}
                    />
                    <ul>
                        {players.map((player) => (
                            <li key={player._id}>
                                <input
                                    type="checkbox"
                                    id={player._id}
                                    onChange={() => handlePlayerSelection(player._id)}
                                    disabled={
                                        selectedPlayers.filter((p) => p.role === player.role)
                                            .length >= getRoleLimit(player.role)
                                    } 
                                />
                                <label htmlFor={player._id}>
                                    {player.name} - Score: {player.score} - {player.role}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleCreateTeam}>Create Team</button>
                </div>
            )}
        </div>
    );
};

export default TeamCreation;
