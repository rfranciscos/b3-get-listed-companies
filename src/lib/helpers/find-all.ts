export const collectAllMatches = (regExp: RegExp, data: string): string[] => {
  const matches: string[] = [];
  while (true) {
    const match = regExp.exec(data);
    if (match === null) break;
    matches.push(match[1]);
  }
  return matches;
}