/**
 *
 * @param {number[][]} state
 * @param {HTMLElement[]} HTMLCells
 */
function placeState(state, HTMLCells) {
  const FIELD_CELL_CLASSES = 'field-cell field-cell--';

  for (const y in state) {
    for (const x in state[y]) {
      const currentCell = HTMLCells[y * state.length + +x];
      const currentValue = state[y][x];

      currentCell.innerHTML = currentValue;
      currentCell.className = FIELD_CELL_CLASSES + currentValue;
    }
  }
}

module.exports = placeState;
