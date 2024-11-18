import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Matches.css";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam1, setSelectedTeam1] = useState("");
  const [selectedTeam2, setSelectedTeam2] = useState("");

  const calculateTotalScore = (teamId) => {
    const teamMatches = matches.filter((match) => match.winner === teamId);
    const totalScore = teamMatches.reduce((acc, match) => {
      const teamIndex = match.teams.indexOf(teamId);
      const score = match.scores[teamIndex] || match.score[teamIndex] || 0;
      return acc + score;
    }, 0);
    return totalScore;
  };

  const processMatches = useCallback((matchesData, teamsData) => {
    return matchesData.map((match) => {
      const team1 = teamsData.find((team) => team._id === match.teams[0]);
      const team2 = teamsData.find((team) => team._id === match.teams[1]);
      const totalScoreTeam1 = calculateTotalScore(team1._id);
      const totalScoreTeam2 = calculateTotalScore(team2._id);
      const winner = totalScoreTeam1 > totalScoreTeam2 ? team1.name : team2.name;
      return {
        ...match,
        teams: [team1 ? team1.name : "Unknown", team2 ? team2.name : "Unknown"],
        winner,
        totalScoreTeam1,
        totalScoreTeam2,
      };
    });
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:5000/teams"),
      axios.get("http://localhost:5000/matches")
    ])
      .then(([teamsResponse, matchesResponse]) => {
        const teamsData = teamsResponse.data;
        const matchesData = matchesResponse.data;
        setTeams(teamsData);
        setMatches(processMatches(matchesData, teamsData));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || "An error occurred while fetching data");
        setLoading(false);
      });
  }, [processMatches]);

  const addMatch = useCallback(() => {
    if (!selectedTeam1 || !selectedTeam2) {
      setError("Please select two teams");
      return;
    }

    const totalScoreTeam1 = calculateTotalScore(selectedTeam1);
    const totalScoreTeam2 = calculateTotalScore(selectedTeam2);
    const winner = totalScoreTeam1 > totalScoreTeam2 ? selectedTeam1 : selectedTeam2;

    const newMatchData = {
      teams: [selectedTeam1, selectedTeam2],
      winner,
      date: new Date().toISOString(),
    };

    axios
      .post("http://localhost:5000/matches", newMatchData)
      .then(() => {
        fetchData();
        setSelectedTeam1("");
        setSelectedTeam2("");
        setError(null);
      })
      .catch((error) => {
        console.error("Error response:", error.response);
        setError(
          error.response?.data?.message ||
            error.message ||
            "An error occurred while adding the match"
        );
      });
  }, [selectedTeam1, selectedTeam2, calculateTotalScore, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="matches-container">
      <h1 className="matches-heading">Matches</h1>

      <div className="team-select">
        <label htmlFor="team1">Team 1:</label>
        <select
          id="team1"
          value={selectedTeam1}
          onChange={(e) => setSelectedTeam1(e.target.value)}
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="team-select">
        <label htmlFor="team2">Team 2:</label>
        <select
          id="team2"
          value={selectedTeam2}
          onChange={(e) => setSelectedTeam2(e.target.value)}
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <button className="add-match-button" onClick={addMatch}>
        Add Match
      </button>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : matches.length > 0 ? (
        matches.map((match) => (
          <div key={match._id} className="match-card">
            <p>
              Teams: {match.teams[0]} vs {match.teams[1]}
            </p>
            <p>Winner: {match.winner}</p>
            
          </div>
        ))
      ) : (
        <p>No matches available</p>
      )}
    </div>
  );
};

export default Matches;
