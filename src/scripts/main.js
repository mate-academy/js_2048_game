/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
'use strict';

import { Game } from "../modules/Game.class.js";

const game = new Game();
const gameField = document.querySelector(".game-field");
const scoreElement = document.querySelector(".game-score");
const startButton = document.querySelector(".button.start");
const messages = {
  lose: document.querySelector(".message-lose"),
  win: document.querySelector(".message-win"),
  start: document.querySelector(".message-start"),
};

// Render the game board
function renderBoard() {
  const state = game.getState();

  gameField.innerHTML = state
    .map(
      row =>
        `<tr class="field-row">${row
          .map(
            cell => `<td class="field-cell ${cell ? `field-cell--${cell}` : ""}">${cell || ""}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");

  scoreElement.textContent = game.getScore();
}

// Handle keypress events for movement
document.addEventListener("keydown", event => {
  if (game.getStatus() !== "playing") {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      game.moveLeft();
      break;
    case "ArrowRight":
      game.moveRight();
      break;
    case "ArrowUp":
      game.moveUp();
      break;
    case "ArrowDown":
      game.moveDown();
      break;
  }

  renderBoard();
  updateStatus();
});

// Update game status messages
function updateStatus() {
  const status = game.getStatus();

  if (status === "win") {
    messages.win.classList.remove("hidden");
  } else if (status === "lose") {
    messages.lose.classList.remove("hidden");
  } else {
    messages.win.classList.add("hidden");
    messages.lose.classList.add("hidden");
    messages.start.classList.add("hidden");
  }
}

// Handle start/restart button
startButton.addEventListener("click", () => {
  game.restart();
  renderBoard();
  updateStatus();
  startButton.textContent = "Restart";
});

// Initialize the game
game.start();
renderBoard();
