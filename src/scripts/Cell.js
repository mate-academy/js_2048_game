export class Cell {
  static cells = [];

  constructor(coords, number = 2) {
    this.number = number;
    this.coords = {
      x: coords.x,
      y: coords.y,
    };

    Cell.cells.push(this);

    return this;
  }
}
