'use strict';

const CELL_CLASS = 'field-cell';

export class BoardView {
  constructor(root) {
    this.rows = [...root.querySelectorAll('.field-row')];
  }

  render(state) {
    state.forEach((row, rowIndex) => {
      const cells = this.rows[rowIndex].children;

      row.forEach((value, cellIndex) => {
        this.renderCell(cells[cellIndex], value);
      });
    });
  }

  renderCell(cell, value) {
    cell.className = CELL_CLASS;
    cell.textContent = '';

    if (value !== 0) {
      cell.classList.add(`${CELL_CLASS}--${value}`);
      cell.textContent = value;
    }
  }
}
