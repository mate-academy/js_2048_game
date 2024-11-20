const Game = require('./Game.class');
const game = new Game();

export function handleStartClickWrapper() {
  handleStartClick(game);
}

function handleStartClick(obj) {
  obj.start();
}

export function handleRestartClickWrapper() {
  handleRestartClick(game);
}

function handleRestartClick(obj) {
  obj.restart();
}

export function handleRightClickWrapper() {
  handleRightClick();
}

function handleRightClick() {
  game.moveRight();
}

export function handleLeftClickWrapper() {
  handleLeftClick();
}

function handleLeftClick() {
  game.moveLeft();
}

export function handleUpClickWrapper() {
  handleUpClick();
}

function handleUpClick() {
  game.moveUp();
}

export function handleDownClickWrapper() {
  handleDownClick();
}

function handleDownClick() {
  game.moveDown();
}

export const arrowHandlers = {
  ArrowRight: handleRightClickWrapper,
  ArrowLeft: handleLeftClickWrapper,
  ArrowUp: handleUpClickWrapper,
  ArrowDown: handleDownClickWrapper,
};
