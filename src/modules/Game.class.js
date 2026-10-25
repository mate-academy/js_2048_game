'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState;
    this.score = 0;
    this.gameStatus = 'idle';
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    if (this.gameStatus === 'idle') {
      return 'idle';
    }

    if (this.checkWin()) {
      return 'win';
    }

    if (!this.checkGameStatus()) {
      return 'lose';
    }

    return 'playing';
  }

  generateTwoNumbers(coordinateOfEmptyCells) {
    const numberOfEmptyCells = coordinateOfEmptyCells.length;
    const uniqueNumbers = new Set([]);

    while (uniqueNumbers.size < 2) {
      uniqueNumbers.add(Math.floor(Math.random() * numberOfEmptyCells));
    }

    return [...uniqueNumbers];
  }

  start() {
    this.gameStatus = 'playing';

    const coordinateOfEmptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (value === 0) {
          coordinateOfEmptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    const indicies = this.generateTwoNumbers(coordinateOfEmptyCells);

    const [row1, col1] = coordinateOfEmptyCells[indicies[0]];

    this.state[row1][col1] = 2;

    const [row2, col2] = coordinateOfEmptyCells[indicies[1]];

    this.state[row2][col2] = 2;
  }

  createNewRows() {
    const allRows = [];

    for (let i = 0; i <= 3; i++) {
      const newRow = [];

      for (let j = 0; j <= 3; j++) {
        newRow.push(this.state[j][i]);
      }

      allRows.push(newRow);
    }

    return allRows;
  }

  spawnRandomTile() {
    const coordinateOfEmptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (value === 0) {
          coordinateOfEmptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    if (coordinateOfEmptyCells.length === 0) {
      return;
    }

    const randomNumber = Math.floor(
      Math.random() * coordinateOfEmptyCells.length,
    );
    const chance = Math.random() < 0.1;

    const [row1, col1] = coordinateOfEmptyCells[randomNumber];

    if (chance === true) {
      this.state[row1][col1] = 4;
    } else {
      this.state[row1][col1] = 2;
    }
  }

  movedLeft() {
    return (this.state = this.state.map((row) => {
      const leftResult = [];
      const something = row.filter((item) => item > 0);

      for (let i = 0; i < something.length; i++) {
        if (something[i] === something[i + 1]) {
          leftResult.push(something[i] * 2);
          this.score += something[i] * 2;
          i++;
        } else {
          leftResult.push(something[i]);
        }
      }

      while (leftResult.length < 4) {
        leftResult.push(0);
      }

      return leftResult;
    }));
  }

  movedRight() {
    return (this.state = this.state.map((row) => {
      const rightResult = [];
      const something = [...row].reverse().filter((item) => item > 0);

      for (let i = 0; i < something.length; i++) {
        if (something[i] === something[i + 1]) {
          rightResult.push(something[i] * 2);
          this.score += something[i] * 2;
          i++;
        } else {
          rightResult.push(something[i]);
        }
      }

      while (rightResult.length < 4) {
        rightResult.push(0);
      }

      return rightResult.reverse();
    }));
  }

  moveSomeSide(side) {
    const copyOfState = this.state.flat().join('');

    switch (side) {
      case 'left':
        this.movedLeft();
        break;

      case 'right':
        this.movedRight();
        break;

      case 'up':
        this.state = this.createNewRows();
        this.movedLeft();
        this.state = this.createNewRows();
        break;

      case 'down':
        this.state = this.createNewRows();
        this.movedRight();
        this.state = this.createNewRows();
        break;
    }

    const copyOfStateAfterMove = this.state.flat().join('');

    if (copyOfState === copyOfStateAfterMove) {
      return false;
    }

    this.spawnRandomTile();

    return true;
  }

  moveLeft() {
    return this.moveSomeSide('left');
  }

  moveRight() {
    return this.moveSomeSide('right');
  }

  moveDown() {
    return this.moveSomeSide('down');
  }

  moveUp() {
    return this.moveSomeSide('up');
  }

  restart() {
    this.score = 0;
    this.gameStatus = 'playing';

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.start();
  }

  checkGameStatus() {
    const temporaryCopyOfOurState = this.state;
    const onlyZeroPointValue = [];

    temporaryCopyOfOurState.forEach((row) => {
      row.forEach((value) => {
        if (value === 0) {
          onlyZeroPointValue.push(value);
        }
      });
    });

    const newVerticallyRows = this.createNewRows(temporaryCopyOfOurState);

    function checklNeighbours(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
          if (arr[i][j] === arr[i][j + 1]) {
            return true;
          }
        }
      }

      return false;
    }

    const horizontallyCheck = checklNeighbours(temporaryCopyOfOurState);
    const verticallyCheck = checklNeighbours(newVerticallyRows);

    return (
      onlyZeroPointValue.length > 0 || horizontallyCheck || verticallyCheck
    );
  }

  checkWin() {
    const ourState = this.state;
    const findWinCombination = ourState.flat().some((value) => value === 2048);

    return findWinCombination;
  }
}

module.exports = Game;
