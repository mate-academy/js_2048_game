class Game {
  constructor(initialState = null) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'ready'; // 'playing', 'win', 'lose'
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.newCell();
    this.newCell();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'ready';
  }

  moveLeft() {
    return this.move((row) => row);
  }

  moveRight() {
    return this.move((row) => row.reverse());
  }

  moveUp() {
    this.transposeBoard();
    const hasChanged = this.moveLeft();
    this.transposeBoard();
    return hasChanged;
  }

  moveDown() {
    this.transposeBoard();
    const hasChanged = this.moveRight();
    this.transposeBoard();
    return hasChanged;
  }

  move(transformRow) {
    let hasChanged = false;
    for (let y = 0; y < 4; y++) {
      let row = transformRow(this.board[y].slice());
      const [newRow, changed] = this.combineRow(row);
      if (changed) {
        hasChanged = true;
        this.board[y] = transformRow(newRow).slice();
      }
    }
    if (hasChanged) {
      this.newCell();
      this.checkGameState();
    }
    return hasChanged;
  }

  combineRow(row) {
    let hasChanged = false;
    row = row.filter((cell) => cell !== 0);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row.splice(i + 1, 1);
        hasChanged = true;
      }
    }
    while (row.length < 4) {
      row.push(0);
    }
    return [row, hasChanged];
  }

  transposeBoard() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        newBoard[x][y] = this.board[y][x];
      }
    }
    this.board = newBoard;
  }

  newCell() {
    const emptyCells = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] === 0) {
          emptyCells.push({ y, x });
        }
      }
    }
    if (emptyCells.length === 0) return;
    const { y, x } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.board[y][x] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameState() {
    if (this.board.find((row) => row.find((el) => el === 2048))) {
      this.status = 'win';
    } else if (this.checkIfLose()) {
      this.status = 'lose';
    }
  }

  checkIfLose() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] === 0) return false;
        if (x < 3 && this.board[y][x] === this.board[y][x + 1]) return false;
        if (y < 3 && this.board[y][x] === this.board[y + 1][x]) return false;
      }
    }
    return true;
  }
}

// DOM Interactions
const game = new Game();
const button = document.querySelector(".button");
const scoreElement = document.querySelector(".game-score");
const rows = document.querySelectorAll("tr");
const messageStart = document.querySelector(".message-start");
const messageLose = document.querySelector(".message-lose");
const messageWin = document.querySelector(".message-win");

button.addEventListener("click", () => {
  if (game.getStatus() === "ready") {
    game.start();
    drawBoard();
    button.innerHTML = "Restart";
  } else {
    game.restart();
    drawBoard();
    messageStart.classList.remove("hidden");
    messageWin.classList.add("hidden");
    messageLose.classList.add("hidden");
    button.innerHTML = "Start";
  }
});

document.addEventListener("keydown", (eventKey) => {
  let moved = false;
  if (game.getStatus() === "playing") {
    switch (eventKey.key) {
      case "ArrowUp":
        moved = game.moveUp();
        break;
      case "ArrowDown":
        moved = game.moveDown();
        break;
      case "ArrowLeft":
        moved = game.moveLeft();
        break;
      case "ArrowRight":
        moved = game.moveRight();
        break;
    }

    if (moved) {
      drawBoard();
      updateMessages();
    }
  }
});

function drawBoard() {
  scoreElement.innerHTML = game.getScore();
  const board = game.getState();
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const cell = rows[y].cells[x];
      if (board[y][x] === 0) {
        cell.innerHTML = "";
      } else {
        cell.innerHTML = `<div class="field-cell-num field-cell--${board[y][x]}">${board[y][x]}</div>`;
      }
    }
  }
}

function updateMessages() {
  const status = game.getStatus();
  if (status === "win") {
    messageWin.classList.remove("hidden");
  } else if (status === "lose") {
    messageLose.classList.remove("hidden");
  }
}
