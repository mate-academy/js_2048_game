'use strict';

const cellsArray = [...document.querySelectorAll('.field-cell')];
const usedCells = [];
const startButton = document.querySelector('button.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const transitionTime = 300;
let isWinMessage = false;

function randomizer(numberToRandom = 9) {
  return Math.floor(Math.random() * numberToRandom);
}

function changeStartButton(newClass) {
  const startButtonClasses = startButton.classList;

  startButtonClasses.remove(startButtonClasses[startButtonClasses.length - 1]);
  startButtonClasses.add(newClass.toLowerCase());
  startButton.innerText = newClass;
}

function addNumberToFreeCell(cellNumber) {
  for (let i = 0; i < cellNumber; i++) {
    const runningCell = document.createElement('div');
    const freeCells = cellsArray.filter(cell => !usedCells.includes(cell));
    const randomCell = freeCells[randomizer(freeCells.length - 1)];
    const randomCellClass = randomizer() === 4
      ? 'running-cell--4' : 'running-cell--2';

    usedCells.push(randomCell);
    runningCell.classList.add('running-cell', randomCellClass);
    runningCell.style.top = `${randomCell.offsetTop}px`;
    runningCell.style.left = `${randomCell.offsetLeft}px`;
    runningCell.innerText = randomCellClass.slice(14);
    cellsArray[0].parentElement.append(runningCell);
  }
};

function clearGame() {
  [...document.querySelectorAll('.running-cell')].map(cell => cell.remove());
  isWinMessage = false;
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  usedCells.length = 0;
  score.innerHTML = 0;
};

function checkForLose() {
  const tops = [10, 95, 180, 265];
  const runningCellsArray = [...document.querySelectorAll('.running-cell')];

  if (runningCellsArray.length === 16) {
    const filteredAndSortedRunCells = [];

    tops.forEach(topValue => runningCellsArray
      .filter(cell => cell.offsetTop === topValue)
      .sort((a, b) => a.offsetLeft - b.offsetLeft)
      .forEach(cell => filteredAndSortedRunCells.push(cell))
    );

    let canContinueGame = false;

    for (let i = 0; i < filteredAndSortedRunCells.length; i++) {
      const cell = filteredAndSortedRunCells[i];
      const nextCell = filteredAndSortedRunCells[i + 1];
      const nextUpCell = filteredAndSortedRunCells[i + 4];

      if (nextCell && nextCell.offsetTop === cell.offsetTop
        && nextCell.innerText === cell.innerText) {
        canContinueGame = true;

        break;
      }

      if (nextUpCell && nextUpCell.offsetLeft === cell.offsetLeft
        && nextUpCell.innerText === cell.innerText) {
        canContinueGame = true;

        break;
      }
    }

    if (!canContinueGame) {
      loseMessage.classList.remove('hidden');
    }
  }
}

function checkForWin(numberOfCell) {
  if (numberOfCell === 2048) {
    isWinMessage = true;
    document.removeEventListener('keydown', handleInput);
    setTimeout(() => winMessage.classList.remove('hidden'), transitionTime);
  }
}

function moveCell(way) {
  const cellsTops = [10, 95, 180, 265];
  const runningCellsArray = [...document.querySelectorAll('.running-cell')];
  let cellsMoveTimes = 0;

  usedCells.length = 0;

  cellsTops.map(indentation => {
    let runCellsRow = [...runningCellsArray];
    let fieldCellsRow = [...cellsArray];

    if (way === 37 || way === 39) {
      runCellsRow = runCellsRow
        .filter(runCell => runCell.offsetTop === indentation);

      fieldCellsRow = fieldCellsRow
        .filter(runCell => runCell.offsetTop === indentation);
    }

    if (way === 38 || way === 40) {
      runCellsRow = runCellsRow
        .filter(runCell => runCell.offsetLeft === indentation);

      fieldCellsRow = fieldCellsRow
        .filter(runCell => runCell.offsetLeft === indentation);
    }

    if (way === 37) {
      runCellsRow = runCellsRow
        .sort((a, b) => a.offsetLeft - b.offsetLeft);
    }

    if (way === 38) {
      runCellsRow = runCellsRow
        .sort((a, b) => a.offsetTop - b.offsetTop);
    }

    if (way === 39) {
      runCellsRow = runCellsRow
        .sort((a, b) => b.offsetLeft - a.offsetLeft);
      fieldCellsRow.reverse();
    }

    if (way === 40) {
      runCellsRow = runCellsRow
        .sort((a, b) => b.offsetTop - a.offsetTop);
      fieldCellsRow.reverse();
    }

    if (runCellsRow.length > 0) {
      const changedCellsRow = [];
      const cellsToRemove = [];

      for (let i = 0; i < runCellsRow.length; i++) {
        const cellToMove = fieldCellsRow[i];
        const curRunCell = runCellsRow[i];
        const nextRunCell = runCellsRow[i + 1];

        if (nextRunCell !== undefined
          && +curRunCell.innerHTML === +nextRunCell.innerHTML) {
          if (way === 37 || way === 38) {
            const number = +nextRunCell.innerHTML * 2;

            changedCellsRow.push({
              cell: nextRunCell,
              number: number,
            });
            cellsToRemove.push(curRunCell);
            runCellsRow.splice(i, 1);
            checkForWin(number);
          }

          if (way === 39 || way === 40) {
            const number = +curRunCell.innerHTML * 2;

            changedCellsRow.push({
              cell: curRunCell,
              number: number,
            });
            cellsToRemove.push(nextRunCell);
            runCellsRow.splice(i + 1, 1);
            checkForWin(number);
          }

          if (way === 37 || way === 39) {
            curRunCell.style.left = `${cellToMove.offsetLeft}px`;
            nextRunCell.style.left = `${cellToMove.offsetLeft}px`;
          }

          if (way === 38 || way === 40) {
            curRunCell.style.top = `${cellToMove.offsetTop}px`;
            nextRunCell.style.top = `${cellToMove.offsetTop}px`;
          }

          usedCells.push(cellToMove);
          cellsMoveTimes += 1;

          continue;
        }

        if (way === 37) {
          if (cellToMove.offsetLeft < curRunCell.offsetLeft) {
            curRunCell.style.left = `${cellToMove.offsetLeft}px`;
            cellsMoveTimes += 1;
          }
        }

        if (way === 38) {
          if (cellToMove.offsetTop < curRunCell.offsetTop) {
            curRunCell.style.top = `${cellToMove.offsetTop}px`;
            cellsMoveTimes += 1;
          }
        }

        if (way === 39) {
          if (curRunCell.offsetLeft < cellToMove.offsetLeft) {
            curRunCell.style.left = `${cellToMove.offsetLeft}px`;
            cellsMoveTimes += 1;
          }
        }

        if (way === 40) {
          if (curRunCell.offsetTop < cellToMove.offsetTop) {
            curRunCell.style.top = `${cellToMove.offsetTop}px`;
            cellsMoveTimes += 1;
          }
        }

        usedCells.push(cellToMove);
      }

      setTimeout(() => {
        let scoreValue = 0;

        changedCellsRow.map(({ cell, number }) => {
          cell.classList.remove(`running-cell--${number / 2}`);
          cell.classList.add(`running-cell--${number}`);
          cell.innerText = number;
          scoreValue += number;
        });
        cellsToRemove.map(cell => cell.remove());
        score.innerHTML = +score.innerHTML + scoreValue;
      }, transitionTime);
    }
  });

  if ((cellsMoveTimes > 0 && !isWinMessage) && runningCellsArray.length < 16) {
    setTimeout(() => {
      addNumberToFreeCell(1);
      checkForLose();
    }, transitionTime);
  }

  if (!isWinMessage) {
    setTimeout(() => setMove(), transitionTime * 1.05);
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startMessage.classList.add('hidden');
    addNumberToFreeCell(2);
    setMove();
    changeStartButton('Restart');

    return startButton;
  }

  clearGame();
  addNumberToFreeCell(2);
  setMove();
});

function setMove() {
  document.addEventListener('keydown', handleInput, { once: true });
};

function handleInput(e) {
  if (startButton.classList.contains('restart')) {
    const moveButtonsCodes = [37, 38, 39, 40];

    switch (true) {
      case moveButtonsCodes.includes(e.keyCode):
        moveCell(e.keyCode);
        break;

      default:
        return setMove();
    }
  }
}
