let gameStarted = false;
let gameOver = false;

export function setGameStarted(value) {
  gameStarted = value;
}

export function isGameStarted() {
  return gameStarted;
}

export function setGameOver(value) {
  gameOver = value;
}

export function isGameOver() {
  return gameOver;
}
