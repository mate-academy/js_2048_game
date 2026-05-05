"use strict";

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = "idle";

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = "playing";

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const empty = [];

    this.board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) {
          empty.push([r, c]);
        }
      });
    });

    if (!empty.length) {
      return;
    }

    const [randomRow, randomCol] =
      empty[Math.floor(Math.random() * empty.length)];

    this.board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
  }

  processRow(row) {
    let filtered = row.filter((n) => n !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((n) => n !== 0);

    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return filtered;
  }

  moveLeft() {
    const old = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.processRow(row));

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveRight() {
    const old = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      return this.processRow([...row].reverse()).reverse();
    });

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveUp() {
    const old = JSON.stringify(this.board);

    this.transpose();
    this.board = this.board.map((row) => this.processRow(row));
    this.transpose();

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveDown() {
    const old = JSON.stringify(this.board);

    this.transpose();

    this.board = this.board.map((row) => {
      return this.processRow([...row].reverse()).reverse();
    });

    this.transpose();

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  transpose() {
    this.board = this.board[0].map((_, col) => {
      return this.board.map((row) => row[col]);
    });
  }

  checkGameState() {
    if (this.board.flat().includes(2048)) {
      this.status = "win";

      return;
    }

    this.status = this.canMove() ? "playing" : "lose";
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

// ---------------- UI ----------------

const game = new Game();

const cells = Array.from(document.querySelectorAll(".field-cell"));
const scoreEl = document.querySelector(".game-score");
const button = document.querySelector(".button");

const messageStart = document.querySelector(".message-start");
const messageWin = document.querySelector(".message-win");
const messageLose = document.querySelector(".message-lose");

function render() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.textContent = value || "";
    cell.className = "field-cell";

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  messageWin.classList.add("hidden");
  messageLose.classList.add("hidden");

  if (game.getStatus() === "win") {
    messageWin.classList.remove("hidden");
  }

  if (game.getStatus() === "lose") {
    messageLose.classList.remove("hidden");
  }
}

button.addEventListener("click", () => {
  if (button.classList.contains("start")) {
    game.start();
    button.classList.remove("start");
    button.classList.add("restart");
    button.textContent = "Restart";
    messageStart.classList.add("hidden");
  } else {
    game.restart();
  }

  render();
});

document.addEventListener("keydown", (e) => {
  if (game.getStatus() !== "playing") {
    return;
  }

  if (e.key === "ArrowLeft") {
    game.moveLeft();
  }

  if (e.key === "ArrowRight") {
    game.moveRight();
  }

  if (e.key === "ArrowUp") {
    game.moveUp();
  }

  if (e.key === "ArrowDown") {
    game.moveDown();
  }

  render();
});
