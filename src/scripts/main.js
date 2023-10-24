'use strict';

document.addEventListener('DOMContentLoaded', function() {
  const gridSize = 4;
  let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  let score = 0;

  function updateGrid() {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = document.getElementById(`cell-${i}-${j}`);

        cell.innerText = grid[i][j] !== 0 ? grid[i][j] : '';
        cell.className = `field-cell field-cell--${grid[i][j]}`;
      }
    }
    document.getElementById('score').innerText = score;
  }

  function generateRandomNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  function addRandomNumber() {
    const emptyCells = [];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({
            i, j,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell
        = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      grid[randomCell.i][randomCell.j] = generateRandomNumber();
    }
  }

  function isGameOver() {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === 0) {
          return false;
        }

        if ((i + 1 < gridSize && grid[i][j] === grid[i + 1][j])
          || (j + 1 < gridSize && grid[i][j] === grid[i][j + 1])) {
          return false;
        }
      }
    }

    return true;
  }

  function checkWin() {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  function move(direction) {
    let moved = false;
    const merged = Array.from({ length: gridSize },
      () => Array(gridSize).fill(false));

    function moveCell(i, j, di, dj) {
      while (i + di >= 0 && i + di < gridSize
          && j + dj >= 0 && j + dj < gridSize) {
        if (grid[i + di][j + dj] === 0) {
          grid[i + di][j + dj] = grid[i][j];
          grid[i][j] = 0;
          // eslint-disable-next-line
          i += di;
          // eslint-disable-next-line
          j += dj;
          moved = true;
        } else if (grid[i + di][j + dj] === grid[i][j]
            && !merged[i + di][j + dj] && !merged[i][j]) {
          grid[i + di][j + dj] *= 2;
          score += grid[i + di][j + dj];
          grid[i][j] = 0;
          merged[i + di][j + dj] = true;
          moved = true;
          break;
        } else {
          break;
        }
      }
    }

    if (direction === 'up') {
      for (let j = 0; j < gridSize; j++) {
        for (let i = 1; i < gridSize; i++) {
          if (grid[i][j] !== 0) {
            moveCell(i, j, -1, 0);
          }
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < gridSize; j++) {
        for (let i = gridSize - 2; i >= 0; i--) {
          if (grid[i][j] !== 0) {
            moveCell(i, j, 1, 0);
          }
        }
      }
    } else if (direction === 'left') {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 1; j < gridSize; j++) {
          if (grid[i][j] !== 0) {
            moveCell(i, j, 0, -1);
          }
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < gridSize; i++) {
        for (let j = gridSize - 2; j >= 0; j--) {
          if (grid[i][j] !== 0) {
            moveCell(i, j, 0, 1);
          }
        }
      }
    }

    if (moved) {
      addRandomNumber();
      updateGrid();

      if (checkWin()) {
        alert('Congratulations! You won!');
        document.getElementById('win-message').classList.remove('hidden');
      } else if (isGameOver()) {
        document.getElementById('game-over-message').classList.remove('hidden');
      }
    }
  }

  document.getElementById('start').addEventListener('click', function() {
    document.getElementById('start-message').classList.add('hidden');
    document.getElementById('start').classList.add('hidden');
    document.getElementById('restart').classList.remove('hidden');
    addRandomNumber();
    updateGrid();
  });

  document.getElementById('restart').addEventListener('click', function() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    score = 0;
    document.getElementById('win-message').classList.add('hidden');
    document.getElementById('game-over-message').classList.add('hidden');
    addRandomNumber();
    updateGrid();
  });

  document.addEventListener('keydown', function(e) {
    if (event.key === 'ArrowUp') {
      move('up');
    } else if (event.key === 'ArrowDown') {
      move('down');
    } else if (event.key === 'ArrowLeft') {
      move('left');
    } else if (event.key === 'ArrowRight') {
      move('right');
    }
  });
});
