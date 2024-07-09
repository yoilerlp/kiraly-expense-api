export function removeSpecialCharacters(filename: string): string {
  const regex = /[^\w\d\-._]+/g;

  const cleanedFilename = filename.replace(regex, '_');

  return cleanedFilename;
}
