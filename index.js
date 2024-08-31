const teams = require("./groups.json");
import NationalTeam from "./nationalTeam.js";

const allNationalTeams = [];
Object.keys(teams).forEach((competitionGroup) => {
  teams[competitionGroup].forEach((team) => {
    allNationalTeams.push(
      new NationalTeam(team.Team, team.ISOCode, team.FIBARanking)
    );
  });
});
console.log(allNationalTeams);
