// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L260-L278
export function TitleCase(string: string): string {
  if (!string) return '';
  return string
    .toLowerCase()
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L216-L225
export function ReplaceVariables(template: string, variables: { [x: string]: string }) {
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}
