'use strict';

const cellsArray = [...document.querySelectorAll('.field-cell')];
const usedCells = [];
const startButton = document.querySelector('button.button');
const startMessage = document.querySelector('.message-start');
// const loseMessage = document.querySelector('.message-lose');
// const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const transitionTime = 300;

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
    runningCell.innerText = randomCellClass.slice(-1);
    cellsArray[0].parentElement.append(runningCell);
  }
};

function clearGame() {
  [...document.querySelectorAll('.running-cell')].map(cell => cell.remove());
  // loseMessage.classList.add('hidden');
  usedCells.length = 0;
  score.innerHTML = 0;
};

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
            changedCellsRow.push({
              cell: nextRunCell,
              number: +nextRunCell.innerHTML * 2,
            });
            cellsToRemove.push(curRunCell);
            runCellsRow.splice(i, 1);
          }

          if (way === 39 || way === 40) {
            changedCellsRow.push({
              cell: curRunCell,
              number: +curRunCell.innerHTML * 2,
            });
            cellsToRemove.push(nextRunCell);
            runCellsRow.splice(i + 1, 1);
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

  if (cellsMoveTimes > 0) {
    setTimeout(() => addNumberToFreeCell(1), transitionTime);
  }

  setTimeout(() => setMove(), transitionTime * 1.2);
}

// function moveLeft() {
//   const cellsTops = [10, 95, 180, 265];
//   const runningCellsArray = [...document.querySelectorAll('.running-cell')];
//   let cellsMoveTimes = 0;

//   usedCells.length = 0;

//   cellsTops.map(cellsTop => {
//     const runCellsRow = [...runningCellsArray]
//       .filter(runCell => runCell.offsetTop === cellsTop)
//       .sort((a, b) => a.offsetLeft - b.offsetLeft);
//     const fieldCellsRow = [...cellsArray]
//       .filter(cell => cell.offsetTop === cellsTop);

//     if (runCellsRow.length > 0) {
//       const changedCellsRow = [];
//       const cellsToRemove = [];

//       for (let i = 0; i < runCellsRow.length; i++) {
//         const cellToMove = fieldCellsRow[i];
//         const curRunCell = runCellsRow[i];
//         const nextRunCell = runCellsRow[i + 1];

//         if (nextRunCell !== undefined
//           && +curRunCell.innerHTML === +nextRunCell.innerHTML) {
//           changedCellsRow.push({
//             cell: nextRunCell,
//             number: +nextRunCell.innerHTML * 2,
//           });
//           curRunCell.style.left = `${cellToMove.offsetLeft}px`;
//           nextRunCell.style.left = `${cellToMove.offsetLeft}px`;
//           cellsToRemove.push(curRunCell);
//           usedCells.push(cellToMove);
//           runCellsRow.splice(i, 1);
//           cellsMoveTimes += 1;

//           continue;
//         }

//         if (cellToMove.offsetLeft < curRunCell.offsetLeft) {
//           curRunCell.style.left = `${cellToMove.offsetLeft}px`;
//           cellsMoveTimes += 1;
//         }

//         usedCells.push(cellToMove);
//       }

//       setTimeout(() => {
//         let scoreValue = 0;

//         changedCellsRow.map(({ cell, number }) => {
//           cell.classList.remove(`running-cell--${number / 2}`);
//           cell.classList.add(`running-cell--${number}`);
//           cell.innerText = number;
//           scoreValue += number;
//         });
//         cellsToRemove.map(cell => cell.remove());
//         score.innerHTML = +score.innerHTML + scoreValue;
//       }, transitionTime);
//     }
//   });

//   if (cellsMoveTimes > 0) {
//     setTimeout(() => addNumberToFreeCell(1), transitionTime);
//   }

//   setTimeout(() => setMove(), transitionTime * 1.2);
// }

// function moveUp() {
//   const cellsLefts = [10, 95, 180, 265];
//   const runningCellsArray = [...document.querySelectorAll('.running-cell')];
//   let cellsMoveTimes = 0;

//   usedCells.length = 0;

//   cellsLefts.map(cellsLeft => {
//     const runCellsRow = [...runningCellsArray]
//       .filter(runCell => runCell.offsetLeft === cellsLeft)
//       .sort((a, b) => a.offsetTop - b.offsetTop);
//     const fieldCellsRow = [...cellsArray]
//       .filter(cell => cell.offsetLeft === cellsLeft);

//     if (runCellsRow.length > 0) {
//       const changedCellsRow = [];
//       const cellsToRemove = [];

//       for (let i = 0; i < runCellsRow.length; i++) {
//         const cellToMove = fieldCellsRow[i];
//         const curRunCell = runCellsRow[i];
//         const nextRunCell = runCellsRow[i + 1];

//         if (nextRunCell !== undefined
//           && +curRunCell.innerHTML === +nextRunCell.innerHTML) {
//           changedCellsRow.push({
//             cell: nextRunCell,
//             number: (+nextRunCell.innerHTML * 2),
//           });
//           curRunCell.style.top = `${cellToMove.offsetTop}px`;
//           nextRunCell.style.top = `${cellToMove.offsetTop}px`;
//           cellsToRemove.push(curRunCell);
//           usedCells.push(cellToMove);
//           runCellsRow.splice(i, 1);
//           cellsMoveTimes += 1;

//           continue;
//         }

//         if (cellToMove.offsetTop < curRunCell.offsetTop) {
//           curRunCell.style.top = `${cellToMove.offsetTop}px`;
//           cellsMoveTimes += 1;
//         }

//         usedCells.push(cellToMove);
//       }

//       setTimeout(() => {
//         let scoreValue = 0;

//         changedCellsRow.map(({ cell, number }) => {
//           cell.classList.remove(`running-cell--${number / 2}`);
//           cell.classList.add(`running-cell--${number}`);
//           cell.innerText = number;
//           scoreValue += number;
//         });
//         cellsToRemove.map(cell => cell.remove());
//         score.innerHTML = +score.innerHTML + scoreValue;
//       }, transitionTime);
//     }
//   });

//   if (cellsMoveTimes > 0) {
//     setTimeout(() => addNumberToFreeCell(1), transitionTime);
//   }

//   setTimeout(() => setMove(), transitionTime * 1.2);
// }

// function moveRight() {
//   const cellsTops = [10, 95, 180, 265];
//   const runningCellsArray = [...document.querySelectorAll('.running-cell')];
//   let cellsMoveTimes = 0;

//   usedCells.length = 0;

//   cellsTops.map(cellsTop => {
//     const runCellsRow = [...runningCellsArray]
//       .filter(runCell => runCell.offsetTop === cellsTop)
//       .sort((a, b) => b.offsetLeft - a.offsetLeft);
//     const fieldCellsRow = [...cellsArray]
//       .filter(cell => cell.offsetTop === cellsTop)
//       .reverse();

//     if (runCellsRow.length > 0) {
//       const changedCellsRow = [];
//       const cellsToRemove = [];

//       for (let i = 0; i < runCellsRow.length; i++) {
//         const cellToMove = fieldCellsRow[i];
//         const curRunCell = runCellsRow[i];
//         const nextRunCell = runCellsRow[i + 1];

//         if (nextRunCell !== undefined
//           && +curRunCell.innerHTML === +nextRunCell.innerHTML) {
//           changedCellsRow.push({
//             cell: curRunCell,
//             number: (+curRunCell.innerHTML * 2),
//           });
//           curRunCell.style.left = `${cellToMove.offsetLeft}px`;
//           nextRunCell.style.left = `${cellToMove.offsetLeft}px`;
//           cellsToRemove.push(nextRunCell);
//           usedCells.push(cellToMove);
//           runCellsRow.splice(i + 1, 1);
//           cellsMoveTimes += 1;

//           continue;
//         }

//         if (curRunCell.offsetLeft < cellToMove.offsetLeft) {
//           curRunCell.style.left = `${cellToMove.offsetLeft}px`;
//           cellsMoveTimes += 1;
//         }

//         usedCells.push(cellToMove);
//       }

//       setTimeout(() => {
//         let scoreValue = 0;

//         changedCellsRow.map(({ cell, number }) => {
//           cell.classList.remove(`running-cell--${number / 2}`);
//           cell.classList.add(`running-cell--${number}`);
//           cell.innerText = number;
//           scoreValue += number;
//         });
//         cellsToRemove.map(cell => cell.remove());
//         score.innerHTML = +score.innerHTML + scoreValue;
//       }, transitionTime);
//     }
//   });

//   if (cellsMoveTimes > 0) {
//     setTimeout(() => addNumberToFreeCell(1), transitionTime);
//   }

//   setTimeout(() => setMove(), transitionTime * 1.2);
// }

// function moveDown() {
//   const cellsLefts = [10, 95, 180, 265];
//   const runningCellsArray = [...document.querySelectorAll('.running-cell')];
//   let cellsMoveTimes = 0;

//   usedCells.length = 0;

//   cellsLefts.map(cellsLeft => {
//     const runCellsRow = [...runningCellsArray]
//       .filter(runCell => runCell.offsetLeft === cellsLeft)
//       .sort((a, b) => b.offsetTop - a.offsetTop);
//     const fieldCellsRow = [...cellsArray]
//       .filter(cell => cell.offsetLeft === cellsLeft)
//       .reverse();

//     if (runCellsRow.length > 0) {
//       const changedCellsRow = [];
//       const cellsToRemove = [];

//       for (let i = 0; i < runCellsRow.length; i++) {
//         const cellToMove = fieldCellsRow[i];
//         const curRunCell = runCellsRow[i];
//         const nextRunCell = runCellsRow[i + 1];

//         if (nextRunCell !== undefined
//           && +curRunCell.innerHTML === +nextRunCell.innerHTML) {
//           changedCellsRow.push({
//             cell: curRunCell,
//             number: (+curRunCell.innerHTML * 2),
//           });
//           curRunCell.style.top = `${cellToMove.offsetTop}px`;
//           nextRunCell.style.top = `${cellToMove.offsetTop}px`;
//           cellsToRemove.push(nextRunCell);
//           usedCells.push(cellToMove);
//           runCellsRow.splice(i + 1, 1);
//           cellsMoveTimes += 1;

//           continue;
//         }

//         if (curRunCell.offsetTop < cellToMove.offsetTop) {
//           curRunCell.style.top = `${cellToMove.offsetTop}px`;
//           cellsMoveTimes += 1;
//         }

//         usedCells.push(cellToMove);
//       }

//       setTimeout(() => {
//         let scoreValue = 0;

//         changedCellsRow.map(({ cell, number }) => {
//           cell.classList.remove(`running-cell--${number / 2}`);
//           cell.classList.add(`running-cell--${number}`);
//           cell.innerText = number;
//           scoreValue += number;
//         });
//         cellsToRemove.map(cell => cell.remove());
//         score.innerHTML = +score.innerHTML + scoreValue;
//       }, transitionTime);
//     }
//   });

//   if (cellsMoveTimes > 0) {
//     setTimeout(() => addNumberToFreeCell(1), transitionTime);
//   }

//   setTimeout(() => setMove(), transitionTime * 1.2);
// }

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
