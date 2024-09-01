export const getAllTeamsFromGroup = (data, group) => {
  return data.filter((team) => team.group === group);
};
