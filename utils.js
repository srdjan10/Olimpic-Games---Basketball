export const getAllTeamsForSpecifiedGroup = (data, group) => {
  return data.filter((nationTeam) => nationTeam.group === group);
};

export const generateScore = (team1, team2) => {
  let team1Score,
    team2Score = null;
  let fibaRatio =
    team1.rankingFIBA > team2.rankingFIBA
      ? team2.rankingFIBA / team1.rankingFIBA
      : team1.rankingFIBA / team2.rankingFIBA;

  let biggerScore = Math.floor(Math.random() * 50 + 50);
  let lowerScore = Math.floor(biggerScore * fibaRatio);

  if (team1.rankingFIBA < team2.rankingFIBA) {
    team1Score = biggerScore;
    team2Score = lowerScore;
  } else {
    team1Score = lowerScore;
    team2Score = biggerScore;
  }
  return { team1Score, team2Score };
};

export const displayGameResultsAfterGroupPhase = (results) => {
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

// Simulacija utakmica -> sve rezultate utakmica
export const simulateGamesForAllGroups = (
  allNationalTeams,
  competitionGroups
) => {
  const allGamesWithResults = [];
  for (const group in competitionGroups) {
    const teamsForGroup = getAllTeamsForSpecifiedGroup(
      allNationalTeams,
      competitionGroups[group]
    );
    for (let i = 0; i < teamsForGroup.length; i++) {
      for (let j = i + 1; j < teamsForGroup.length; j++) {
        const { team1Score, team2Score } = generateScore(
          teamsForGroup[i],
          teamsForGroup[j]
        );
        teamsForGroup[i].documentGame(
          teamsForGroup[j].teamName,
          team1Score,
          team2Score
        );
        teamsForGroup[j].documentGame(
          teamsForGroup[i].teamName,
          team2Score,
          team1Score
        );

        allGamesWithResults.push({
          group: competitionGroups[group],
          team1: teamsForGroup[i].isoCode,
          team2: teamsForGroup[j].isoCode,
          score: `${team1Score} - ${team2Score}`,
        });
      }
    }
  }
  return allGamesWithResults;
};
//Simulacija utakmica eliminacione faze
const simulateMatch = (team1, team2) => {
  let winner = null;
  const { team1Score, team2Score } = generateScore(team1, team2);
  team1.documentGame(team2.isoCode, team1Score, team2Score);
  team2.documentGame(team1.isoCode, team2Score, team1Score);
  if (team1Score > team2Score) {
    winner = team1;
  } else {
    winner = team2;
  }
  return winner;
};
//Sortiranje timova u grupi
export const sortTeamsInGroups = (competitionGroups, allNationalTeams) => {
  const standings = [];
  for (const group in competitionGroups) {
    const sortedTeamsInPerGroup = [
      ...getAllTeamsForSpecifiedGroup(
        allNationalTeams,
        competitionGroups[group]
      ),
    ].sort((teamA, teamB) => {
      if (teamA.win !== teamB.win) return teamB.win - teamA.win;
      const aPointDifference =
        teamA.scoredPointsInTotal - teamA.receivedPointsInTotal;
      const bPointDifference =
        teamB.scoredPointsInTotal - teamB.receivedPointsInTotal;
      return bPointDifference - aPointDifference;
    });
    standings.push([...sortedTeamsInPerGroup]);
  }
  return standings;
};

//prikaz timova u grupi
export const displayStandingsPerGroup = (
  competitionGroups,
  allNationalTeams
) => {
  console.log("Tabele po grupama:");
  const standings = sortTeamsInGroups(competitionGroups, allNationalTeams);
  console.log(
    "Group | Team | Pobede | Porazi | Poeni | Postignuti kosevi | Primljeni kosevi | Kos razlika"
  );
  console.log(
    "------------------------------------------------------------------"
  );
  for (const [group, items] of Object.entries(standings)) {
    items.forEach((item) => {
      console.log(
        `${item.group.padEnd(5)} | ${item.isoCode} | ${item.gamesWon} | ${
          item.gamesLost
        } | ${item?.groupPhasePoints} | ${item?.scoredPointsInTotal} | ${
          item?.receivedPointsInTotal
        } | ${item?.difference} `
      );
    });
    console.log(
      "------------------------------------------------------------------"
    );
  }
};

//Timovi koji su se plasirali u cetvrtfinale
export const getQuaterFinalTeams = (allNationalTeams) => {
  const sortedTeams = allNationalTeams.sort((a, b) => {
    if (b.gamesWon === a.gamesWon) {
      return b.difference - a.difference;
    }
    return b.gamesWon - a.gamesWon;
  });
  const top8TeamNames = sortedTeams.map((team) => team.isoCode).slice(0, 8);
  console.log("");
  console.log("Najbolji timovi plasirali su se u cetvrtfinale:");
  console.log(top8TeamNames.join(","));
  console.log("");
  //Odredjivanje sesira za dalje takmicenje
  const newGroup = ["D", "E", "F", "G"];
  console.log(`Sesir: ${newGroup.slice(0, 1)}`);
  for (let i = 0; i < top8TeamNames.length - 6; i++) {
    const element = top8TeamNames[i];
    console.log(element);
  }
  console.log(`Sesir: ${newGroup.slice(1, 2)}`);
  for (let i = 2; i < top8TeamNames.length - 4; i++) {
    const element = top8TeamNames[i];
    console.log(element);
  }
  console.log(`Sesir: ${newGroup.slice(2, 3)}`);
  for (let i = 4; i < top8TeamNames.length - 2; i++) {
    const element = top8TeamNames[i];
    console.log(element);
  }
  console.log(`Sesir: ${newGroup.slice(3, 4)}`);
  for (let i = 6; i < top8TeamNames.length; i++) {
    const element = top8TeamNames[i];
    console.log(element);
  }
  return sortedTeams.slice(0, 8);
};

// Eliminacione faze
export const simulateGamesForEliminationPhases = (teams) => {
  let matches = [];
  const winners = [];
  switch (teams.length) {
    case 2: {
      console.log("");
      console.log("Finale:");
      console.log("");
      matches = [[teams[0], teams[1]]];

      break;
    }
    case 4: {
      console.log("");
      console.log("Polufinale:");
      console.log("");
      matches = [
        [teams[0], teams[3]],
        [teams[1], teams[2]],
      ];
      break;
    }
    case 8: {
      console.log("");
      console.log("Cetvrtfinale:");
      console.log("");
      matches = [
        [teams[0], teams[1]],
        [teams[2], teams[3]],
        [teams[4], teams[5]],
        [teams[6], teams[7]],
      ];
      break;
    }
  }
  matches.forEach((oponents) => {
    const team1 = oponents[0];
    const team2 = oponents[1];

    const winner = simulateMatch(team1, team2);
    const winnersLastGame = winner.gamesHistory[winner.gamesHistory.length - 1];

    console.log(
      ` ${winner.isoCode} - ${winnersLastGame.oponent} : ${winnersLastGame.teamScore} - ${winnersLastGame.opponentScore}`
    );
    winners.push(winner);
  });

  return winners;
};
