import { NationalTeam } from "./nationalTeam.js";
import { createRequire } from "module";
import {
  simulateGamesForAllGroups,
  displayGameResultsAfterGroupPhase,
  displayStandingsPerGroup,
  quaterFinalsTeam,
} from "./utils.js";

const require = createRequire(import.meta.url);
const teamsRawData = require("./groups.json");

const competitionGroups = Object.keys(teamsRawData);

const allNationalTeams = (() => {
  const allGroupTeams = [];
  competitionGroups.forEach((competitionGroup) => {
    teamsRawData[competitionGroup].forEach((team) => {
      allGroupTeams.push(
        new NationalTeam(
          team.Team,
          team.ISOCode,
          team.FIBARanking,
          competitionGroup
        )
      );
    });
  });
  return allGroupTeams;
})();

// Grupna faza
const results = simulateGamesForAllGroups(allNationalTeams, competitionGroups);
displayGameResultsAfterGroupPhase(results);
displayStandingsPerGroup(competitionGroups, allNationalTeams);

// Quaterfinals, Semifinals && Finals
quaterFinalsTeam(allNationalTeams);
