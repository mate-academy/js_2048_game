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
    if (initialState) {
      this.state = initialState;
      this.startState = initialState;
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.startState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.status = 'idle';
    this.score = 0;
    // eslint-disable-next-line no-console
  }

  moveLeft() {
    const stateBeforeMove = [[], [], [], []];
    const stateToModify = [[], [], [], []];

    if (this.getStatus() === 'playing') {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          stateBeforeMove[i][j] = this.getState()[i][j];
          stateToModify[i][j] = this.getState()[i][j];
        }
      }

      const mLeft = (row) => {
        for (let j = 0; j < 4; j++) {
          for (let k = 0; k < 3; k++) {
            if (row[k] === 0) {
              row[k] = row[k + 1];
              row[k + 1] = 0;
            }
          }
        }
      };

      for (let i = 0; i < 4; i++) {
        const row = stateToModify[i];

        mLeft(row);

        for (let j = 0; j < 3; j++) {
          if (row[j] === row[j + 1]) {
            row[j] = row[j] * 2;
            row[j + 1] = 0;

            this.setScore(row[j]);
          }
        }
        mLeft(row);

        stateToModify[i] = row;
      }

      if (JSON.stringify(this.getState()) !== JSON.stringify(stateToModify)) {
        this.createNewCell(stateToModify);
      }
      this.checkLose();
      this.checkWin();
    }
  }
  moveRight() {
    const stateBeforeMove = [[], [], [], []];
    const stateToModify = [[], [], [], []];

    if (this.getStatus() === 'playing') {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          stateBeforeMove[i][j] = this.getState()[i][j];
          stateToModify[i][j] = this.getState()[i][j];
        }
      }

      const mRight = (row) => {
        for (let j = 3; j >= 0; j--) {
          for (let k = 3; k > 0; k--) {
            if (row[k] === 0) {
              row[k] = row[k - 1];
              row[k - 1] = 0;
            }
          }
        }
      };

      for (let i = 0; i < 4; i++) {
        const row = stateToModify[i];

        mRight(row);

        for (let j = 3; j >= 0; j--) {
          if (row[j] === row[j - 1]) {
            row[j] = row[j] * 2;
            row[j - 1] = 0;

            this.setScore(row[j]);
          }
        }
        mRight(row);

        stateToModify[i] = row;
      }

      if (JSON.stringify(this.getState()) !== JSON.stringify(stateToModify)) {
        this.createNewCell(stateToModify);
      }
      this.checkLose();
      this.checkWin();
    }
  }
  moveUp() {
    const stateToModify = [[], [], [], []];

    function mUp(column) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (column[j] === 0) {
            column[j] = column[j + 1];
            column[j + 1] = 0;
          }
        }
      }
    }

    if (this.getStatus() === 'playing') {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          stateToModify[i][j] = this.getState()[i][j];
        }
      }

      for (let i = 0; i < 4; i++) {
        const column = [];

        for (let j = 0; j < 4; j++) {
          column[j] = stateToModify[j][i];
        }
        mUp(column);

        for (let j = 0; j < 3; j++) {
          if (column[j] === column[j + 1]) {
            column[j] = column[j] * 2;
            column[j + 1] = 0;
            this.setScore(column[j]);
          }
        }

        mUp(column);

        for (let j = 0; j < 4; j++) {
          stateToModify[j][i] = column[j];
        }
      }

      if (JSON.stringify(this.getState()) !== JSON.stringify(stateToModify)) {
        this.createNewCell(stateToModify);
      }
      this.checkLose();
      this.checkWin();
    }
  }
  moveDown() {
    const stateToModify = [[], [], [], []];

    function mDown(column) {
      for (let i = 3; i >= 0; i--) {
        for (let j = 3; j > 0; j--) {
          if (column[j] === 0) {
            column[j] = column[j - 1];
            column[j - 1] = 0;
          }
        }
      }
    }

    if (this.getStatus() === 'playing') {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          stateToModify[i][j] = this.getState()[i][j];
        }
      }

      for (let i = 0; i < 4; i++) {
        const column = [];

        for (let j = 0; j < 4; j++) {
          column[j] = stateToModify[j][i];
        }
        mDown(column);

        for (let j = 0; j < 3; j++) {
          if (column[j] === column[j + 1]) {
            column[j] = column[j] * 2;
            column[j + 1] = 0;

            this.setScore(column[j]);
          }
        }

        mDown(column);

        for (let j = 0; j < 4; j++) {
          stateToModify[j][i] = column[j];
        }
      }

      if (JSON.stringify(this.getState()) !== JSON.stringify(stateToModify)) {
        this.createNewCell(stateToModify);
      }
      this.checkLose();
      this.checkWin();
    }
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.getState()[i][j] === 2048) {
          this.setStatus('win');
        }
      }
    }
  }

  checkLose() {
    let numOfUnevenChecks = 0;
    let numOfFreeFields = 16;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.getState()[i][j] !== 0) {
          numOfFreeFields--;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.getState()[i][j] !== this.getState()[i][j + 1]) {
          numOfUnevenChecks++;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.getState()[j][i] !== this.getState()[j + 1][i]) {
          numOfUnevenChecks++;
        }
      }
    }

    if (numOfUnevenChecks === 24 && numOfFreeFields === 0) {
      this.setStatus('lose');
    }
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  setScore(newScore) {
    this.score = this.getScore() + newScore;
  }

  resetScore() {
    this.score = 0;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = newState;
  }

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
  getStatus() {
    return this.status;
  }

  setStatus(newStatus) {
    this.status = newStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.setStatus('playing');
    this.makeNewField();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.setStatus('idle');
    this.setState(this.startState);
    this.resetScore();
  }

  makeNewField() {
    const firstCellValue = newCellValueGenerator();
    const secondCellValue = newCellValueGenerator();
    const flattenedStartState = this.startState
      .map((innerArray) => innerArray.slice())
      .flat(1);
    const freeCellId = [];

    for (let i = 0; i < flattenedStartState.length; i++) {
      if (flattenedStartState[i] === 0) {
        freeCellId.push(i);
      }
    }

    if (freeCellId.length === 0) {
      return;
    }

    const firstCellPosition = Math.round(
      Math.random() * (freeCellId.length - 1),
    );
    let secondCellPosition = Math.round(
      Math.random() * (freeCellId.length - 1),
    );

    while (firstCellPosition === secondCellPosition) {
      secondCellPosition = Math.round(Math.random() * freeCellId.length);
    }

    flattenedStartState[freeCellId[firstCellPosition]] = firstCellValue;
    flattenedStartState[freeCellId[secondCellPosition]] = secondCellValue;

    let k = 0;
    const newState = this.startState.map((innerArray) => innerArray.slice());

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newState[i][j] = flattenedStartState[k];
        k++;
      }
    }

    this.setState(newState);
  }

  createNewCell(field) {
    const newCellValue = newCellValueGenerator();

    const state = field.map((innerArray) => innerArray.slice()).flat(1);
    const freeCellId = [];

    for (let i = 0; i < state.length; i++) {
      if (state[i] === 0) {
        freeCellId.push(i);
      }
    }

    if (freeCellId.length === 0) {
      return;
    }

    const newCellPosition = Math.round(Math.random() * (freeCellId.length - 1));

    state[freeCellId[newCellPosition]] = newCellValue;

    let k = 0;
    const newState = field.map((innerArray) => innerArray.slice());

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newState[i][j] = state[k];
        k++;
      }
    }

    this.setState(newState);
  }
}

const newCellValueGenerator = () => {
  const seed = Math.random() * 10;

  // probability to make cell with 2 is around 70%
  // probability to make cell with 4 is around 30%
  if (seed > 3) {
    return 2;
  } else {
    return 4;
  }
};

module.exports = Game;
