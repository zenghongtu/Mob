import * as fs from 'fs';

export function copyFile(src: string, dist: string) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

export function genUniqueKey(): string {
  return (
    Date.now()
      .toString()
      .slice(6) +
    Math.random()
      .toString()
      .slice(2, 8)
  );
}
