"use strict";
document.addEventListener("keydown", (KeyEvent) => move(KeyEvent.key));

const rows = document.querySelectorAll("tr");

const button = document.querySelector(".button");
const score = document.querySelector(".game-score");

let scoreVal = 0;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const messageStart = document.querySelector(".message-start");
const messageLose = document.querySelector(".message-lose");
const messageWin = document.querySelector(".message-win");

button.addEventListener("click", () => {
  if (button.classList.contains("start")) {
    start();
  } else {
    restart();
  }
});

function start() {
  button.innerHTML = "Restart";
  button.classList.add("restart");
  button.classList.remove("start");

  messageStart.classList.add("hidden");

  newCell();
  newCell();
  drawBoard();
}

function restart() {
  scoreVal = 0;
  button.innerHTML = "Start";
  button.classList.add("start");
  button.classList.remove("restart");

  messageWin.classList.add("hidden");
  messageLose.classList.add("hidden");
  messageStart.classList.remove("hidden");

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      board[y][x] = 0;
    }
  }
  drawBoard();
}

function move(key) {
  let canMove = false;
  if (
    messageStart.classList.contains("hidden") &&
    messageWin.classList.contains("hidden") &&
    messageLose.classList.contains("hidden")
  ) {
    if (key === "ArrowUp") {
      canMove = moveUp();
    } else if (key === "ArrowDown") {
      canMove = moveDown();
    } else if (key === "ArrowLeft") {
      canMove = moveLeft();
    } else if (key === "ArrowRight") {
      canMove = moveRight();
    }

    if (canMove) {
      setTimeout(() => {
        newCell();
        drawBoard();
        if (board.find((row) => row.find((el) => el === 2048))) {
          messageWin.classList.remove("hidden");
        }
      }, 300);
    }
  }
}

function checkIfLose() {
  let lose = true;

  if (board.find((row) => row.includes(0))) {
    lose = false;
  }

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (y < 3 && board[y][x] === board[y + 1][x]) {
        lose = false;
      }

      if (x < 3 && board[y][x] === board[y][x + 1]) {
        lose = false;
      }
    }
  }

  return lose;
}

function newCell() {
  const emptyCells = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (!board[y][x]) {
        emptyCells.push({ y: y, x: x });
      }
    }
  }

  const val = Math.floor(Math.random() * emptyCells.length);
  board[emptyCells[val].y][emptyCells[val].x] = Math.random() < 0.9 ? 2 : 4;

  if (checkIfLose()) {
    messageLose.classList.remove("hidden");
  }
}

function drawBoard() {
  score.innerHTML = scoreVal;

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (board[y][x] === 0) {
        rows[y].cells[x].innerHTML = "";
      } else {
        rows[y].cells[
          x
        ].innerHTML = `<div class="field-cell-num field-cell--${board[y][x]}">
					${board[y][x]}
					</div>`;
      }
    }
  }
}

function moveUp() {
  // Create a copy of the original board
  let hasChanged = false;
  // Track if the board state has changed

  for (let x = 0; x < 4; x++) {
    let merged = [false, false, false, false];
    // Array to track if a cell has already merged in this move

    for (let y = 1; y < 4; y++) {
      if (board[y][x] !== 0) {
        // Check if the cell is not empty
        let newY = y;
        let moveDistance = 0;
        // Variable to track the distance the cell will move

        // Move the cell up as far as possible
        while (newY > 0 && board[newY - 1][x] === 0) {
          newY--;
          moveDistance++; // Increment move distance
        }

        // Check if we can merge the cell with the one above
        if (
          newY > 0 &&
          board[newY - 1][x] === board[y][x] &&
          !merged[newY - 1]
        ) {
          // Merge the cells by doubling the value
          board[newY - 1][x] *= 2;
          scoreVal += board[newY - 1][x]; // Increase the score
          board[y][x] = 0; // Clear the original cell
          merged[newY - 1] = true; // Mark this cell as merged
          hasChanged = true;

          // Animate the move with merging (cells move to the same position)
          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-up--${moveDistance + 1}`);
            // Add a class for animation
          }
        } else if (newY !== y) {
          // If the cell moved but did not merge
          board[newY][x] = board[y][x]; // Move the cell to its new position
          board[y][x] = 0; // Clear the original position
          hasChanged = true;

          // Animate the move without merging
          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-up--${moveDistance}`);
            // Add a class for the move animation
          }
        }
      }
    }
  }

  return hasChanged; // Return whether the board changed
}

function moveDown() {
  let hasChanged = false;

  for (let x = 0; x < 4; x++) {
    let merged = [false, false, false, false];

    for (let y = 2; y >= 0; y--) {
      if (board[y][x] !== 0) {
        let newY = y;
        let moveDistance = 0;

        while (newY < 3 && board[newY + 1][x] === 0) {
          newY++;
          moveDistance++;
        }

        if (
          newY < 3 &&
          board[newY + 1][x] === board[y][x] &&
          !merged[newY + 1]
        ) {
          board[newY + 1][x] *= 2;
          scoreVal += board[newY + 1][x];
          board[y][x] = 0;
          merged[newY + 1] = true;
          hasChanged = true;

          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-down--${moveDistance + 1}`);
          }
        } else if (newY !== y) {
          board[newY][x] = board[y][x];
          board[y][x] = 0;
          hasChanged = true;

          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-down--${moveDistance}`);
          }
        }
      }
    }
  }

  return hasChanged;
}

function moveLeft() {
  let hasChanged = false;

  for (let y = 0; y < 4; y++) {
    let merged = [false, false, false, false];

    for (let x = 1; x < 4; x++) {
      if (board[y][x] !== 0) {
        let newX = x;
        let moveDistance = 0;

        while (newX > 0 && board[y][newX - 1] === 0) {
          newX--;
          moveDistance++;
        }

        if (
          newX > 0 &&
          board[y][newX - 1] === board[y][x] &&
          !merged[newX - 1]
        ) {
          board[y][newX - 1] *= 2;
          scoreVal += board[y][newX - 1];
          board[y][x] = 0;
          merged[newX - 1] = true;
          hasChanged = true;

          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-left--${moveDistance + 1}`);
          }
        } else if (newX !== x) {
          board[y][newX] = board[y][x];
          board[y][x] = 0;
          hasChanged = true;

          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-left--${moveDistance}`);
          }
        }
      }
    }
  }

  return hasChanged;
}

function moveRight() {
  let hasChanged = false;

  for (let y = 0; y < 4; y++) {
    let merged = [false, false, false, false];

    for (let x = 2; x >= 0; x--) {
      if (board[y][x] !== 0) {
        let newX = x;
        let moveDistance = 0;

        while (newX < 3 && board[y][newX + 1] === 0) {
          newX++;
          moveDistance++;
        }

        if (
          newX < 3 &&
          board[y][newX + 1] === board[y][x] &&
          !merged[newX + 1]
        ) {
          board[y][newX + 1] *= 2;
          scoreVal += board[y][newX + 1];
          board[y][x] = 0;
          merged[newX + 1] = true;
          hasChanged = true;

          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-right--${moveDistance + 1}`);
          }
        } else if (newX !== x) {
          board[y][newX] = board[y][x];
          board[y][x] = 0;
          hasChanged = true;

          const cellElement = rows[y].cells[x].firstChild;
          if (cellElement) {
            cellElement.classList.add(`move-right--${moveDistance}`);
          }
        }
      }
    }
  }

  return hasChanged;
}
