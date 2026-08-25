export function isPdf(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf');
}
