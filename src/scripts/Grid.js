import Cell from './Cell.js';

export default class Grid {
  constructor(gridElement, gridSize, cellSize, cellGap, fontSize) {
    gridElement.style.setProperty('--grid-size', gridSize);
    gridElement.style.setProperty('--cell-size', `${cellSize}vmin`);
    gridElement.style.setProperty('--cell-gap', `${cellGap}vmin`);
    gridElement.style.setProperty('--font-size', `${fontSize}vmin`);

    const allCells = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement('div');

      cell.classList.add('cell');
      allCells.push(cell);
      gridElement.append(cell);
    }

    this.cells = allCells.map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % gridSize,
        Math.floor(index / gridSize)
      );
    });
  }

  get cellsByRow() {
    return this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;

      return cellGrid;
    }, []);
  }

  get cellsByColumn() {
    return this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;

      return cellGrid;
    }, []);
  }

  get emptyCells() {
    return this.cells.filter(cell => !cell.tile);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);

    return this.emptyCells[randomIndex];
  }
}
