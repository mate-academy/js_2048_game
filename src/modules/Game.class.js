'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.initialState = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    this.startButton = document.querySelector('.button') 
    this.board = [];
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.startButton.textContent = 'Restart';
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start()
  }

  addRandomCell () {
    let emptyCell = [];
    for (let i = 0; i < this.board.length; i++){
      for (let j = 0; j < this.board.length; j++) {
        if (!this.board[i][j]) {
          emptyCell.push({x: i, y: j,})
        }
      }
    }

    if (emptyCell.length > 0) {
      let randomIndex = Math.floor(Math.random() * emptyCell.length);
      const randomEmptyCell = emptyCell[randomIndex];
      this.board[randomEmptyCell.x][randomEmptyCell.y] = Math.random() < 0.9 ? 2: 4;
    }
    console.log(this.board)
  }
}

module.exports = Game;
