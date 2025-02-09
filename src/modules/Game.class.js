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
  }

  moveRight() {
    this.moveHorizontally('right');
  }

  moveLeft() {
    this.moveHorizontally('left');
  }

  moveUp() {
    this.moveVertically('up');
  }

  moveDown() {
    this.moveVertically('down');
  }

  /**
   * @returns {number}
   */
  getScore(num) {
    const score = document.querySelector('.game-score');
    const currentScore = parseInt(score.innerHTML) || 0;

    score.innerHTML = currentScore + num;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.rows;
    const table = [];

    for (let i = 0; i < rows.length; i++) {
      table[i] = [];

      for (let j = 0; j < rows[i].cells.length; j++) {
        const cell = rows[i].cells[j];

        table[i].push(parseInt(cell.innerHTML) || 0);
      }
    }

    return table;
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
    if (this.hasWon()) {
      return 'win';
    }

    if (this.hasLose()) {
      return 'lose';
    }

    if (this.isPlaying()) {
      return 'playing';
    }

    if (this.isIdle()) {
      return 'idle';
    }
  }

  setStatus(newStatus) {
    return newStatus;
  }

  hasWon() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.rows;

    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;

      for (let j = 0; j < cells.length; j++) {
        if (parseInt(cells[j].innerHTML) === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasLose() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.rows;
    const table = [];

    for (let i = 0; i < rows.length; i++) {
      table[i] = [];

      const cells = rows[i].cells;

      for (let j = 0; j < cells.length; j++) {
        table[i][j] = parseInt(cells[j].innerHTML) || 0;
      }
    }

    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[i].length; j++) {
        if (table[i][j] === 0) {
          return false;
        }
      }
    }

    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[i].length - 1; j++) {
        if (table[i][j] === table[i][j + 1]) {
          return false;
        }
      }
    }

    for (let i = 0; i < table.length - 1; i++) {
      for (let j = 0; j < table.length - 1; j++) {
        if (table[i][j] === table[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  isIdle() {
    const tdElements = document.querySelectorAll('tbody td');

    for (let i = 0; i < tdElements.length; i++) {
      if (parseInt(tdElements[i].innerHTML) > 0) {
        return false;
      }
    }

    return true;
  }

  isPlaying() {
    const idle = this.isIdle();
    const lose = this.hasLose();
    const win = this.hasWon();

    if (!idle && !lose && !win) {
      return true;
    }

    return false;
  }
  /**
   * Starts the game.
   */
  start() {
    const startButton = document.querySelector('.button.start');

    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.textContent = 'Restart';

    const tdElements = document.querySelectorAll('.field-cell');
    const tdArray = Array.from(tdElements);
    let firstElement, secondElement;
    let uniqueElements = new Set();

    while (uniqueElements.size !== 2) {
      firstElement = tdArray[getRandomInt(tdArray.length)];
      secondElement = tdArray[getRandomInt(tdArray.length)];
      uniqueElements = new Set([firstElement, secondElement]);
    }

    if (uniqueElements.size === 2) {
      firstElement.classList.add('field-cell--2');
      firstElement.innerHTML = '2';
      secondElement.classList.add('field-cell--2');
      secondElement.innerHTML = '2';
    }

    const startMessage = document.querySelector('.message-start');

    if (startMessage) {
      startMessage.remove();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    const restartButton = document.querySelector('.button.restart');

    restartButton.classList.remove('restart');
    restartButton.classList.add('start');

    restartButton.textContent = 'Start';

    const tdElements = document.querySelectorAll('.field-cell');
    const tdArray = Array.from(tdElements);

    tdArray.forEach((element) => {
      element.className = 'field-cell';
      element.innerHTML = '';
    });

    const loseWindow = document.querySelector('.lose-window');

    if (loseWindow) {
      loseWindow.remove();
    }

    const winWindow = document.querySelector('.win-window');

    if (winWindow) {
      winWindow.remove();
    }

    const score = document.querySelector('.game-score');

    if (score) {
      score.innerHTML = '0';
    }

    this.setStatus('playing');

    const startMessage = document.createElement('p');

    startMessage.className = 'message message-start';
    startMessage.innerHTML = 'Press "Start" to begin game. Good luck!';

    const messageContainer = document.querySelector('.message-container');

    messageContainer.appendChild(startMessage);
  }

  // Add your own methods here
  addNewCell() {
    const tdElements = document.querySelectorAll('tbody td');
    const emptyCells = Array.from(tdElements).filter(
      (cell) => cell.textContent.trim() === '',
    );

    if (emptyCells.length > 0) {
      const newElement = emptyCells[getRandomInt(emptyCells.length)];
      const randomNumber = getRandomInt(2);

      if (randomNumber === 0) {
        newElement.innerHTML = '2';
        newElement.classList.add('field-cell--2');
      } else if (randomNumber === 1) {
        newElement.innerHTML = '4';
        newElement.classList.add('field-cell--4');
      }
    }
  }

  moveHorizontally(direction) {
    const table = this.getState();
    const newTable = [];

    const tbody = document.querySelector('tbody');
    const rows = tbody.rows;
    let totalScore = 0;
    let tableChanged = false;

    for (let i = 0; i < table.length; i++) {
      let row = table[i].filter((val) => val > 0);

      for (let k = 0; k < row.length - 1; k++) {
        if (row[k] === row[k + 1]) {
          row[k] *= 2;
          totalScore += row[k];
          tableChanged = true;
          row[k + 1] = 0;
        }
      }

      row = row.filter((val) => val > 0);

      while (row.length !== 4) {
        if (direction === 'right') {
          row.unshift(0);
        } else if (direction === 'left') {
          row.push(0);
        }
        tableChanged = true;
      }
      newTable.push(row);
    }

    for (let i = 0; i < newTable.length; i++) {
      for (let j = 0; j < newTable[i].length; j++) {
        rows[i].cells[j].innerHTML =
          newTable[i][j] > 0 ? `${newTable[i][j]}` : '';
        rows[i].cells[j].className = 'field-cell';

        if (newTable[i][j] > 0) {
          rows[i].cells[j].classList.add(`field-cell--${newTable[i][j]}`);
        }
      }
    }
    this.getScore(totalScore);
    if (tableChanged) {
      this.addNewCell();
    }
  }

  moveVertically(direction) {
    const table = this.getState();
    const newTable = [];

    const tbody = document.querySelector('tbody');
    const rows = tbody.rows;
    let totalScore = 0;
    let tableChanged = false;

    for (let i = 0; i < table[0].length; i++) {
      let cell = [];

      for (let j = 0; j < table.length; j++) {
        cell.push(table[j][i]);
      }

      cell = cell.filter((val) => val > 0);

      for (let k = 0; k < cell.length - 1; k++) {
        if (cell[k] === cell[k + 1]) {
          cell[k] *= 2;
          totalScore += cell[k];
          tableChanged = true;
          cell[k + 1] = 0;
        }
      }

      cell = cell.filter((val) => val > 0);

      while (cell.length !== 4) {
        if (direction === 'down') {
          cell.unshift(0);
        } else if (direction === 'up') {
          cell.push(0);
        }
        tableChanged = true;
      }

      for (let j = 0; j < table.length; j++) {
        newTable[j] = newTable[j] || [];
        newTable[j][i] = cell[j];
      }
    }

    for (let i = 0; i < newTable.length; i++) {
      for (let j = 0; j < newTable[i].length; j++) {
        rows[i].cells[j].innerHTML =
          newTable[i][j] > 0 ? `${newTable[i][j]}` : '';
        rows[i].cells[j].className = 'field-cell';

        if (newTable[i][j] > 0) {
          rows[i].cells[j].classList.add(`field-cell--${newTable[i][j]}`);
        }
      }
    }
    this.getScore(totalScore);
    if (tableChanged) {
      this.addNewCell();
    }
  }

  loseWindow() {
    const loseWindow = document.createElement('div');

    loseWindow.className = 'lose-window';

    const title = document.createElement('h2');

    title.textContent = 'You lose! Try again.';
    loseWindow.appendChild(title);
    document.body.appendChild(loseWindow);
  }

  winWindow() {
    const winWindow = document.createElement('div');

    winWindow.className = 'win-window';

    const title = document.createElement('h2');

    title.textContent = 'You won! Congratulation!.';
    winWindow.appendChild(title);
    document.body.appendChild(winWindow);
  }
}

module.exports = Game;

function getRandomInt(num) {
  return Math.floor(Math.random() * num);
}
