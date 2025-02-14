export function camelCase(str: string, firstCapital: boolean = false): string {
  if (firstCapital) str = ' ' + str;
  return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}
