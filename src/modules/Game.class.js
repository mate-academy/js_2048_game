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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    this.state = initialState;
    this.counterforFieldCell = 0;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft(diraction) {
    this.move(diraction);
    this.fieldCell();
  }
  moveRight(diraction) {
    this.move(diraction);
    this.fieldCell();
  }
  moveUp(diraction) {
    this.moveUD(diraction);
    this.fieldCell();
  }
  moveDown(diraction) {
    this.moveUD(diraction);
    this.fieldCell();
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
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
    let counterFullCell = 0;

    for (const row of this.state) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';
        } else if (cell > 0) {
          counterFullCell++;
        }
      }

      if (counterFullCell === 16) {
        const copyState = structuredClone(this.state);

        this.move('ArrowLeft', copyState, true);
        this.move('ArrowRight', copyState, true);
        this.rebuildState('ArrowUp', copyState, true);
        this.rebuildState('ArrowUpDown', copyState, true);

        if (this.counterforFieldCell === 0) {
          this.status = 'lose';
        }
      }
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.counterforFieldCell++;
    this.status = 'playing';
    this.fieldCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.counterforFieldCell++;
    this.score = 0;
    this.start();
  }

  getRandomNumb(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  move(keyDiraction, state = this.state, loseTest) {
    for (const row of state) {
      let startIndexContNumb = 0;
      let startIndexCont = 0;
      let diraction = 0;
      let endIndexContNumb = 0;
      let endIndexCont = 0;

      if (keyDiraction === 'ArrowLeft' || keyDiraction === 'ArrowUp') {
        startIndexContNumb = 0;
        startIndexCont = 0;
        diraction = 1;
        endIndexContNumb = row.length - 1;
        endIndexCont = row.length;
      } else {
        startIndexContNumb = row.length - 1;
        startIndexCont = row.length - 1;
        diraction = -1;
        endIndexCont = 0;
        endIndexContNumb = 0;
      }
      this.changePosition(startIndexCont, endIndexCont, row, diraction);

      for (
        let i = startIndexContNumb;
        this.condition(i, endIndexContNumb, diraction);
        i += diraction
      ) {
        this.sum(i, row, diraction, loseTest);
      }

      this.changePosition(startIndexCont, endIndexCont, row, diraction);
    }

    if (loseTest) {
    }
  }

  moveUD(keyDiraction) {
    this.rebuildState(keyDiraction);
  }

  rebuildState(diraction, state = this.state, loseTest) {
    const container = [];
    const rebuildRow = [];

    for (let i = 0; i < state.length; i++) {
      rebuildRow.push(state[0][i]);
      rebuildRow.push(state[1][i]);
      rebuildRow.push(state[2][i]);
      rebuildRow.push(state[3][i]);
      container.push([...rebuildRow]);
      rebuildRow.length = 0;
    }

    this.move(diraction, container, loseTest);

    for (let i = 0; i < container.length; i++) {
      state[0][i] = container[i][0];
      state[1][i] = container[i][1];
      state[2][i] = container[i][2];
      state[3][i] = container[i][3];
    }
  }

  condition(i, end, diraction, move) {
    if (diraction === 1) {
      return i < end;
    } else if (move) {
      return i >= end;
    }

    return i > end;
  }

  sum(indContTxt, row, diraction, loseTest) {
    if (row[indContTxt] === row[indContTxt + diraction]) {
      row[indContTxt] = row[indContTxt] + row[indContTxt + diraction];
      row[indContTxt + diraction] = 0;

      if (row[indContTxt] !== 0) {
        this.counterforFieldCell++;
      }

      if (!loseTest) {
        this.score += row[indContTxt];
      }
    }
  }

  changePosition(startIndexCont, endIndexCont, row, diraction) {
    for (
      let i = startIndexCont - diraction;
      this.condition(i, endIndexCont, diraction, true);
      i += diraction
    ) {
      for (
        let el = startIndexCont;
        this.condition(el, i, diraction);
        el += diraction
      ) {
        if (row[i] > 0 && row[el] === 0) {
          row[el] = row[i];
          row[i] = 0;

          this.counterforFieldCell++;
        }
      }
    }
  }

  fieldCell() {
    if (this.counterforFieldCell > 0) {
      const freeCellIndex = [];
      let twoOrFour = 2;

      if (this.getRandomNumb(1, 10) === 1) {
        twoOrFour = 4;
      }

      for (let row = 0; row < this.state.length; row++) {
        for (let cell = 0; cell < this.state[row].length; cell++) {
          if (this.state[row][cell] === 0) {
            freeCellIndex.push([row, cell]);
          }
        }
      }

      if (freeCellIndex.length !== 0) {
        const randomNumbOne = this.getRandomNumb(0, freeCellIndex.length - 1);

        this.state[freeCellIndex[randomNumbOne][0]][
          freeCellIndex[randomNumbOne][1]
        ] = twoOrFour;
      }

      if (freeCellIndex.length === 16) {
        this.fieldCell();
      }
    }
    this.counterforFieldCell = 0;
  }
  // Add your own methods here
}

module.exports = Game;
