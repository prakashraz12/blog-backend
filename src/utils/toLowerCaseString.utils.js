export const toLowerCaseSrting = (string) => {
  const lowerCase =
    string.length > 0 && string.map((item) => item.toLowerCase());
  return lowerCase;
};
