export const clearLines = (lines = 1) => {
  for (let i = 0; i < lines - 1; i++) {
    process.stdout.clearLine(0);
    process.stdout.write('\x1B[1A');
  }
  process.stdout.clearLine(0);
  process.stdout.write('\r');
};
