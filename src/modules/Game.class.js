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
  initialState = [
    Array.from({ length: 4 }, (el) => ''),
    Array.from({ length: 4 }, (el) => ''),
    Array.from({ length: 4 }, (el) => ''),
    Array.from({ length: 4 }, (el) => ''),
  ];
  score = 0;
  status = 'idle';
  constructor(scoreContainer, container, currentState = this.initialState) {
    this.currentState = JSON.parse(JSON.stringify(currentState));
    this.tBodyEl = container.querySelector('tbody');
    this.scoreContainer = scoreContainer;
    this.messages = container.querySelectorAll('.message');
  }

  moveLeft() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft') {
        return;
      }

      if (this.status === 'win') {
        return;
      }

      if (this.checkLose()) {
        this.youLose();

        return;
      }

      const copyState = JSON.parse(JSON.stringify(this.currentState));
      let isDifferent = false;

      copyState.forEach((row, ind) => {
        // const modifyArr = row.filter((el) => el !== '');
        // const sumArr = [];
        // let isSame = false;

        // for (let i = 0; i < modifyArr.length; i++) {
        //   if (isSame) {
        //     isSame = false;
        //     continue;
        //   }

        //   if (modifyArr[i] === modifyArr[i + 1]) {
        //     isSame = true;
        //     sumArr.push(+modifyArr[i] * 2);
        //   } else {
        //     sumArr.push(+modifyArr[i]);
        //   }
        // }

        // const alignLeft = [...sumArr, ...Array(4 - sumArr.length).fill('')];

        const alignLeft = this.moveLeftUp(row);

        if (!isDifferent) {
          alignLeft.forEach((el, index) => {
            if (el !== row[index]) {
              isDifferent = true;
            }
          });
        }

        copyState[ind] = alignLeft;
      });

      if (isDifferent) {
        const cellCoordOne = this.getRandomCell(copyState);
        const [rowOne, columnOne] = cellCoordOne;

        copyState[rowOne][columnOne] = this.getRandomNumber();

        this.currentState = copyState;
        this.updateTable();
      }
    });
  }
  moveRight() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight') {
        return;
      }

      if (this.status === 'win') {
        return;
      }

      if (this.checkLose()) {
        this.youLose();

        return;
      }

      const copyState = JSON.parse(JSON.stringify(this.currentState));
      let isDifferent = false;

      copyState.forEach((row, ind) => {
        // const modifyArr = row.filter((el) => el !== '');
        // const sumArr = [];
        // let isSame = false;

        // for (let i = modifyArr.length - 1; i >= 0; i--) {
        //   if (isSame) {
        //     isSame = false;
        //     continue;
        //   }

        //   if (modifyArr[i] === modifyArr[i - 1]) {
        //     isSame = true;
        //     sumArr.unshift(+modifyArr[i] * 2);
        //   } else {
        //     sumArr.unshift(+modifyArr[i]);
        //   }
        // }

        // const alignLeft = [...Array(4 - sumArr.length).fill(''), ...sumArr];

        const alignLeft = this.moveRightDown(row);

        if (!isDifferent) {
          alignLeft.forEach((el, index) => {
            if (el !== row[index]) {
              isDifferent = true;
            }
          });
        }

        copyState[ind] = alignLeft;
      });

      if (isDifferent) {
        const cellCoordOne = this.getRandomCell(copyState);
        const [rowOne, columnOne] = cellCoordOne;

        copyState[rowOne][columnOne] = this.getRandomNumber();

        this.currentState = copyState;
        this.updateTable();
      }
    });
  }
  moveUp() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowUp') {
        return;
      }

      if (this.status === 'win') {
        return;
      }

      if (this.checkLose()) {
        this.youLose();

        return;
      }

      const copyState = JSON.parse(JSON.stringify(this.currentState));
      let isDifferent = false;

      for (let i = 0; i < copyState.length; i++) {
        const column = [];

        copyState.forEach((row) => {
          column.push(row[i]);
        });

        const afterMove = this.moveLeftUp(column);

        afterMove.forEach((el, ind) => {
          copyState[ind][i] = el;
        });

        if (!isDifferent) {
          afterMove.forEach((el, index) => {
            if (el !== column[index]) {
              isDifferent = true;
            }
          });
        }
      }

      if (isDifferent) {
        const cellCoordOne = this.getRandomCell(copyState);
        const [rowOne, columnOne] = cellCoordOne;

        copyState[rowOne][columnOne] = this.getRandomNumber();

        this.currentState = copyState;
        this.updateTable();
      }
    });
  }
  moveDown() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown') {
        return;
      }

      if (this.status === 'win') {
        return;
      }

      if (this.checkLose()) {
        this.youLose();

        return;
      }

      const copyState = JSON.parse(JSON.stringify(this.currentState));
      let isDifferent = false;

      for (let i = 0; i < copyState.length; i++) {
        const column = [];

        copyState.forEach((row) => {
          column.push(row[i]);
        });

        const afterMove = this.moveRightDown(column);

        afterMove.forEach((el, ind) => {
          copyState[ind][i] = el;
        });

        if (!isDifferent) {
          afterMove.forEach((el, index) => {
            if (el !== column[index]) {
              isDifferent = true;
            }
          });
        }
      }

      if (isDifferent) {
        const cellCoordOne = this.getRandomCell(copyState);
        const [rowOne, columnOne] = cellCoordOne;

        copyState[rowOne][columnOne] = this.getRandomNumber();

        this.currentState = copyState;
        this.updateTable();
      }
    });
  }

  moveRightDown(arr) {
    const newArr = arr.filter((el) => el !== '');

    const sumArr = [];
    let isSame = false;

    for (let i = newArr.length - 1; i >= 0; i--) {
      if (isSame) {
        isSame = false;
        continue;
      }

      if (newArr[i] === newArr[i - 1]) {
        isSame = true;
        sumArr.unshift(+newArr[i] * 2);
        this.score += +newArr[i] * 2;
        this.updateScore(this.scoreContainer);
      } else {
        sumArr.unshift(+newArr[i]);
      }
    }

    const result = [...Array(4 - sumArr.length).fill(''), ...sumArr];

    return result;
  }

  moveLeftUp(arr) {
    const modifyArr = arr.filter((el) => el !== '');
    const sumArr = [];
    let isSame = false;

    for (let i = 0; i < modifyArr.length; i++) {
      if (isSame) {
        isSame = false;
        continue;
      }

      if (modifyArr[i] === modifyArr[i + 1]) {
        isSame = true;
        sumArr.push(+modifyArr[i] * 2);
        this.score += +modifyArr[i] * 2;
        this.updateScore(this.scoreContainer);
      } else {
        sumArr.push(+modifyArr[i]);
      }
    }

    const result = [...sumArr, ...Array(4 - sumArr.length).fill('')];

    return result;
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
    return this.currentState;
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

  set statusGame(value) {
    this.status = value;
  }

  get statusGame() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    const copyState = JSON.parse(JSON.stringify(this.currentState));
    const cellCoordOne = this.getRandomCell(copyState);
    const [rowOne, columnOne] = cellCoordOne;

    copyState[rowOne][columnOne] = this.getRandomNumber();

    const cellCoordTwo = this.getRandomCell(copyState);
    const [rowTwo, columnTwo] = cellCoordTwo;

    copyState[rowTwo][columnTwo] = this.getRandomNumber();
    this.currentState = JSON.parse(JSON.stringify(copyState));

    this.updateTable();
    this.moveLeft();
    this.moveRight();
    this.moveDown();
    this.moveUp();
    this.status = `playing`;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.currentState = this.initialState;
    this.updateTable();
    this.score = 0;
  }

  getRandomNumber() {
    const randomNum = Math.random();
    const num = randomNum < 0.1 ? 4 : 2;

    return num;
  }

  updateTable() {
    const rowsCollection = this.tBodyEl.querySelectorAll('tr');

    rowsCollection.forEach((row, ind) => {
      const tdCollection = row.querySelectorAll('td');

      tdCollection.forEach((td, i) => {
        const num = this.currentState[ind][i];
        const className = td.className
          .split(' ')
          .find((el) => el.includes('field-cell--'));

        td.classList.remove(className);
        td.textContent = num;

        if (num) {
          td.classList.add(`field-cell--${num}`);
        }
      });
    });
  }

  updateScore() {
    this.scoreContainer.textContent = this.score;
  }

  // повертає маcив координат нової клітинки
  getRandomCell(state) {
    let isAvailable = false;

    state.forEach((row, i) => {
      const control = row.includes('');

      if (control) {
        isAvailable = true;
      }
    });

    if (isAvailable) {
      while (true) {
        const row = Math.trunc(Math.random() * 4);
        const col = Math.trunc(Math.random() * 4);

        if (state[row][col] === '') {
          return [row, col];
        }
      }
    }
  }

  checkLose() {
    const copyState = JSON.parse(JSON.stringify(this.currentState));

    function horizontal() {
      for (let i = 0; i < copyState.length; i++) {
        if (copyState[i].includes('')) {
          return false;
        }

        for (let j = 0; j < copyState.length - 1; j++) {
          if (copyState[i][j] === copyState[i][j + 1]) {
            return false;
          }
        }
      }

      return true;
    }

    if (!horizontal()) {
      return false;
    }

    for (let i = 0; i < copyState.length; i++) {
      const arr = [
        copyState[0][i],
        copyState[1][i],
        copyState[2][i],
        copyState[3][i],
      ];

      for (let j = 0; j < arr.length - 1; j++) {
        if (arr[j] === arr[j + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  youLose() {
    this.status = 'lose';

    this.messages.forEach((message) => {
      if (message.classList.contains('message-lose')) {
        message.classList.remove('hidden');
      }
    });
  }
}

module.exports = Game;
