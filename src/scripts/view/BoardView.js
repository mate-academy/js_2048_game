import { CSS_CLASSES, GAME_STATUS } from '../constants';

export class BoardView {
  constructor(container, scoreElement, messages) {
    this.cells = Array.from(container.querySelectorAll('.field-cell'));
    this.scoreElement = scoreElement;
    this.messages = messages;
  }

  render(state, score, statusGame) {
    this.scoreElement.textContent = score;

    const flatState = state.flat();

    this.cells.forEach((cell, index) => {
      const value = flatState[index];

      cell.className = CSS_CLASSES.CELL;
      cell.textContent = value === 0 ? '' : value;

      if (value > 0) {
        cell.classList.add(CSS_CLASSES.MODIFIER_PREFIX + value);
      }
    });

    this.updateMessages(statusGame);
  }

  updateMessages(statusGame) {
    Object.values(this.messages).forEach((el) => {
      el.classList.add(CSS_CLASSES.HIDDEN);
    });

    if (statusGame === GAME_STATUS.PLAYING) {
      return;
    }

    const messageToShow = this.messages[statusGame];

    if (messageToShow) {
      messageToShow.classList.remove(CSS_CLASSES.HIDDEN);
    }
  }
}
