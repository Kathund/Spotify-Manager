export default function getVariables(input: string): { [key: string]: string } {
  const regex = /{(\w+)}/g;
  const variables: { [key: string]: string } = {};
  let match;
  while (null !== (match = regex.exec(input))) {
    variables[match[1]] = match[0];
  }
  return variables;
}
