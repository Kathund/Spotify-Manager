import { autoModBypassRole } from '../../config.json';
import { readFileSync, writeFileSync } from 'fs';
import { UserPermit } from '../commands/automod';

export default function CheckPermits() {
  const permitData = readFileSync('data/permit.json');
  if (permitData === undefined) return;
  const permit = JSON.parse(permitData.toString());
  if (permit === undefined) return;
  const currentTime = Math.floor(new Date().getTime() / 1000);
  permit.forEach((user: UserPermit) => {
    if (user.removeTime < currentTime) {
      const guildMember = guild.members.cache.get(user.id);
      if (guildMember) {
        guildMember.roles.remove(autoModBypassRole);
      }
      permit.splice(permit.indexOf(user), 1);
    }
  });
  writeFileSync('data/permit.json', JSON.stringify(permit));
}
