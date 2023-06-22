export function flipArray(arr) {
  const turnedArray = Array.from({
    length: arr.length,
  }).map(() => []);

  for (const i in arr) {
    for (const j in arr[i]) {
      turnedArray[i].push(arr[j][i]);
    }
  }

  return turnedArray;
}

export function getRandomDigit(max) {
  // the maximum is NOT inclusive
  return Math.floor(Math.random() * max);
}
