// CREDIT: https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/06ad207b060f886be2fa322ead0c8a289ee08aaa/src/contracts/helperFunctions.js#L263-L267
export default function ReplaceVariables(template: string, variables: { [x: string]: string }) {
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}
