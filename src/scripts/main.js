'use strict';

const cellsArray = [...document.querySelectorAll('.field-cell')];
const usedCells = [];
const startButton = document.querySelector('button.button');
const startMessage = document.querySelector('.message-start');
const transitionTime = 150;

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
    runningCell.classList.add('running-cell');

    runningCell.style.top = `${randomCell.offsetTop
      + randomCell.offsetHeight / 2}px`;

    runningCell.style.left = `${randomCell.offsetLeft
      + randomCell.offsetHeight / 2}px`;
    runningCell.innerText = randomCellClass.slice(-1);
    cellsArray[0].parentElement.append(runningCell);

    setTimeout(() => {
      runningCell.classList.add(randomCellClass);
      runningCell.style.top = `${randomCell.offsetTop}px`;
      runningCell.style.left = `${randomCell.offsetLeft}px`;
    }, 10);
  }
};

function clearGame() {
  [...document.querySelectorAll('.running-cell')].map(cell => cell.remove());
  usedCells.length = 0;
};

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startMessage.classList.add('hidden');
    addNumberToFreeCell(2);
    changeStartButton('Restart');

    return startButton;
  }

  clearGame();
  addNumberToFreeCell(2);
});

document.addEventListener('keydown', (e) => {
  if (startButton.classList.contains('restart')) {
    const runningCellsArray = [...document.querySelectorAll('.running-cell')];

    if (e.keyCode === 37) {
      const cellsTops = [10, 95, 180, 265];
      let cellsMoveTimes = 0;

      usedCells.length = 0;

      cellsTops.map(cellsTop => {
        const changedCellsRow = [];
        const cellsToRemove = [];
        const runCellsRow = [...runningCellsArray]
          .filter(runCell => runCell.offsetTop === cellsTop)
          .sort((a, b) => a.offsetLeft - b.offsetLeft);
        const fieldCellsRow = [...cellsArray]
          .filter(cell => cell.offsetTop === cellsTop);

        if (runCellsRow.length > 0) {
          for (let i = 0; i < runCellsRow.length; i++) {
            const cellToMove = fieldCellsRow[i];
            const curRunCell = runCellsRow[i];
            const nextRunCell = runCellsRow[i + 1];

            if (nextRunCell !== undefined && curRunCell
              .classList[curRunCell.classList.length - 1] === nextRunCell
              .classList[nextRunCell.classList.length - 1]) {
              changedCellsRow.push({
                cell: nextRunCell,
                number: (+nextRunCell
                  .classList[curRunCell.classList.length - 1]
                  .slice(14) * 2),
              });
              curRunCell.style.left = `${cellToMove.offsetLeft}px`;
              nextRunCell.style.left = `${cellToMove.offsetLeft}px`;
              cellsToRemove.push(curRunCell);
              usedCells.push(cellToMove);
              runCellsRow.splice(i, 1);
              cellsMoveTimes += 1;

              continue;
            }

            if (curRunCell.offsetLeft > cellToMove.offsetLeft) {
              curRunCell.style.left = `${cellToMove.offsetLeft}px`;
              cellsMoveTimes += 1;
            }

            usedCells.push(cellToMove);
          }

          setTimeout(() => {
            cellsToRemove.map(cell => cell.remove());

            changedCellsRow.map(({ cell, number }) => {
              cell.classList.remove(cell.classList[cell.classList.length - 1]);
              cell.classList.add(`running-cell--${number}`);
              cell.innerText = number;
            });
          }, transitionTime);
        }
      });

      if (cellsMoveTimes > 0) {
        setTimeout(() => addNumberToFreeCell(1), transitionTime);
      }
    }

    if (e.keyCode === 38) {
      const cellsLefts = [10, 95, 180, 265];
      let cellsMoveTimes = 0;

      usedCells.length = 0;

      cellsLefts.map(cellsLeft => {
        const changedCellsRow = [];
        const cellsToRemove = [];
        const runCellsRow = [...runningCellsArray]
          .filter(runCell => runCell.offsetLeft === cellsLeft)
          .sort((a, b) => a.offsetTop - b.offsetTop);
        const fieldCellsRow = [...cellsArray]
          .filter(cell => cell.offsetLeft === cellsLeft);

        if (runCellsRow.length > 0) {
          for (let i = 0; i < runCellsRow.length; i++) {
            const cellToMove = fieldCellsRow[i];
            const curRunCell = runCellsRow[i];
            const nextRunCell = runCellsRow[i + 1];

            if (nextRunCell !== undefined && curRunCell
              .classList[curRunCell.classList.length - 1] === nextRunCell
              .classList[nextRunCell.classList.length - 1]) {
              changedCellsRow.push({
                cell: nextRunCell,
                number: (+nextRunCell
                  .classList[curRunCell.classList.length - 1]
                  .slice(14) * 2),
              });
              curRunCell.style.top = `${cellToMove.offsetTop}px`;
              nextRunCell.style.top = `${cellToMove.offsetTop}px`;
              cellsToRemove.push(curRunCell);
              usedCells.push(cellToMove);
              runCellsRow.splice(i, 1);
              cellsMoveTimes += 1;

              continue;
            }

            if (curRunCell.offsetTop > cellToMove.offsetTop) {
              curRunCell.style.top = `${cellToMove.offsetTop}px`;
              cellsMoveTimes += 1;
            }

            usedCells.push(cellToMove);
          }

          setTimeout(() => {
            cellsToRemove.map(cell => cell.remove());

            changedCellsRow.map(({ cell, number }) => {
              cell.classList.remove(cell.classList[cell.classList.length - 1]);
              cell.classList.add(`running-cell--${number}`);
              cell.innerText = number;
            });
          }, transitionTime);
        }
      });

      if (cellsMoveTimes > 0) {
        setTimeout(() => addNumberToFreeCell(1), transitionTime);
      }
    }

    if (e.keyCode === 39) {
      const cellsTops = [10, 95, 180, 265];
      let cellsMoveTimes = 0;

      usedCells.length = 0;

      cellsTops.map(cellsTop => {
        const changedCellsRow = [];
        const cellsToRemove = [];
        const runCellsRow = [...runningCellsArray]
          .filter(runCell => runCell.offsetTop === cellsTop)
          .sort((a, b) => b.offsetLeft - a.offsetLeft);
        const fieldCellsRow = [...cellsArray]
          .filter(cell => cell.offsetTop === cellsTop)
          .reverse();

        if (runCellsRow.length > 0) {
          for (let i = 0; i < runCellsRow.length; i++) {
            const cellToMove = fieldCellsRow[i];
            const curRunCell = runCellsRow[i];
            const nextRunCell = runCellsRow[i + 1];

            if (nextRunCell !== undefined && curRunCell
              .classList[curRunCell.classList.length - 1] === nextRunCell
              .classList[nextRunCell.classList.length - 1]) {
              changedCellsRow.push({
                cell: curRunCell,
                number: (+curRunCell
                  .classList[curRunCell.classList.length - 1]
                  .slice(14) * 2),
              });
              curRunCell.style.left = `${cellToMove.offsetLeft}px`;
              nextRunCell.style.left = `${cellToMove.offsetLeft}px`;
              cellsToRemove.push(nextRunCell);
              usedCells.push(cellToMove);
              runCellsRow.splice(i + 1, 1);
              cellsMoveTimes += 1;

              continue;
            }

            if (curRunCell.offsetLeft !== cellToMove.offsetLeft) {
              curRunCell.style.left = `${cellToMove.offsetLeft}px`;
              cellsMoveTimes += 1;
            }

            usedCells.push(cellToMove);
          }

          setTimeout(() => {
            cellsToRemove.map(cell => cell.remove());

            changedCellsRow.map(({ cell, number }) => {
              cell.classList.remove(cell.classList[cell.classList.length - 1]);
              cell.classList.add(`running-cell--${number}`);
              cell.innerText = number;
            });
          }, transitionTime);
        }
      });

      if (cellsMoveTimes > 0) {
        setTimeout(() => addNumberToFreeCell(1), transitionTime);
      }
    }

    if (e.keyCode === 40) {
      const cellsLefts = [10, 95, 180, 265];
      let cellsMoveTimes = 0;

      usedCells.length = 0;

      cellsLefts.map(cellsLeft => {
        const changedCellsRow = [];
        const cellsToRemove = [];
        const runCellsRow = [...runningCellsArray]
          .filter(runCell => runCell.offsetLeft === cellsLeft)
          .sort((a, b) => b.offsetTop - a.offsetTop);
        const fieldCellsRow = [...cellsArray]
          .filter(cell => cell.offsetLeft === cellsLeft)
          .reverse();

        if (runCellsRow.length > 0) {
          for (let i = 0; i < runCellsRow.length; i++) {
            const cellToMove = fieldCellsRow[i];
            const curRunCell = runCellsRow[i];
            const nextRunCell = runCellsRow[i + 1];

            if (nextRunCell !== undefined && curRunCell
              .classList[curRunCell.classList.length - 1] === nextRunCell
              .classList[nextRunCell.classList.length - 1]) {
              changedCellsRow.push({
                cell: nextRunCell,
                number: (+nextRunCell
                  .classList[curRunCell.classList.length - 1]
                  .slice(14) * 2),
              });
              curRunCell.style.top = `${cellToMove.offsetTop}px`;
              nextRunCell.style.top = `${cellToMove.offsetTop}px`;
              cellsToRemove.push(curRunCell);
              usedCells.push(cellToMove);
              runCellsRow.splice(i, 1);
              cellsMoveTimes += 1;

              continue;
            }

            if (curRunCell.offsetTop !== cellToMove.offsetTop) {
              curRunCell.style.top = `${cellToMove.offsetTop}px`;
              cellsMoveTimes += 1;
            }

            usedCells.push(cellToMove);
          }

          setTimeout(() => {
            cellsToRemove.map(cell => cell.remove());

            changedCellsRow.map(({ cell, number }) => {
              cell.classList.remove(cell.classList[cell.classList.length - 1]);
              cell.classList.add(`running-cell--${number}`);
              cell.innerText = number;
            });
          }, transitionTime);
        }
      });

      if (cellsMoveTimes > 0) {
        setTimeout(() => addNumberToFreeCell(1), transitionTime);
      }
    }
  }
});
