export class NationalTeam {
  group = "";
  teamName = "";
  isoCode = "";
  rankingFIBA = 0;
  gamesWon = 0;
  gamesLost = 0;
  scoredPointsInTotal = 0;
  receivedPointsInTotal = 0;
  difference = 0;
  gamesHistory = [];
  groupPhasePoints = 0;

  constructor(teamName, isoCode, rankingFIBA, group) {
    this.group = group;
    this.teamName = teamName;
    this.isoCode = isoCode;
    this.rankingFIBA = rankingFIBA;
  }

  increaseNumberOfGamesWon() {
    this.gamesWon++;
  }

  increaseNumberOfGamesLost() {
    this.gamesLost++;
  }

  documentGame(teamScore, opponentScore) {
    this.scoredPointsInTotal += teamScore;
    this.receivedPointsInTotal += opponentScore;
    this.difference = this.scoredPointsInTotal - this.receivedPointsInTotal;
    if (teamScore > opponentScore) {
      this.gamesWon++;
    } else this.gamesLost++;
    this.groupPhasePoints = this.gamesWon * 2 + this.gamesLost;
  }
}
