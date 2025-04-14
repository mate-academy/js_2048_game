'use strict';

class Game {
  emptyCells = [];
  score = 0;
  gameStatus = 'idle';

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.INITIAL_STATE = initialState;
    this.state = JSON.parse(JSON.stringify(this.INITIAL_STATE));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.setEmptyCells();
    this.addNumber();
    this.addNumber();

    this.gameStatus = 'playing';
  }

  restart() {
    this.score = 0;
    this.emptyCells = [];
    this.state = JSON.parse(JSON.stringify(this.INITIAL_STATE));
    this.gameStatus = 'idle';
  }

  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moveWasMade = false;

    const newState = this.state.map((line) => {
      const newLine = this.mergeLine(line);

      if (newLine !== line) {
        moveWasMade = true;
      }

      return newLine;
    });

    if (moveWasMade) {
      this.endMove(newState);
    }
  }

  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moveWasMade = false;

    const newState = this.state.map((line) => {
      const reversedLine = [...line].reverse();
      const newLine = this.mergeLine(reversedLine);

      if (newLine !== reversedLine) {
        moveWasMade = true;
      }

      return newLine.reverse();
    });

    if (moveWasMade) {
      this.endMove(newState);
    }
  }

  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moveWasMade = false;

    const rotatedState = this.rotateMatrixCounterclockwise(this.state);

    const newState = rotatedState.map((line) => {
      const newLine = this.mergeLine(line);

      if (newLine !== line) {
        moveWasMade = true;
      }

      return newLine;
    });

    if (moveWasMade) {
      this.endMove(this.rotateMatrixClockwise(newState));
    }
  }

  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moveWasMade = false;

    const rotatedState = this.rotateMatrixClockwise(this.state);

    const newState = rotatedState.map((line) => {
      const newLine = this.mergeLine(line);

      if (newLine !== line) {
        moveWasMade = true;
      }

      return newLine;
    });

    if (moveWasMade) {
      this.endMove(this.rotateMatrixCounterclockwise(newState));
    }
  }

  endMove(newState) {
    this.state = newState;

    this.setEmptyCells();
    this.addNumber();

    if (this.emptyCells.length === 0) {
      this.checkIfGameOver();
    }
  }

  mergeLine(line) {
    const noZeroesLine = line.filter((cell) => cell !== 0);
    let scoreToAdd = 0;
    const mergedLine = noZeroesLine.reduce((acc, cell) => {
      if (cell === acc[acc.length - 1]) {
        const mergedCell = cell * 2;

        acc.splice(acc.length - 1, 1, mergedCell, 0);
        scoreToAdd += mergedCell;

        if (mergedCell === 2048) {
          this.gameStatus = 'win';
        }

        return acc;
      }

      return [...acc, cell];
    }, []);

    const mergedNoZeroesLine = mergedLine.filter((cell) => cell !== 0);
    const zeroes = new Array(line.length - mergedNoZeroesLine.length).fill(0);
    const newLine = [...mergedNoZeroesLine, ...zeroes];

    if (scoreToAdd > 0) {
      this.score += scoreToAdd;

      return newLine;
    }

    if (newLine.toString() === line.toString()) {
      return line;
    }

    return newLine;
  }

  setEmptyCells() {
    const updatedEmptyCells = [];

    this.state.forEach((line, lineIndex) => {
      line.forEach((cell, cellIndex) => {
        if (cell === 0) {
          updatedEmptyCells.push([lineIndex, cellIndex]);
        }
      });
    });

    this.emptyCells = updatedEmptyCells;
  }

  addNumber() {
    const emptyCellCount = this.emptyCells.length;

    if (emptyCellCount === 0) {
      return;
    }

    const indexOfEmptyCell = Math.floor(Math.random() * emptyCellCount);
    const numberToAdd = Math.floor(Math.random() * 10) ? 2 : 4;

    const stateLineIndex = this.emptyCells[indexOfEmptyCell][0];
    const stateRowIndex = this.emptyCells[indexOfEmptyCell][1];

    this.state[stateLineIndex][stateRowIndex] = numberToAdd;

    this.emptyCells.splice(indexOfEmptyCell, 1);
  }

  checkIfGameOver() {
    const currentState = this.state;

    for (let rowIndex = 0; rowIndex < currentState.length; rowIndex += 2) {
      const row = currentState[rowIndex];

      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        if (
          currentState[rowIndex][columnIndex] ===
          currentState[rowIndex + 1][columnIndex]
        ) {
          return;
        }
      }
    }

    for (let rowIndex = 0; rowIndex < currentState.length; rowIndex++) {
      const row = currentState[rowIndex];

      for (let columnIndex = 0; columnIndex < row.length; columnIndex += 2) {
        if (
          currentState[rowIndex][columnIndex] ===
          currentState[rowIndex][columnIndex + 1]
        ) {
          return;
        }
      }
    }

    this.gameStatus = 'lose';
  }

  rotateMatrixClockwise(matrix) {
    const rotatedMatrix = matrix.map(() => []);

    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        rotatedMatrix[cellIndex][matrix.length - rowIndex - 1] = cell;
      });
    });

    return rotatedMatrix;
  }

  rotateMatrixCounterclockwise(matrix) {
    const rotatedMatrix = matrix.map(() => []);

    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        rotatedMatrix[matrix.length - cellIndex - 1][rowIndex] = cell;
      });
    });

    return rotatedMatrix;
  }
}

module.exports = Game;
