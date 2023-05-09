"use strict";

const grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;

const startButton = document.querySelector(".start");
let started = false;

startButton.addEventListener("click", () => {
  if (startButton.classList.contains("start")) {
    started = true;

    startButton.classList.remove("start");
    startButton.classList.add("restart");
    startButton.textContent = "Restart";

    const messages = document.querySelectorAll(".message");

    for (const message of messages) {
      message.classList.add("hidden");
    }

    score = 0;
    grid.map((innerArray) => innerArray.fill(0));
    generateTile();
    generateTile();
    render();
  } else if (startButton.classList.contains("restart")) {
    score = 0;
    grid.map((innerArray) => innerArray.fill(0));
    generateTile();
    generateTile();
    render();
  }
});

const scoreCount = document.querySelector(".game-score");

const gameField = document.querySelector(".game-field");

const generateTile = () => {
  if (grid.some((innerArray) => innerArray.includes(0))) {
    const value = Math.floor(Math.random() * 2) * 2 + 2;
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (grid[row][col] === 0) {
      grid[row][col] = value;
    } else {
      generateTile();
    }
  } else {
  }
};

const render = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = gameField.rows[i].cells[j];
      const value = grid[i][j];

      if (value === 0) {
        cell.textContent = "";
        cell.className = "field-cell";
      } else {
        cell.textContent = value;
        cell.className = `field-cell field-cell--appear field-cell--${value}`;
      }
    }
  }

  scoreCount.innerText = score;
};

const isMovePossible = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        return true;
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i < 3 && grid[i][j] === grid[i + 1][j]) {
        return true;
      }

      if (j < 3 && grid[i][j] === grid[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
};

const moveUp = () => {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== 0) {
        let k = i;

        while (k > 0 && grid[k - 1][j] === 0) {
          grid[k - 1][j] = grid[k][j];
          grid[k][j] = 0;

          if (k > 1) {
            k--;
          }
        }

        if (grid[k - 1][j] === grid[k][j]) {
          grid[k - 1][j] *= 2;
          grid[k][j] = 0;

          score += grid[k - 1][j];
        }
      }
    }
  }
};

const moveDown = () => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== 0) {
        let k = i;

        while (k < 3 && grid[k + 1][j] === 0) {
          grid[k + 1][j] = grid[k][j];
          grid[k][j] = 0;

          if (k < 2) {
            k++;
          }
        }

        if (grid[k + 1][j] === grid[k][j]) {
          grid[k + 1][j] *= 2;
          grid[k][j] = 0;

          score += grid[k + 1][j];
        }
      }
    }
  }
};

const moveRight = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] !== 0) {
        let k = j;

        while (k < 3 && grid[i][k + 1] === 0) {
          grid[i][k + 1] = grid[i][k];
          grid[i][j] = 0;

          if (k < 2) {
            k++;
          }
        }

        if (grid[i][k + 1] === grid[i][k]) {
          grid[i][k + 1] *= 2;
          grid[i][k] = 0;

          score += grid[i][k + 1];
        }
      }
    }
  }
};

const moveLeft = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== 0) {
        let k = j;

        while (grid[i][k - 1] === 0 && k > 0) {
          grid[i][k - 1] = grid[i][k];
          grid[i][k] = 0;

          if (k > 1) {
            k--;
          }
        }

        if (grid[i][k - 1] === grid[i][k]) {
          grid[i][k - 1] *= 2;
          grid[i][k] = 0;

          score += grid[i][k];
        }
      }
    }
  }
};

document.addEventListener("keyup", (click) => {
  if (isMovePossible() && started) {
    if (click.key === "ArrowUp") {
      moveUp();
    } else if (click.key === "ArrowDown") {
      moveDown();
    } else if (click.key === "ArrowLeft") {
      moveLeft();
    } else if (click.key === "ArrowRight") {
      moveRight();
    }
    generateTile();
    render();
  }

  if (!isMovePossible()) {
    document.querySelector(".message-lose").classList.remove("hidden");
    startButton.classList.add("start");
    startButton.classList.remove("restart");
    startButton.innerText = "Start";
  }

  if (grid.some((innerArray) => innerArray.includes(2048))) {
    document.querySelector(".message-win").classList.remove("hidden");
    startButton.classList.add("start");
    startButton.classList.remove("restart");
    startButton.innerText = "Start";
  }
});
