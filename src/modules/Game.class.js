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
    coordinates = [],
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.coordinates = coordinates;
    this.gameStatus = 'idle';
    this.score = 0;

    // eslint-disable-next-line no-console

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.coordinates.push([i, j]);
        // now we have all coordinates of every cell
        // of our board, it looks like: [0, 0], [0, 1]
        // on next line [1, 0], [1, 1], so on
      }
    }

    this.createEmptyArray = (copyState) => {
      for (let i = 0; i < 4; i++) {
        const row = [];

        for (let j = 0; j < 4; j++) {
          row.push(0);
        }

        copyState.push(row);
      }
    };

    // this.createEmptyArray(initialState);

    this.stateChanged = (initialSt, copyState) => {
      let isArrayChenged = false;

      for (let i = 0; i < initialSt.length; i++) {
        for (let j = 0; j < initialSt[i].length; j++) {
          if (copyState[i][j] !== initialSt[i][j]) {
            isArrayChenged = true;
          }
        }
      }

      return isArrayChenged;
    };

    this.fourInRow = (
      fourNumbers = [],
      copyState,
      state = this.initialState,
      i,
    ) => {
      for (let j = 0; j < state[i].length; j++) {
        // when the element bigger then 0 we add it to
        // our 'fourNumbers' and add it to the copyState therefore to
        // add it after click on the button keeping the rule

        if (state[j][i] > 0) {
          fourNumbers.push(state[j][i]);
          copyState[j][i] = state[j][i];
          state[j][i] = 0; // delete previous meaning
        }
      }
    };

    this.resultNumbers = (numbersResult, fourNumbers) => {
      for (let j = 0; j < fourNumbers.length; ) {
        if (
          fourNumbers[j] === fourNumbers[j + 1] &&
          fourNumbers[j + 1] === fourNumbers[j + 2]
        ) {
          // when we have three in a row the same numbers
          // at first we add a number twice as large as one of them
          // after that we add one of them
          numbersResult.push(fourNumbers[j] * 2);
          numbersResult.push(fourNumbers[j]);

          this.score += fourNumbers[j] * 2;

          j += 3;
        } else if (fourNumbers[j] === fourNumbers[j + 1]) {
          numbersResult.push(fourNumbers[j] * 2);
          // when we have two in a row the same numbers
          // we add a number twice as large as one of them

          this.score += fourNumbers[j] * 2;

          j += 2;

          continue;
        } else if (
          fourNumbers[0] === fourNumbers[0 + 1] &&
          fourNumbers[0 + 2] === fourNumbers[0 + 3]
        ) {
          // when we have four in a row the same numbers
          // we add two numbers twice as large as one of them
          // and delete all elements we get before
          numbersResult.length = 0;
          numbersResult.push(fourNumbers[1] * 2);
          numbersResult.push(fourNumbers[2] * 2);

          this.score += fourNumbers[j] * 2;
          this.score += fourNumbers[j] * 2;

          j += 2;
          continue;
        } else {
          numbersResult.push(fourNumbers[j]);
          // just add this number because we haven't the same
          j++;
        }
      }
    };

    this.resultNumbersRightDown = (numbersResult, fourNumbers) => {
      for (let j = 0; j < fourNumbers.length;) {
        if (
          fourNumbers[j] === fourNumbers[j + 1] &&
          fourNumbers[j + 1] === fourNumbers[j + 2]
        ) {
          // when we have three in a row the same numbers
          // at first we add a number twice as large as one of them
          // after that we add one of them
          numbersResult.push(fourNumbers[j]);
          numbersResult.push(fourNumbers[j] * 2);

          this.score += fourNumbers[j] * 2;

          j += 3;
        } else if (fourNumbers[j] === fourNumbers[j + 1]) {
          numbersResult.push(fourNumbers[j] * 2);
          // when we have two in a row the same numbers
          // we add a number twice as large as one of them

          this.score += fourNumbers[j] * 2;

          j += 2;

          continue;
        } else if (
          fourNumbers[0] === fourNumbers[0 + 1] &&
          fourNumbers[0 + 2] === fourNumbers[0 + 3]
        ) {
          // when we have four in a row the same numbers
          // we add two numbers twice as large as one of them
          // and delete all elements we get before
          numbersResult.length = 0;
          numbersResult.push(fourNumbers[1] * 2);
          numbersResult.push(fourNumbers[2] * 2);

          this.score += fourNumbers[j] * 2;
          this.score += fourNumbers[j] * 2;

          j += 2;
          continue;
        } else {
          numbersResult.push(fourNumbers[j]);
          // just add this number because we haven't the same
          j++;
        }
      }
    };

    this.leftCoordinates = (initialSt, copyCoords) => {
      for (let i = 0; i < initialSt.length; i++) {
        const coords = [];

        for (let j = 0; j < initialSt.length; j++) {
          let index = -1;

          if (initialSt[i][j] > 0) {
            coords[0] = i;
            coords[1] = j;

            index = copyCoords.findIndex((place) => {
              if (place[0] === coords[0] && place[1] === coords[1]) {
                return true;
              }
            });
          }

          if (index >= 0) {
            copyCoords.splice(index, 1);
          }
        }
      }
    };

    this.isGameOver = (state) => {
      const hasEmptyCells = state.some((row) => row.includes(0));
      const canMergeCells = state.some((row, rowIndex) => {
        return row.some((cell, cellIndex) => {
          if (cell === 0) {
            return false;
          }

          if (cellIndex < 3 && cell === row[cellIndex + 1]) {
            return true;
          }

          if (rowIndex < 3 && cell === state[rowIndex + 1][cellIndex]) {
            return true;
          }

          return false;
        });
      });

      return !hasEmptyCells && !canMergeCells;
    };

    this.statusWin = (inState) => {
      const win = inState.some((line) => {
        return line.some((number) => {
          if (number >= 2048) {
            return true;
          }
        });
      });

      return win;
    };

    // let youWin = false;
    // let gameOver = false;
  }

  moveLeft() {
    const {
      state,
      coordinates,
      resultNumbers,
      leftCoordinates,
      stateChanged,
      isGameOver,
      statusWin,
      // gameOver,
      // youWin,
    } = this;

    if (this.gameStatus === 'idle') {
      return;
    }

    const copyState = JSON.parse(JSON.stringify(state));
    const copyCoordinates = JSON.parse(JSON.stringify(coordinates));

    for (let i = 0; i < state.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] > 0) {
          numArr.push(state[i][j]);
          copyState[i][j] = state[i][j];
          // console.log(copyState[i][j]);
          state[i][j] = 0;
        }
      }

      resultNumbers(results, numArr);

      let indexResult = 0;

      if (results.length > 0) {
        indexResult = 0;

        for (let j = 0; j < results.length; j++) {
          state[i][j] = results[indexResult];
          copyState[i][j] = results[indexResult];
          indexResult++;

          if (indexResult < 0) {
            break;
          }
        }
      }
    }

    leftCoordinates(state, copyCoordinates);

    const isArrayChenged = stateChanged(state, copyState);

    function randomCoordinates() {
      const random = Math.random() * copyCoordinates.length;

      return Math.ceil(random) - 1;
    }

    if (isArrayChenged) {
      const firstCoordinate = randomCoordinates();

      state[copyCoordinates[firstCoordinate][0]][
        copyCoordinates[firstCoordinate][1]
      ] = Math.random() < 0.9 ? 2 : 4;
    }

    const gameOver = isGameOver(state);

    if (gameOver === true) {
      this.gameStatus = 'lose';
    }

    const win = statusWin(state);

    if (win) {
      this.gameStatus = 'win';
    }
  }
  moveRight() {
    if (this.gameStatus === 'idle') {
      return;
    }

    const {
      state,
      coordinates,
      resultNumbers,
      leftCoordinates,
      stateChanged,
      isGameOver,
      statusWin,
    } = this;
    const copyState = JSON.parse(JSON.stringify(state));
    const copyCoordinates = JSON.parse(JSON.stringify(coordinates));

    for (let i = 0; i < state.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] > 0) {
          numArr.push(state[i][j]);
          copyState[i][j] = state[i][j];
          state[i][j] = 0;
        }
      }

      this.resultNumbersRightDown(results, numArr);

      let indexResult = 0;

      if (results.length > 0) {
        indexResult = results.length - 1;

        for (let j = state.length - 1; j >= 0; j--) {
          state[i][j] = results[indexResult];
          copyState[i][j] = results[indexResult];
          indexResult--;

          if (indexResult < 0) {
            break;
          }
        }
      }
    }

    leftCoordinates(state, copyCoordinates);

    const isArrayChenged = stateChanged(state, copyState);

    function randomCoordinates() {
      const random = Math.random() * copyCoordinates.length;

      return Math.ceil(random) - 1;
    }

    if (isArrayChenged) {
      const firstCoordinate = randomCoordinates();

      state[copyCoordinates[firstCoordinate][0]][
        copyCoordinates[firstCoordinate][1]
      ] = Math.random() < 0.9 ? 2 : 4;
    }

    const gameOver = isGameOver(state);

    if (gameOver === true) {
      this.gameStatus = 'lose';
    }

    const win = statusWin(state);

    if (win) {
      this.gameStatus = 'win';
    }
  }
  moveUp() {
    if (this.gameStatus === 'idle') {
      return;
    }

    const {
      state,
      coordinates,
      resultNumbers,
      leftCoordinates,
      stateChanged,
      isGameOver,
      statusWin,
    } = this;
    const copyState = JSON.parse(JSON.stringify(state));
    const copyCoords = JSON.parse(JSON.stringify(coordinates));

    for (let i = 0; i < state.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < state[i].length; j++) {
        if (state[j][i] > 0) {
          numArr.push(state[j][i]);
          copyState[j][i] = state[j][i];

          state[j][i] = 0;
        }
      }

      resultNumbers(results, numArr);

      let indexResult = 0;

      if (results.length > 0) {
        indexResult = 0;

        for (let j = 0; j < results.length; j++) {
          state[j][i] = results[indexResult];
          indexResult++;

          if (indexResult === results.length) {
            break;
          }
        }
      }
    }

    leftCoordinates(state, copyCoords);

    const isArrayChenged = stateChanged(state, copyState);

    function randomCoordinates() {
      const random = Math.random() * copyCoords.length;

      return Math.ceil(random) - 1;
    }

    if (isArrayChenged) {
      const firstCoordinate = randomCoordinates();

      state[copyCoords[firstCoordinate][0]][copyCoords[firstCoordinate][1]] =
        Math.random() < 0.9 ? 2 : 4;
    }

    const gameOver = isGameOver(state);

    if (gameOver === true) {
      this.gameStatus = 'lose';
    }

    const win = statusWin(state);

    if (win) {
      this.gameStatus = 'win';
    }
  }

  moveDown() {
    if (this.gameStatus === 'idle') {
      return;
    }

    const {
      state,
      coordinates,
      resultNumbers,
      leftCoordinates,
      stateChanged,
      isGameOver,
      statusWin,
    } = this;
    const copyState = JSON.parse(JSON.stringify(state));
    const copyCoordinates = JSON.parse(JSON.stringify(coordinates));

    for (let i = 0; i < state.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < state[i].length; j++) {
        if (state[j][i] > 0) {
          numArr.push(state[j][i]);
          copyState[j][i] = state[j][i];

          state[j][i] = 0;
        }
      }

      this.resultNumbersRightDown(results, numArr);

      let indexResult = 0;

      if (results.length > 0) {
        indexResult = results.length - 1;

        console.log(results);
        console.log(results.length);

        // for (let j = 0; j < state.length; j++) {
        //   state[j][i] = results[j];
        // }

        for (let j = state.length - 1; j >= 0; j--) {
          state[j][i] = results[indexResult];

          console.log();

          indexResult--;

          if (indexResult < 0) {
            break;
          }
        }
      }
    }

    leftCoordinates(state, copyCoordinates);

    const isArrayChenged = stateChanged(state, copyState);

    function randomCoordinates() {
      const random = Math.random() * copyCoordinates.length;

      return Math.ceil(random) - 1;
    }

    if (isArrayChenged) {
      const firstCoordinate = randomCoordinates();

      state[copyCoordinates[firstCoordinate][0]][
        copyCoordinates[firstCoordinate][1]
      ] = Math.random() < 0.9 ? 2 : 4;
    }

    const gameOver = isGameOver(state);

    if (gameOver === true) {
      this.gameStatus = 'lose';
    }

    const win = statusWin(state);

    if (win) {
      this.gameStatus = 'win';
    }
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
    const { state } = this;

    return state;
  }

  /**
   * Returns the current game gameStatus.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    const { gameStatus } = this;

    console.log(gameStatus);

    return gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    const { state, coordinates, leftCoordinates } = this;

    const copyCoordinates = JSON.parse(JSON.stringify(coordinates));

    leftCoordinates(state, copyCoordinates);

    console.log(copyCoordinates);
    console.log(copyCoordinates.length);

    function randomCoordinates() {
      const random = Math.random() * copyCoordinates.length;

      console.log(Math.ceil(random) - 1);

      return Math.ceil(random) - 1;
    }

    const firstCoordinate = randomCoordinates();
    let secondCoordinate = randomCoordinates();

    while (firstCoordinate === secondCoordinate) {
      secondCoordinate = randomCoordinates();
    }

    console.log(copyCoordinates[firstCoordinate][0]);
    console.log(copyCoordinates[firstCoordinate][1]);

    state[copyCoordinates[firstCoordinate][0]][
      copyCoordinates[firstCoordinate][1]
    ] = Math.random() < 0.9 ? 2 : 4;

    state[copyCoordinates[secondCoordinate][0]][
      copyCoordinates[secondCoordinate][1]
    ] = Math.random() < 0.9 ? 2 : 4;

    this.gameStatus = 'playing';

    // return initialState;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);

    this.score = 0;

    this.gameStatus = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
