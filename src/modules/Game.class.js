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

  constructor(initialState = [], coordinates = []) {
    this.initialState = initialState;
    this.coordinates = coordinates;

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

    this.createEmptyArray(initialState);

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
          // when we have tree in a row the same numbers
          // at first we add a number twice as large as one of them
          // after that we add one of them
          numbersResult.push(fourNumbers[j] * 2);
          numbersResult.push(fourNumbers[j]);
          j += 3;
        } else if (fourNumbers[j] === fourNumbers[j + 1]) {
          numbersResult.push(fourNumbers[j] * 2);
          // when we have two in a row the same numbers
          // we add a number twice as large as one of them
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

    console.log(this);
  }

  moveLeft() {
    const { initialState, coordinates } = this;
    const copyState = [];

    for (let i = 0; i < 4; i++) {
      let row = [];

      for (let j = 0; j < 4; j++) {
        row.push(0);
      }

      copyState.push(row);
    }

    for (let i = 0; i < initialState.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < initialState[i].length; j++) {
        console.log(initialState[i]);
        numArr.push(initialState[i][j]);
        copyState[i][j] = initialState[i][j];
        // console.log(copyState[i][j]);
        initialState[i][j] = 0;
      }

      // console.log(copyState);
      console.log(numArr);

      const newArr = [];

      numArr.forEach((el) => {
        if (el !== 0) {
          newArr.push(el);
        }
      });

      for (let j = 0; j < newArr.length;) {
        if (newArr[j] === newArr[j + 1] && newArr[j + 1] === newArr[j + 2]) {
          results.push(newArr[j]);
          results.push(newArr[j] * 2);
          j += 3;
        } else if (newArr[j] === newArr[j + 1]) {
          results.push(newArr[j] * 2);
          j += 2;
          continue;
        } else if (
          newArr[0] === newArr[0 + 1] &&
          newArr[0 + 2] === newArr[0 + 3]
        ) {
          results.length = 0;
          results.push(newArr[1] * 2);
          results.push(newArr[2] * 2);
          j += 2;
          continue;
        } else {
          results.push(newArr[j]);
          j++;
        }
      }

      let indexResult = 0;
      console.log(results);

      if (results.length > 0) {
        console.log(results);
        indexResult = 0;

        for (let j = 0; j < results.length; j++) {
          initialState[i][j] = results[indexResult];
          copyState[i][j] = results[indexResult];
          indexResult++;

          if (indexResult < 0) {
            break;
          }
        }
      }
    }

    console.log(copyState);
    console.log(initialState);
  }
  moveRight() {
    const { initialState, coordinates } = this;
    const copyState = [];

    for (let i = 0; i < 4; i++) {
      let row = [];

      for (let j = 0; j < 4; j++) {
        row.push(0);
      }

      copyState.push(row);
    }

    for (let i = 0; i < initialState.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < initialState[i].length; j++) {
        console.log(initialState[i]);
        numArr.push(initialState[i][j]);
        copyState[i][j] = initialState[i][j];
        // console.log(copyState[i][j]);
        initialState[i][j] = 0;
      }

      // console.log(copyState);
      console.log(numArr);

      const newArr = [];

      numArr.forEach((el) => {
        if (el !== 0) {
          newArr.push(el);
        }
      });

      for (let j = 0; j < newArr.length;) {
        if (newArr[j] === newArr[j + 1] && newArr[j + 1] === newArr[j + 2]) {
          results.push(newArr[j]);
          results.push(newArr[j] * 2);
          j += 3;
        } else if (newArr[j] === newArr[j + 1]) {
          results.push(newArr[j] * 2);
          j += 2;
          continue;
        } else if (
          newArr[0] === newArr[0 + 1] &&
          newArr[0 + 2] === newArr[0 + 3]
        ) {
          results.length = 0;
          results.push(newArr[1] * 2);
          results.push(newArr[2] * 2);
          j += 2;
          continue;
        } else {
          results.push(newArr[j]);
          j++;
        }
      }

      let indexResult = 0;
      console.log(results);

      if (results.length > 0) {
        console.log(results);
        indexResult = results.length - 1;

        for (let j = initialState.length - 1; j >= 0; j--) {
          initialState[i][j] = results[indexResult];
          copyState[i][j] = results[indexResult];
          indexResult--;

          if (indexResult < 0) {
            break;
          }
        }
      }
    }

    console.log(copyState);
    console.log(initialState);
  }
  moveUp() {
    const { initialState, coordinates, resultNumbers } = this;
    const copyState = JSON.parse(JSON.stringify(initialState));
    const copyCoords = coordinates.map((el) => el);

    for (let i = 0; i < initialState.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < initialState[i].length; j++) {
        if (initialState[j][i] > 0) {
          numArr.push(initialState[j][i]);
          copyState[j][i] = initialState[j][i];

          initialState[j][i] = 0;
        }
      }

      resultNumbers(results, numArr);

      let indexResult = 0;

      if (results.length > 0) {
        indexResult = 0;

        console.log(results);

        for (let j = 0; j < results.length; j++) {
          initialState[j][i] = results[indexResult];
          indexResult++;

          if (indexResult === results.length) {
            break;
          }
        }
      }
    }

    console.log(initialState);
    console.log(coordinates);

    for (let i = 0; i < initialState.length; i++) {
      const coords = [];

      for (let j = 0; j < initialState.length; j++) {
        let index = -1;

        if (initialState[i][j] > 0) {
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

    console.log(copyCoords);
    console.log(coordinates);

    let isArrayChenged = false;

    for (let i = 0; i < initialState.length; i++) {
      for (let j = 0; j < initialState[i].length; j++) {
        if (copyState[i][j] !== initialState[i][j]) {
          isArrayChenged = true;
        }
      }
    }

    // function randomCoordinates() {
    //   const random = Math.random() * coordinates.length;

    //   return Math.ceil(random) - 1;
    // }

    function randomCoordinates() {
      const random = Math.random() * copyCoords.length;

      return Math.ceil(random) - 1;
    }

    if (isArrayChenged) {
      const firstCoordinate = randomCoordinates();

      initialState[copyCoords[firstCoordinate][0]][
        copyCoords[firstCoordinate][1]
      ] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveDown() {
    const { initialState, coordinates, resultNumbers } = this;
    const copyState = JSON.parse(JSON.stringify(initialState));
    const copyCoordinates = JSON.parse(JSON.stringify(coordinates));

    console.log(copyState);
    console.log(initialState);

    for (let i = 0; i < initialState.length; i++) {
      const numArr = [];
      const results = [];

      for (let j = 0; j < initialState[i].length; j++) {
        if (initialState[j][i] > 0) {
          numArr.push(initialState[j][i]);
          copyState[j][i] = initialState[j][i];

          initialState[j][i] = 0;
        }
      }

      resultNumbers(results, numArr);

      console.log(numArr);
      console.log(results);

      let indexResult = 0;

      if (results.length > 0) {
        console.log(results);
        indexResult = results.length - 1;

        for (let j = initialState.length - 1; j >= 0; j--) {
          initialState[j][i] = results[indexResult];
          indexResult--;

          if (indexResult < 0) {
            break;
          }
        }
      }
    }

    console.log(initialState);
    console.log(copyState);

    const arrLength = copyState.length * copyState.length;
    let copyLength = 0;
    const bigNumber = [];

    // for (let i = 0; i < initialState.length; i++) {
    //   for (let j = 0; j < initialState.length; j++) {
    //     if (initialState[i][j] === copyState[i][j]) {
    //       // console.log(initialState[i][j]);
    //       // console.log(copyState[i][j]);
    //       copyLength++;
    //     }

    //     if (copyState[i][j] > 0) {
    //       bigNumber.push(copyState[i][j]);
    //     }
    //   }
    // }
    console.log((bigNumber));
    console.log((copyLength));
    console.log((arrLength));

    // if (copyLength === arrLength) {
    //   console.log(';;;;;;;;;;;;;');
    // } else {
    //   console.log(('-------------------'));
    //   return;
    // }

    for (let i = 0; i < initialState.length; i++) {
      const coords = [];

      for (let j = 0; j < initialState.length; j++) {
        let index = -1;

        if (initialState[i][j] > 0) {
          coords[0] = i;
          coords[1] = j;

          index = copyCoordinates.findIndex((place) => {
            if (place[0] === coords[0] && place[1] === coords[1]) {
              return true;
            }
          });
        }

        if (index >= 0) {
          copyCoordinates.splice(index, 1);
        }
      }
    }

    let isArrayChenged = false;

    for (let i = 0; i < initialState.length; i++) {
      for (let j = 0; j < initialState[i].length; j++) {
        if (copyState[i][j] !== initialState[i][j]) {
          isArrayChenged = true;
        }
      }
    }

    function randomCoordinates() {
      const random = Math.random() * copyCoordinates.length;

      return Math.ceil(random) - 1;
    }

    if (isArrayChenged) {
      const firstCoordinate = randomCoordinates();

      initialState[copyCoordinates[firstCoordinate][0]][
        copyCoordinates[firstCoordinate][1]
      ] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    const { initialState } = this;

    let maxScore = 0;

    for (let i = 0; i < initialState.length; i++) {
      for (let j = 0; j < initialState[i].length; j++) {
        if (maxScore < initialState[i][j]) {
          maxScore = initialState[i][j];
        }
      }
    }

    return maxScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const { initialState } = this;

    return initialState;
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
  getStatus() { }

  /**
   * Starts the game.
   */
  start() {
    const { initialState, coordinates } = this;

    // const copyCoords = coordinates.map((coord) => (coord));

    function randomCoordinates() {
      const random = Math.random() * coordinates.length;
      return Math.ceil(random) - 1;
    }

    const firstCoordinate = randomCoordinates();
    let secondCoordinate = randomCoordinates();

    while (firstCoordinate === secondCoordinate) {
      secondCoordinate = randomCoordinates();
    }

    initialState[coordinates[firstCoordinate][0]][
      coordinates[firstCoordinate][1]
    ] = Math.random() < 0.9 ? 2 : 4;

    initialState[coordinates[secondCoordinate][0]][
      coordinates[secondCoordinate][1]
    ] = Math.random() < 0.9 ? 2 : 4;
    console.log(initialState);
  }

  /**
   * Resets the game.
   */
  restart() {
    const { initialState } = this;

    for (let i = 0; i < initialState.length; i++) {
      initialState[i] = [0, 0, 0, 0];
    }

    // console.log(initialState);

    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
