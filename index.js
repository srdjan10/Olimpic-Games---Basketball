import { createRequire } from "module";
import { getAllTeamsFromGroup } from "./utils.js";
const require = createRequire(import.meta.url);

const teams = require("./groups.json"); // use the require method
import NationalTeam from "./nationalTeam.js";

//import timova//
const allNationalTeams = [];
const groups = Object.keys(teams);
groups.forEach((competitionGroup) => {
  teams[competitionGroup].forEach((team) => {
    allNationalTeams.push(
      new NationalTeam(
        team.Team,
        team.ISOCode,
        team.FIBARanking,
        competitionGroup
      )
    );
  });
});
//console.log(allNationalTeams);
//import timova//

// Racunanje rezultata//
const generateScore = () => {
  return {
    team1Score: Math.floor(Math.random() * 100),
    team2Score: Math.floor(Math.random() * 100),
  };
};
// Racunanje rezultata//

// Utakmice po grupama//
const simulateGamesForAllGroups = () => {
  const results = [];
  for (const group in groups) {
    const teams = getAllTeamsFromGroup(allNationalTeams, groups[group]);
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const { team1Score, team2Score } = generateScore();
        teams[i].scoredPoints += team1Score;
        teams[i].receivedPoints += team2Score;
        teams[j].scoredPoints += team2Score;
        teams[j].receivedPoints += team1Score;
        if (team1Score > team2Score) {
          teams[i].win++;
          teams[j].losses++;
        } else {
          teams[j].win++;
          teams[i].losses++;
        }
        results.push({
          group: groups[group],
          team1: teams[i].isoCode,
          team2: teams[j].isoCode,
          score: `${team1Score} - ${team2Score}`,
        });
      }
    }
  }
  ///console.log(results);
  return results;
};
simulateGamesForAllGroups();
// Utakmice po grupama//
// Prikaz rezultata//
const displayResults = (results) => {
  console.log("Rezultati utakmica:");
  results.map((result) => {
    console.log(
      `Grupa: ${result.group}, ${result.team1} - ${result.team2}: ${result.score}`
    );
  });
};
console.log("");
// Prikaz rezultata//
// Sortiranje//
const sortTeamsInGroups = () => {
  const standings = [];
  for (const group in groups) {
    const sortedTeams = [
      ...getAllTeamsFromGroup(allNationalTeams, groups[group]),
    ].sort((a, b) => {
      if (a.win !== b.win) return b.win - a.win;
      const aPointDifference = a.scoredPoints - a.receivedPoints;
      const bPointDifference = b.scoredPoints - b.receivedPoints;
      return bPointDifference - aPointDifference;
    });
    sortedTeams.forEach((team) => {
      standings.push({
        group: groups[group],
        Team: team.isoCode,
        wins: team.win,
        losses: team.losses,
        scoredPoints: team.scoredPoints,
        receivedPoints: team.receivedPoints,
        pointDifference: team.scoredPoints - team.receivedPoints,
        points: team.win * 2 + team.losses * 1,
      });
    });
  }
  //console.log(JSON.stringify(standings));
  console.table(standings);
  return standings;
};
sortTeamsInGroups();

const results = simulateGamesForAllGroups();
displayResults(results);
