import { devRole, teamRole } from '../../config.json';
export default async function isStaffMember(userId: string): Promise<boolean> {
  const user = await guild.members.fetch(userId);
  const memberRoles = user.roles.cache.map((role) => role.id);
  if (memberRoles.includes(devRole) || memberRoles.includes(teamRole) || '672008637887021056' === userId) return true;
  return false;
}
