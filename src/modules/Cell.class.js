export default class Cell {
  /**
   * @param {{x: number, y: number}} position
   * @param {number} value
   * */
  constructor(position, value) {
    this.element = document.createElement('div');
    this.element.classList.add('game-board__cell');
    this.setInitialValue(value);
    this.setPosition(position);
  }

  setValue(value) {
    this.element.classList.remove('game-board__cell--' + this.value);
    this.element.classList.add('game-board__cell--' + value);
    this.element.textContent = value;
    this.value = value;

    this.element.classList.remove('game-board__cell--merge');
    void this.element.offsetWidth;
    this.element.classList.add('game-board__cell--merge');
  }

  setInitialValue(value) {
    this.element.classList.remove('game-board__cell--' + this.value);
    this.element.classList.add('game-board__cell--' + value);
    this.element.textContent = value;
    this.value = value;
  }

  /** @param {{x: number, y: number}} position */
  setPosition(position) {
    this.element.style.setProperty('--position-x', position.x);
    this.element.style.setProperty('--position-y', position.y);
    this.position = position;
  }

  /** @return {{x: number, y: number}} */
  getPosition() {
    return this.position;
  }
}
