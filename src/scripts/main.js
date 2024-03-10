"use strict";

let score = 0;
let gameWon = false;
let gameOver = false;
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function initializeBoard() {
  addRandomTile();
  addRandomTile();
  score = 0;
  gameWon = false;
  gameOver = false;
  updateBoard();
  document.querySelector(".message-start").classList.add("hidden");
  document.querySelector(".button.start").textContent = "Restart";
  document.querySelector(".button.start").classList.add("restart");
}

function addRandomTile() {
  const emptyCells = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ row: r, column: c });
      }
    }
  }

  if (emptyCells.length === 0) {
    return;
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomCell.row][randomCell.column] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  const cells = document.querySelectorAll(".field-cell");

  cells.forEach((cell, index) => {
    const x = Math.floor(index / 4);
    const y = index % 4;

    cell.textContent = board[x][y] === 0 ? "" : board[x][y];
    cell.className = "field-cell";

    if (board[x][y] !== 0) {
      cell.classList.add("field-cell--" + board[x][y]);
    }
  });

  document.querySelector(".game-score").textContent = score;

  if (checkWin()) {
    gameWon = true;
    document.querySelector(".message-win").classList.remove("hidden");
  } else if (checkGameOver()) {
    gameOver = true;
    document.querySelector(".message-lose").classList.remove("hidden");
  }
}

function move(direction) {
  if (gameWon || gameOver) {
    return;
  }

  let moved = false;

  if (direction === "up") {
    moved = moveUp();
  } else if (direction === "down") {
    moved = moveDown();
  } else if (direction === "left") {
    moved = moveLeft();
  } else if (direction === "right") {
    moved = moveRight();
  }

  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function moveLeft() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 3; col > 0; col--) {
      if (board[row][col] !== 0) {
        let nextCol = col - 1;

        while (nextCol >= 0) {
          if (board[row][nextCol] === 0) {
            board[row][nextCol] = board[row][col];
            board[row][col] = 0;
            col = nextCol;
            moved = true;
          } else if (board[row][nextCol] === board[row][col]) {
            board[row][nextCol] *= 2;
            score += board[row][nextCol];
            board[row][col] = 0;
            moved = true;
            break;
          } else {
            break;
          }
          nextCol--;
        }
      }
    }
  }

  return moved;
}

function moveRight() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] !== 0) {
        let nextCol = col + 1;

        while (nextCol < 4) {
          if (board[row][nextCol] === 0) {
            board[row][nextCol] = board[row][col];
            board[row][col] = 0;
            col = nextCol - 1;
            moved = true;
          } else if (board[row][nextCol] === board[row][col]) {
            board[row][nextCol] *= 2;
            score += board[row][nextCol];
            board[row][col] = 0;
            moved = true;
            break;
          } else {
            break;
          }
          nextCol++;
        }
      }
    }
  }

  return moved;
}

function moveUp() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (board[row][col] !== 0) {
        let nextRow = row - 1;

        while (nextRow >= 0) {
          if (board[nextRow][col] === 0) {
            board[nextRow][col] = board[row][col];
            board[row][col] = 0;
            row = nextRow;
            moved = true;
          } else if (board[nextRow][col] === board[row][col]) {
            board[nextRow][col] *= 2;
            score += board[nextRow][col];
            board[row][col] = 0;
            moved = true;
            break;
          } else {
            break;
          }
          nextRow--;
        }
      }
    }
  }

  return moved;
}

function moveDown() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (board[row][col] !== 0) {
        let nextRow = row + 1;

        while (nextRow < 4) {
          if (board[nextRow][col] === 0) {
            board[nextRow][col] = board[row][col];
            board[row][col] = 0;
            row = nextRow;
            moved = true;
          } else if (board[nextRow][col] === board[row][col]) {
            board[nextRow][col] *= 2;
            score += board[nextRow][col];
            board[row][col] = 0;
            moved = true;
            break;
          } else {
            break;
          }
          nextRow++;
        }
      }
    }
  }

  return moved;
}

function checkWin() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function checkGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        return false;
      }

      if (
        (r < 3 && board[r][c] === board[r + 1][c]) ||
        (c < 3 && board[r][c] === board[r][c + 1])
      ) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener("keydown", function (typeOfEvent) {
  if (typeOfEvent.key === "ArrowUp") {
    move("up");
  } else if (typeOfEvent.key === "ArrowDown") {
    move("down");
  } else if (typeOfEvent.key === "ArrowLeft") {
    move("left");
  } else if (typeOfEvent.key === "ArrowRight") {
    move("right");
  }
});

document.querySelector(".button.start").addEventListener("click", function () {
  let flag = false;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] !== 0) {
        flag = true;
        break;
      }
    }
  }

  if (flag === true) {
    if (gameOver || gameWon) {
      restart();
    } else {
      const message = `Are you sure you want to
      start a new game? All progress will be lost.`;

      alert(message);
      restart();
    }
  } else {
    initializeBoard();
  }
});

function restart() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      board[r][c] = 0;
    }
  }

  score = 0;
  gameWon = false;
  gameOver = false;

  document.querySelector(".message-lose").classList.add("hidden");
  document.querySelector(".message-win").classList.add("hidden");

  initializeBoard();
}
