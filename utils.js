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
        teamsForGroup[i].documentGame(team1Score, team2Score);
        teamsForGroup[j].documentGame(team2Score, team1Score);

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
export const quaterFinalsTeam = (standings) => {
  const sortedTeams = Object.entries(standings)
    .map(([team, stats]) => ({
      team,
      gamesWon: stats.gamesWon,
      isoCode: stats.isoCode,
      difference: stats.scoredPointsInTotal - stats.receivedPointsInTotal,
    }))
    .sort((a, b) => {
      if (b.wins !== a.wins) return a.wins - b.wins;
      return b.difference - a.difference;
    })
    .map((team) => team.isoCode);
  const top8Teams = sortedTeams.slice(0, 8);
  console.log("");
  console.log("Najbolji timovi plasirali su se u cetvrtfinale:");
  console.log(top8Teams.join(","));
  console.log("");
  //Odredjivanje sesira za dalje takmicenje
  const newGroup = ["D", "E", "F", "G"];
  console.log(`Sesir: ${newGroup.slice(0, 1)}`);
  for (let i = 0; i < top8Teams.length - 6; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  console.log(`Sesir: ${newGroup.slice(1, 2)}`);
  for (let i = 2; i < top8Teams.length - 4; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  console.log(`Sesir: ${newGroup.slice(2, 3)}`);
  for (let i = 4; i < top8Teams.length - 2; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  console.log(`Sesir: ${newGroup.slice(3, 4)}`);
  for (let i = 6; i < top8Teams.length; i++) {
    const element = top8Teams[i];
    console.log(element);
  }
  return top8Teams;
};
// Cetvrtfinalne utakmice
export const nextGroupQF = (top8Teams) => {
  console.log("");
  console.log("Cetvrtfinalne utakmice");
  console.log("");
  console.log(top8Teams);
  const matchQF = [
    [top8Teams[0], top8Teams[1]],
    [top8Teams[2], top8Teams[3]],
    [top8Teams[4], top8Teams[5]],
    [top8Teams[6], top8Teams[7]],
  ];
