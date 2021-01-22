'use strict';

const arrowButtons = [`ArrowUp`, `ArrowDown`,
  `ArrowLeft`, `ArrowRight`];
const tr = document.querySelectorAll(`tr`);
const startButton = document.querySelector(`.start`);
const startMessage = document.querySelector(`.message-start`);
const loseMessage = document.querySelector(`.message-lose`);
const gameScore = document.querySelector(`.game-score`);
let mergingHappened;

const createCell = () => {
  for (let i = 0; i < 1; i++) {
    const randomRawIndex = Math.floor(Math.random() * 4);
    const randomCellIndex = Math.floor(Math.random() * 4);
    const randomCell = tr[randomRawIndex].children[randomCellIndex];

    randomCell.dataset.rawIndex = randomRawIndex;
    randomCell.dataset.cellIndex = randomCellIndex;

    if (randomCell.classList.contains(`active`)) {
      i--;
      continue;
    }
    appearedCellValue(randomCell);
  }
};

const appearedCellValue = (cell) => {
  const randomValue = Math.ceil(Math.random() * 10);
  const newCellValue = randomValue === 10 ? 4 : 2;

  cell.textContent = newCellValue;
  cell.classList.add(`field-cell--${newCellValue}`, `active`);
};

const startGame = () => {
  startButton.addEventListener(`click`, () => {
    const activeCells = document.querySelectorAll(`.active`);

    startButton.className = `button restart`;
    startButton.textContent = `Restart`;
    startMessage.classList.add(`hidden`);
    movesHandler();

    activeCells.forEach(cell => {
      cell.classList.remove(`field-cell--${cell.textContent}`, `active`);
      cell.textContent = ``;
    });
    gameScore.textContent = `0`;
    loseMessage.classList.add(`hidden`);
    createCell();
    createCell();
  });
};

const movesHandler = () => {
  document.addEventListener(`keydown`, (e) => {
    if (!arrowButtons.includes(e.key)) {
      return;
    }

    switch (e.key) {
      case `ArrowUp`:
        verticalMergeOfCells(`Up`, moveUp, false);
        break;
      case `ArrowDown`:
        verticalMergeOfCells(`Down`, moveDown, false);
        break;
      case `ArrowLeft`:
        horizontalMergeOfCells(`Left`, moveLeft, false);
        break;
      case `ArrowRight`:
        horizontalMergeOfCells(`Right`, moveRight, false);
        break;
    }
    gameLostCheck();
  });
};

const combineCellsInColumns = () => {
  const activeCells = document.querySelectorAll(`.active`);
  const activeCellsArr = [...activeCells];
  const arrOfColumns = [];

  for (let i = 0; i < 4; i++) {
    const column = activeCellsArr.filter(cell => {
      return +cell.dataset.cellIndex === i;
    });

    arrOfColumns.push(column);
  }

  return arrOfColumns;
};

const combineCellsInRaws = () => {
  const activeCells = document.querySelectorAll(`.active`);
  const activeCellsArr = [...activeCells];
  const arrOfRaws = [];

  for (let i = 0; i < 4; i++) {
    const raw = activeCellsArr.filter(cell => {
      return +cell.dataset.rawIndex === i;
    });

    arrOfRaws.push(raw);
  }

  return arrOfRaws;
};

const verticalMergeOfCells = (movement, callback, lostGameCheck) => {
  mergingHappened = false;

  const arrOfColumns = combineCellsInColumns();
  let checkOfMergeForLostGame = false;

  arrOfColumns.forEach(column => {
    if (movement === `Up`) {
      for (let i = 0; i < column.length; i++) {
        if (i === column.length - 1) {
          break;
        }

        if (column[i].textContent !== column[i + 1].textContent) {
          continue;
        }

        if (lostGameCheck) {
          checkOfMergeForLostGame = true;

          break;
        }

        const mergedCell = column[i];
        const cellToDelete = column[i + 1];

        mergingHappened = true;
        merge(mergedCell, cellToDelete);
        i++;
      }
    }

    if (movement === `Down`) {
      for (let i = column.length - 1; i >= 0; i--) {
        if (i === 0) {
          break;
        }

        if (column[i].textContent !== column[i - 1].textContent) {
          continue;
        }

        if (lostGameCheck) {
          checkOfMergeForLostGame = true;

          break;
        }

        const mergedCell = column[i];
        const cellToDelete = column[i - 1];

        mergingHappened = true;
        merge(mergedCell, cellToDelete);
        i++;
      }
    }
  });

  if (checkOfMergeForLostGame) {
    return false;
  }

  callback();

  return true;
};

const horizontalMergeOfCells = (movement, callback, lostGameCheck) => {
  mergingHappened = false;

  const arrOfRaws = combineCellsInRaws();
  let checkOfMergeForLostGame = false;

  arrOfRaws.forEach(raw => {
    if (movement === `Left`) {
      for (let i = 0; i < raw.length; i++) {
        if (i === raw.length - 1) {
          break;
        }

        if (raw[i].textContent !== raw[i + 1].textContent) {
          continue;
        }

        if (lostGameCheck) {
          checkOfMergeForLostGame = true;

          break;
        }

        const mergedCell = raw[i];
        const cellToDelete = raw[i + 1];

        mergingHappened = true;
        merge(mergedCell, cellToDelete);
        i++;
      }
    }

    if (movement === `Right`) {
      for (let i = raw.length - 1; i >= 0; i--) {
        if (i === 0) {
          break;
        }

        if (raw[i].textContent !== raw[i - 1].textContent) {
          continue;
        }

        if (lostGameCheck) {
          checkOfMergeForLostGame = true;

          break;
        }

        const mergedCell = raw[i];
        const cellToDelete = raw[i - 1];

        mergingHappened = true;
        merge(mergedCell, cellToDelete);
        i++;
      }
    }
  });

  if (checkOfMergeForLostGame) {
    return false;
  }

  callback();

  return true;
};

const merge = (mergedCell, cellToDelete) => {
  mergedCell.classList.remove(`field-cell--${mergedCell.textContent}`);
  mergedCell.textContent = +mergedCell.textContent * 2;
  mergedCell.classList.add(`field-cell--${mergedCell.textContent}`);

  cellToDelete.classList.remove(`field-cell--${cellToDelete.textContent}`,
    `active`);
  cellToDelete.textContent = ``;
  recordOfScore(mergedCell.textContent);

  if (mergedCell.textContent === `2048`) {
    winGameMessage();
  }
};

const winGameMessage = () => {
  const winMessage = document.querySelector(`.message-win`);

  winMessage.classList.remove(`hidden`);
};

const recordOfScore = (value) => {
  gameScore.textContent = Number(gameScore.textContent) + Number(value);
};

const moveUp = () => {
  let moveWasPerformed = false;
  const arrOfColumns = combineCellsInColumns();

  arrOfColumns.forEach(column => {
    for (let i = 0; i < column.length; i++) {
      for (let newIndex = 0; newIndex < 4; newIndex++) {
        const cellIndex = +column[i].dataset.cellIndex;

        if (tr[newIndex].children[cellIndex].classList.contains(`active`)
          || +column[i].dataset.rawIndex < newIndex) {
          continue;
        }

        const oldCell = column[i];
        const newCell = tr[newIndex].children[cellIndex];

        move(newCell, oldCell, cellIndex, newIndex);
        moveWasPerformed = true;
        break;
      }
    }
  });

  if (moveWasPerformed || mergingHappened) {
    createCell();
  }
};

const moveDown = () => {
  let moveWasPerformed = false;
  const arrOfColumns = combineCellsInColumns();

  arrOfColumns.forEach(column => {
    for (let i = column.length - 1; i >= 0; i--) {
      for (let newIndex = 3; newIndex >= 0; newIndex--) {
        const cellIndex = +column[i].dataset.cellIndex;

        if (tr[newIndex].children[cellIndex].classList.contains(`active`)
          || +column[i].dataset.rawIndex > newIndex) {
          continue;
        }

        const oldCell = column[i];
        const newCell = tr[newIndex].children[cellIndex];

        move(newCell, oldCell, cellIndex, newIndex);
        moveWasPerformed = true;
        break;
      }
    }
  });

  if (moveWasPerformed || mergingHappened) {
    createCell();
  }
};

const moveLeft = () => {
  let moveWasPerformed = false;
  const arrOfRaws = combineCellsInRaws();

  arrOfRaws.forEach(raw => {
    for (let i = 0; i < raw.length; i++) {
      for (let newIndex = 0; newIndex < 4; newIndex++) {
        const cellIndex = +raw[i].dataset.rawIndex;

        if (tr[cellIndex].children[newIndex].classList.contains(`active`)
          || +raw[i].dataset.cellIndex < newIndex) {
          continue;
        }

        const oldCell = raw[i];
        const newCell = tr[cellIndex].children[newIndex];

        move(newCell, oldCell, newIndex, cellIndex);
        moveWasPerformed = true;
        break;
      }
    }
  });

  if (moveWasPerformed || mergingHappened) {
    createCell();
  }
};

const moveRight = () => {
  let moveWasPerformed = false;
  const arrOfRaws = combineCellsInRaws();

  arrOfRaws.forEach(raw => {
    for (let i = raw.length - 1; i >= 0; i--) {
      for (let newIndex = 3; newIndex >= 0; newIndex--) {
        const cellIndex = +raw[i].dataset.rawIndex;

        if (tr[cellIndex].children[newIndex].classList.contains(`active`)
          || +raw[i].dataset.cellIndex > newIndex) {
          continue;
        }

        const oldCell = raw[i];
        const newCell = tr[cellIndex].children[newIndex];

        move(newCell, oldCell, newIndex, cellIndex);
        moveWasPerformed = true;
        break;
      }
    }
  });

  if (moveWasPerformed || mergingHappened) {
    createCell();
  }
};

const move = (newCell, oldCell, cellIndex, newIndex) => {
  newCell.textContent = oldCell.textContent;
  newCell.classList.add(`active`, `field-cell--${newCell.textContent}`);
  newCell.dataset.rawIndex = newIndex;
  newCell.dataset.cellIndex = cellIndex;
  oldCell.classList.remove(`active`);
  oldCell.classList.remove(`field-cell--${oldCell.textContent}`);
  oldCell.textContent = ``;
};

const gameLostCheck = () => {
  const activeCells = document.querySelectorAll(`.active`);

  if (activeCells.length !== 16) {
    return;
  }

  const left = horizontalMergeOfCells(`Left`, moveLeft, true);
  const right = horizontalMergeOfCells(`Right`, moveRight, true);
  const up = verticalMergeOfCells(`Up`, moveUp, true);
  const down = verticalMergeOfCells(`Down`, moveDown, true);

  if (left && right && up && down) {
    loseMessage.classList.remove(`hidden`);
  }
};

startGame();
