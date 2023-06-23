'use strict';
const { tableGame, table } = require("./main");

function render() {
  for (let i = 0; i < tableGame.length; i++) {
    const row = table.rows[i];

    for (let j = 0; j < tableGame[i].length; i++) {
      const cell = row.cells[j];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (tableGame[i][j] !== 0) {
        cell.classList.add(`field-cell--${tableGame[i][j]}`);
        cell.textContent = tableGame[i][j];
      }
    }
  }
}
exports.render = render;
