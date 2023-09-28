export const GameState = {
  gameStarted: false,
  gameOver: false,

  setGameStarted(value) {
    this.gameStarted = value;
  },

  isGameStarted() {
    return this.gameStarted;
  },

  setGameOver(value) {
    this.gameOver = value;
  },

  isGameOver() {
    return this.gameOver;
  },
};
