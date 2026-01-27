export const startButton = document.querySelector('.button.start');
export const startMessage = document.querySelector('.message-start');
export const tableBody = document.querySelector('tbody');
export const looseMessage = document.querySelector('.message-lose');
export const winMessage = document.querySelector('.message-win');
export const gameScore = document.querySelector('.game-score');

export function setCells(boardCoords, className = 'field-cell', text = '') {
  for (let i = 0; i < boardCoords.length; i++) {
    for (let j = 0; j < boardCoords[i].length; j++) {
      tableBody.rows[i].cells[j].classList = className;
      tableBody.rows[i].cells[j].textContent = text;

      if (boardCoords[i][j] !== 0) {
        tableBody.rows[i].cells[j].textContent = boardCoords[i][j].toString();

        tableBody.rows[i].cells[j].classList.add(
          `field-cell--${boardCoords[i][j]}`,
        );
      }
    }
  }
}
