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
    const trElements = document.querySelectorAll('tbody > tr');
    const trArray = Array.from(trElements);

    for (const tr of trArray) {
      for (let i = tr.children.length - 1; i >= 0; i--) {
        if (tr.children[i].classList.length > 1) {
          if (tr.children[3].classList.length === 1) {
            moveOnEmpty(tr, i, 3);
          } else if (
            tr.children[3].innerHTML === tr.children[i].innerHTML &&
            i !== 3
          ) {
            mergeCellsInRow(tr, i, 3);
          } else if (tr.children[2].classList.length === 1) {
            moveOnEmpty(tr, i, 2);
          } else if (
            tr.children[2].innerHTML === tr.children[i].innerHTML &&
            i !== 2
          ) {
            mergeCellsInRow(tr, i, 2);
          }
        }
      }
    }
  }

  moveLeft() {
    const trElements = document.querySelectorAll('tbody > tr');
    const trArray = Array.from(trElements);

    for (const tr of trArray) {
      for (let i = 0; i < tr.children.length; i++) {
        if (tr.children[i].classList.length > 1) {
          if (tr.children[0].classList.length === 1) {
            moveOnEmpty(tr, i, 0);
          } else if (
            tr.children[0].innerHTML === tr.children[i].innerHTML &&
            i !== 0
          ) {
            mergeCellsInRow(tr, i, 0);
          } else if (tr.children[1].classList.length === 1) {
            moveOnEmpty(tr, i, 1);
          } else if (
            tr.children[1].innerHTML === tr.children[i].innerHTML &&
            i !== 1
          ) {
            mergeCellsInRow(tr, i, 1);
          }
        }
      }
    }
  }
  moveUp() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.rows;

    for (let i = 0; i < rows[0].cells.length; i++) {
      for (let j = 0; j < rows.length; j++) {
        const cell = rows[j].cells[i];

        if (cell.classList.length > 1) {
          if (rows[0].cells[i].classList.length === 1) {
            moveOnEmptyCell(tbody, j, i, 0);
          } else if (
            rows[0].cells[i].innerHTML === rows[j].cells[i].innerHTML &&
            j !== 0
          ) {
            mergeCellsInCell(tbody, j, i, 0);
          } else if (rows[1].cells[i].classList.length === 1) {
            moveOnEmptyCell(tbody, j, i, 1);
          } else if (
            rows[1].cells[i].innerHTML === rows[j].cells[i].innerHTML &&
            j !== 1
          ) {
            mergeCellsInCell(tbody, j, i, 1);
          }
        }
      }
    }
  }

  moveDown() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.rows;

    for (let i = 0; i < rows[0].cells.length; i++) {
      for (let j = rows.length - 2; j >= 0; j--) {
        const cell = rows[j].cells[i];

        if (cell.classList.length > 1) {
          if (rows[3].cells[i].classList.length === 1) {
            moveOnEmptyCell(tbody, j, i, 3);
          } else if (
            rows[3].cells[i].innerHTML === rows[j].cells[i].innerHTML &&
            j !== 3
          ) {
            mergeCellsInCell(tbody, j, i, 3);
          } else if (rows[2].cells[i].classList.length === 1) {
            moveOnEmptyCell(tbody, j, i, 2);
          } else if (
            rows[2].cells[i].innerHTML === rows[j].cells[i].innerHTML &&
            j !== 2
          ) {
            mergeCellsInCell(tbody, j, i, 2);
          }
        }
      }
    }
  }

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
    const startButton = document.querySelector('.button.start');

    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.textContent = 'Restart';

    const tdElements = document.querySelectorAll('.field-cell');
    const tdArray = Array.from(tdElements);
    let firstElement, secondElement;
    let uniqueElements = new Set();

    while (uniqueElements.size !== 2) {
      firstElement = tdArray[getRandomInt(tdArray.length - 1)];
      secondElement = tdArray[getRandomInt(tdArray.length - 1)];
      uniqueElements = new Set([firstElement, secondElement]);
    }

    if (uniqueElements.size === 2) {
      firstElement.classList.add('field-cell--2');
      firstElement.innerHTML = '2';
      secondElement.classList.add('field-cell--2');
      secondElement.innerHTML = '2';
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
  }

  // Add your own methods here
}

module.exports = Game;

function getRandomInt(num) {
  return Math.floor(Math.random() * num);
}

function moveOnEmpty(tr, i, index) {
  tr.children[index].innerHTML = tr.children[i].innerHTML;
  tr.children[i].innerHTML = '';

  tr.children[index].classList = tr.children[i].classList;
  tr.children[i].className = 'field-cell';
}

function moveOnEmptyCell(tbody, j, i, index) {
  tbody.rows[index].cells[i].innerHTML = tbody.rows[j].cells[i].innerHTML;
  tbody.rows[j].cells[i].innerHTML = '';

  tbody.rows[index].cells[i].classList = tbody.rows[j].cells[i].classList;
  tbody.rows[j].cells[i].className = 'field-cell';
}

function mergeCellsInRow(tr, i, index) {
  const number = parseInt(tr.children[i].innerHTML);
  const doubleNumber = number * 2;

  tr.children[index].innerHTML = doubleNumber;
  tr.children[i].innerHTML = '';

  const classList = tr.children[i].classList;
  const className = classList[1];

  if (className) {
    tr.children[i].classList.remove(className);
  }

  tr.children[index].classList.add(`field-cell--${doubleNumber}`);
}

function mergeCellsInCell(tbody, j, i, index) {
  const number = parseInt(tbody.rows[j].cells[i].innerHTML);
  const doubleNumber = number * 2;

  tbody.rows[index].cells[i].innerHTML = doubleNumber;
  tbody.rows[j].cells[i].innerHTML = '';

  const classList = tbody.rows[j].cells[i].classList;
  const className = classList[1];

  if (className) {
    tbody.rows[j].cells[i].classList.remove(className);
  }

  tbody.rows[index].cells[i].classList.add(`field-cell--${doubleNumber}`);
}
