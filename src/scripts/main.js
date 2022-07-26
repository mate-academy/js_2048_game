'use strict';

const square = 4;

const root = document.querySelector('.container');
const gameBoard = document.createElement('div');
const gameCells = Array(square);

gameBoard.className = 'game-field';
root.firstElementChild.after(gameBoard);

for (let i = 0; i < square * square; i++) {
  const cell = document.createElement('div');

  cell.className = 'field-cell';
  gameBoard.append(cell);
}

for (let i = 0; i < square; i++) {
  gameCells[i] = [...gameBoard.children].slice(i * square, (i + 1) * square);
}

const cellSize = parseInt(getComputedStyle(gameBoard.firstElementChild).width);

root.style.width = square * cellSize + (square - 1) * 10 + 'px';

function generate() {
  const probability = Math.random();
  const randomNumber1 = Math.floor(Math.random() * square);
  const randomNumber2 = Math.floor(Math.random() * square);
  const cell = document.createElement('div');

  let value = 2;
  let colorClass = 'cell--2';

  if (probability <= 0.1) {
    value = 4;
    colorClass = 'cell--4';
  }

  cell.innerHTML = value;
  cell.classList.add('cell');
  cell.classList.add(colorClass);
  cell.classList.add('cell-new');
  cell.style.animationDuration = '0.3s';

  if (gameCells[randomNumber1][randomNumber2].innerHTML === '') {
    gameCells[randomNumber1][randomNumber2].append(cell);
  } else {
    generate();
  }
}

generate();
generate();

function rowMove(direction) {
  let grid = gameCells;
  let sign = '';
  let isGenerate = false;

  if (direction === 'left') {
    grid = gameCells.map(row => [...row].reverse());
    sign = '-';
  }

  for (let rowIndex = 0; rowIndex < square; rowIndex++) {
    const cells = grid[rowIndex].map(field => field.firstElementChild);
    const values = cells.map(cell => {
      if (cell !== null) {
        return cell.innerHTML;
      }

      return '';
    });

    let prevCount = 0;

    for (let i = square - 2; i >= 0; i--) {
      if (values[i] === '') {
        continue;
      }

      let count = prevCount;
      let isSimilar = false;
      let canBeSimilar = true;

      for (let j = i + 1; j < square; j++) {
        if (values[j] === '') {
          count++;
        } else if (values[j] === values[i] && canBeSimilar) {
          count++;
          prevCount++;
          isSimilar = true;
          break;
        } else {
          canBeSimilar = false;
        }
      }

      if (count > 0) {
        isGenerate = true;

        const translateSize = count * (cellSize + 10) + 'px';

        cells[i].style.transform = `translate(${sign + translateSize})`;
        cells[i].style.transition = 'transform 0.2s';
        cells[i].classList.remove('cell-new');

        setTimeout(() => {
          cells[i].style.transform = '';
          cells[i].style.transition = '';

          grid[rowIndex][i + count].append(cells[i]);

          if (isSimilar && canBeSimilar) {
            const fieldCell = grid[rowIndex][i + count];
            const value = fieldCell.firstElementChild.innerHTML * 2;

            fieldCell.firstElementChild.remove();
            fieldCell.firstElementChild.innerHTML = value;

            fieldCell.firstElementChild.classList
              .remove(`cell--${value / 2}`);
            fieldCell.firstElementChild.classList.add(`cell--${value}`);
            fieldCell.firstElementChild.classList.add('cell-new');
            fieldCell.firstElementChild.style.animationDuration = '0.1s';
          }
        }, 200);
      }
    }
  }

  if (isGenerate) {
    setTimeout(() => {
      generate();
    }, 300);
  }
}

document.addEventListener('keyup', (e) => {
  setTimeout(() => {
    switch (e.key) {
      case 'ArrowLeft':
        rowMove('left');
        break;
      case 'ArrowRight':
        rowMove('right');
        break;
    }
  }, 100);
});
