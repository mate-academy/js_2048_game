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
    this.initialState = initialState;
    // console.log(initialState);
  }

  moveLeft() {
    const gameField = document.querySelector('.game-field');
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];

    gameField.addEventListener('keydown', (e) => {
      if (e.target === 'ArrowLeft') {

      }
    })
  }
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
    const start = document.querySelector('.start');
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const messageStart = document.querySelector('.message-start');
    const randomIndex = () => {
      const randomNumber = Math.floor(Math.random() * 3);

      return randomNumber;
    };
    const cellValue = () => {
      const set = {
        2: 0.9,
        4: 0.1,
      };

      let sum = 0;

      for (const num in set){
        sum += set[num];
      }

      function pickRandom() {
        let pick = Math.random() * sum;

        for (const j in set) {
          pick -= set[j];

          if (pick <= 0) {
            return j;
          }
        }
      }

      return pickRandom();
    };

    start.addEventListener('click', () => {
      const selectedRows = new Set();
      const numberOfTiles = 2;

      for (let i = 0; i < numberOfTiles; i++) {
        const randomRow = trows[randomIndex()];
        const randomRowChildren = [...randomRow.children];
        let randomCell = randomRowChildren[randomIndex()];

        while (selectedRows.has(randomCell && selectedRows.has(randomRow))) {
          randomCell = randomRowChildren[randomIndex()];
        }

        selectedRows.add(randomCell);
        selectedRows.add(randomRow);

        randomCell.textContent = cellValue();
        randomCell.classList.add(`field-cell--${cellValue()}`);
      }

      messageStart.style.display = 'none';
    });
  }
  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
