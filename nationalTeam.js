export default class NationalTeam {
  group = "";
  team = "";
  isoCode = "";
  fibaRanking = 0;
  win = 0;
  losses = 0;
  scoredPoints = 0;
  receivedPoints = 0;

  constructor(team, isoCode, fibaRanking, group) {
    this.group = group;
    this.team = team;
    this.isoCode = isoCode;
    this.fibaRanking = fibaRanking;
  }
}
