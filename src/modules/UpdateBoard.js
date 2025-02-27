export default function updateBoard(game) {
  if (!game) {
    // eslint-disable-next-line no-console
    console.error('Game object is undefined');

    return;
  }

  const scoreElement = document.querySelector('.game-score');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  // eslint-disable-next-line no-console
  console.log(cells);

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const currentCell = cells[rowIndex * board[0].length + colIndex];

      if (currentCell) {
        currentCell.textContent = cell === 0 ? '' : cell;
        currentCell.className = 'field-cell';

        if (cell !== 0) {
          currentCell.classList.add(`tile-${cell}`);
          currentCell.classList.add(`field-cell--${cell}`);
        }

        if (cell > 2048) {
          currentCell.classList.add(`over`);
        }
      }
    });
  });

  scoreElement.textContent = game.getScore();

  if (game.isGameOver()) {
    game.status = 'lose';
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}
