import { createRequire } from "module";
import { getAllTeamsFromGroup } from "./utils.js";
const require = createRequire(import.meta.url);

const teams = require("./groups.json"); // use the require method
import { NationalTeam, NationalTeamWithStatistics } from "./nationalTeam.js";

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
const generateScore = (team1, team2) => {
  let team1Score,
    team2Score = null;
  let fibaRatio =
    team1.fibaRanking > team2.fibaRanking
      ? team2.fibaRanking / team1.fibaRanking
      : team1.fibaRanking / team2.fibaRanking;

  let biggerScore = Math.floor(Math.random() * 50 + 50);
  let loverScore = Math.floor(biggerScore * fibaRatio);

  if (team1.fibaRanking < team2.fibaRanking) {
    team1Score = biggerScore;
    team2Score = loverScore;
  } else {
    team1Score = loverScore;
    team2Score = biggerScore;
  }
  return {
    team1Score,
    team2Score,
    /*   team1Score: Math.floor(Math.random() * 101),
    team2Score: Math.floor(Math.random() * 101), */
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
        const { team1Score, team2Score } = generateScore(teams[i], teams[j]);
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

// Utakmice po grupama//
// Prikaz rezultata//
const displayResults = (results) => {
  console.log("Rezultati utakmica:");

  let currentGroup = null;
  results.forEach((result) => {
    if (result.group !== currentGroup) {
      console.log(`\nGrupa ${result.group}:`);
      currentGroup = result.group;
    }
    console.log(` ${result.team1} - ${result.team2}: ${result.score}`);
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
  //console.table(standings);
  return standings;
};

// Tabela//
const displayStandings = () => {
  console.log("Tabele po grupama:");
  const standings = sortTeamsInGroups();
  const grouped = standings.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});

  const tableGroup = (groupedData) => {
    console.log(
      "Group | Team | Pobede | Porazi | Poeni | Postignuti kosevi | Primljeni kosevi | Kos razlika"
    );
    console.log(
      "------------------------------------------------------------------"
    );
    for (const [group, items] of Object.entries(groupedData)) {
      items.forEach((item) => {
        console.log(
          `${group.padEnd(5)} | ${item.Team} | ${item.wins} | ${
            item.losses
          } | ${item?.points} | ${item?.scoredPoints} | ${
            item?.receivedPoints
          } | ${item?.pointDifference} `
        );
      });
      console.log(
        "------------------------------------------------------------------"
      );
    }
  };
  tableGroup(grouped);
  //Eliminaciona faza//

  //matchQF;
  const sortedTeams = Object.entries(standings)
    .map(
      ([nationalTeam]) =>
        new NationalTeamWithStatistics(
          nationalTeam.team,
          nationalTeam.isoCode,
          nationalTeam.fibaRanking
        )
    )
    .sort((a, b) => {
      if (b.wins !== a.wins) return a.wins - b.wins;
      return b.pointDifference - a.pointDifference;
    })
    .map((team) => team.teamN);
  const top8Teams = sortedTeams.slice(0, 8);
  console.log("Najbolji timovi plasirali su se u cetvrtfinale:");
  console.log(top8Teams.join(","));
  console.log("");
  /////////////////////////////////////////////////////////////////////
  console.log("Sesiri:");
  const newGroup = ["D", "E", "F", "G"];
  console.log(`Sesir ${newGroup.slice(0, 1)}`);
  for (let i = 0; i < top8Teams.length - 6; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  console.log(`Sesir ${newGroup.slice(1, 2)}`);
  for (let i = 2; i < top8Teams.length - 4; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  console.log(`Sesir ${newGroup.slice(2, 3)}`);
  for (let i = 4; i < top8Teams.length - 2; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  console.log(`Sesir ${newGroup.slice(3, 4)}`);
  for (let i = 6; i < top8Teams.length; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  console.log("");
  console.log("Cetvrtfinalne utakmice");
  console.log("");
  const matchQF = [
    [top8Teams[0], top8Teams[1]],
    [top8Teams[2], top8Teams[3]],
    [top8Teams[4], top8Teams[5]],
    [top8Teams[6], top8Teams[7]],
  ];

  const matchSF = [];
  const simulateMatch = (team1, team2) => {
    const { team1Score, team2Score } = generateScore(team1, team2);
    if (team1Score > team2Score) {
      matchSF.push(team1);
    } else {
      matchSF.push(team2);
    }
    return ` ${team1} - ${team2} : ${team1Score} - ${team2Score}`;
  };
  matchQF.forEach((game) => {
    const resultMatch = simulateMatch(game[0], game[1]);
    console.log(resultMatch);
    //console.log("");
  });
  console.log("");
  console.log(`Timovi polufinala: ${matchSF}`);

  ///////////////////polufinale////////////////////
  console.log("");
  console.log("Polufinalne utakmice");
  console.log("");
  const semifinalGame = (team) => {
    return [
      { team1: team[0], team2: team[3] },
      { team1: team[1], team2: team[2] },
    ];
  };
  const semifinalGameMatch = semifinalGame(matchSF);
  const bronze = [];
  const gold = [];
  semifinalGameMatch.forEach((game) => {
    const { team1Score, team2Score } = generateScore(game.team1, game.team2);
    if (team1Score > team2Score) {
      gold.push(game.team1);
      bronze.push(game.team2);
    } else {
      gold.push(game.team2);
      bronze.push(game.team1);
    }
    console.log(
      `${game.team1} - ${game.team2} : ${team1Score} - ${team2Score}`
    );
    return gold, bronze;
  });
  console.log("");
  ///////////////////polufinale////////////////////

  console.log("");
  console.log("Utakmica za bronzanu medalju 🥉:");
  const { team1Score, team2Score } = generateScore(game.team1, game.team2);
  console.log(`${bronze[0]} - ${bronze[1]}: ${team1Score} - ${team2Score}`);
  const Medal = team1Score > team2Score ? bronze[0] : bronze[1];
  console.log("");

  console.log("Utakmica za zlatnu medalju 🥇:");
  const simulateFinal = () => {
    const point1ScoreFinal = Math.floor(Math.random() * 100);
    const point2ScoreFinal = Math.floor(Math.random() * 100);
    console.log(
      `${gold[0]} - ${gold[1]}: ${point1ScoreFinal} - ${point2ScoreFinal}`
    );
    const MedalG = point1ScoreFinal > point2ScoreFinal ? gold[0] : gold[1];
    const MedalS = point1ScoreFinal < point2ScoreFinal ? gold[0] : gold[1];
    console.log("");

    console.log("Medalje:");
    console.log(`🥇🏆  1.${MedalG}`);
    console.log(`🥈    2.${MedalS}`);
    console.log(`🥉    3.${Medal}`);
  };
  simulateFinal();

  return top8Teams;
  //matchQF;
  //Eliminaciona faza//
};
const results = simulateGamesForAllGroups();
displayResults(results);
displayStandings();
