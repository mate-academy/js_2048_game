export const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

export const newTiles = Array(4).fill().map(
  () => Array(4).fill(false)
);

/**
 * Initializes the game board by creating and appending rows
  and cells to the game field.
 Each cell is given a unique data attribute corresponding to its row and column.

 * @sideEffects Modifies the DOM by appending new elements.
 */

export function initializeBoard() {
  const gameField = document.querySelector('.game-field');

  // Loop through the number of rows
  for (let i = 0; i < 4; i++) {
    const row = document.createElement('div');

    row.classList.add('row');

    for (let j = 0; j < 4; j++) {
      // Create a new cell element, add the 'field-cell' class,
      // and set data attributes for row and column
      const cell = document.createElement('div');

      cell.classList.add('field-cell');
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-col', j);
      row.appendChild(cell);
    }
    gameField.appendChild(row);
  }
}

/**
 * Updates the DOM representation of the game board
    based on the current state of the 'board' variable.

 * First, it clears any existing tiles from the board.
    Then, for every non-zero value in the 'board',
    it creates and appends a corresponding tile DOM element.
 *
 * @sideEffects Modifies the DOM by removing old tiles and appending new ones.
 * Also, potentially sets a timeout for tile animations.
 */

export function updateBoardDOM() {
  clearBoardDOM();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // If the board cell contains a non-zero value,
      // create and append a tile DOM element
      if (board[i][j] !== 0) {
        const cell = document.querySelector(
          `[data-row='${i}'][data-col='${j}']`
        );
        const tile = document.createElement('div');

        tile.classList.add('tile');
        tile.classList.add(`tile--${board[i][j]}`);
        tile.textContent = board[i][j];

        // If this tile is flagged as a new tile, add the 'tile--new' class
        if (newTiles[i][j]) {
          tile.classList.add('tile--new');
        }

        cell.appendChild(tile);

        // If the tile is new,
        //  set a timeout to remove the 'new' animation class after 300ms
        if (newTiles[i][j]) {
          setTimeout(() => {
            tile.classList.remove('tile--new');
            newTiles[i][j] = false;
          }, 300);
        }
      }
    }
  }
}

/**
 * Resets the game board to its initial state, setting all of its cells to 0.
 * Also, clears the DOM representation of the board.
 *
 * @sideEffects Modifies the state of the 'board' variable
 * and has side effects on the DOM.
 */

export function resetBoard() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      board[row][col] = 0;
    }
  }

  clearBoardDOM();
}

/**
 * Clears the DOM representation of the game board.
 * It removes all child elements (tiles) from each cell
 * and resets the class of each cell to its default.
 *
 * @sideEffects Modifies the DOM by removing tiles
 * and resetting class names of the cells.
 */

export function clearBoardDOM() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.className = 'field-cell';
  });
};
