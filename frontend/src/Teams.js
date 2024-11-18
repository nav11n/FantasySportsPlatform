import React, { useState, useEffect } from "react";
import axios from "axios";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/teams")
      .then((response) => {
        setTeams(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/teams", formData);
      setFormData({
        name: "",
      });
      const updatedResponse = await axios.get("http://localhost:5000/teams");
      setTeams(updatedResponse.data);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleTeamClick = (team) => {
    setLoadingPlayers(true);
    axios
      .get(`http://localhost:5000/teams/${team._id}/players`)
      .then((response) => {
        setSelectedTeam({ ...team, players: response.data });
        setLoadingPlayers(false);
      })
      .catch((error) => {
        console.error("Error fetching team players:", error);
        setLoadingPlayers(false);
      });
  };

  return (
    <div
      className="team-display"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <h2 style={{ marginBottom: "20px", marginTop: "17px" }}>Teams</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading teams...</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {teams.map((team) => (
            <li
              key={team._id}
              style={{
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
                padding: "10px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              onClick={() => handleTeamClick(team)}
            >
              {team.name}
              {selectedTeam && selectedTeam._id === team._id && (
                <div>
                  {loadingPlayers ? (
                    <p>Loading players...</p>
                  ) : (
                    <ul>
                      {selectedTeam.players.map((player) => (
                        <li key={player._id}>
                          {player.name} - {player.score} ({player.role})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Team;