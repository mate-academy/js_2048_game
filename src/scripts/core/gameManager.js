import Game from '../../modules/Game.class.js';
import { renderBoard, hideMessage } from '../ui/render.js';

export const game = new Game();

export function startGame() {
  game.start();
  renderBoard(game);
}

export function restartGame() {
  game.restart();
  game.start();
  hideMessage();
  renderBoard(game);
}
