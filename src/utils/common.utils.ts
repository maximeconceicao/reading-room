export const getLastThreeWords = (str: String) => {
  const wordsArray = str.split(' ');
  if (wordsArray.length <= 3) return str;
  const lastThreeWordsArray = wordsArray.slice(-3);
  const lastThreeWords = lastThreeWordsArray.join(' ');
  return lastThreeWords;
};
