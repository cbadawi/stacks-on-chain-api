export default function commaSeperatedToArray(values: string): string[] {
  return values.split(',').map((x) => x.trim());
}
