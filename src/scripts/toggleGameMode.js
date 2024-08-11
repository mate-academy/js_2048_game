import { TYPES_MODE } from '../constants';
import { capitalize } from '../utils';

const toggleGameMode = (game, button) => {
  if (button.classList.contains(TYPES_MODE.start)) {
    game.start();
    button.classList.remove(TYPES_MODE.start);
    button.classList.add(TYPES_MODE.restart);
    button.textContent = capitalize(TYPES_MODE.restart);
  } else {
    button.classList.add(TYPES_MODE.start);
    button.classList.remove(TYPES_MODE.restart);
    button.textContent = capitalize(TYPES_MODE.start);
    game.restart();
  }
};

export default toggleGameMode;
