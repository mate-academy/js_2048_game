import { cells } from '../variables.js'

export class Cell {
  constructor(index, currentNumber = 0){
    this.currentNumber = currentNumber;
    this.htmlElement = cells[index];
  }

  setNumber(number) {
    this.htmlElement.classList.remove(`field-cell--${this.currentNumber}`);
    this.currentNumber = number;
    this.htmlElement.classList.add(`field-cell--${this.currentNumber}`);

    return this;
  }
}
