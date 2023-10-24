
import { board, table, messageStart, messageLose } from '../main';

export const checkLose = () => {
  if (!board.some(tr => tr.includes(0))) {
    const posibleMove = board.some(tr => {
      for (let i = 1; i < tr.length; i++) {
        if (tr[i] === tr[i - 1]) {
          return true;
        }
      }
    });

    if (posibleMove) {
      return;
    }

    for (let col = 0; col < board[0].length; col++) {
      for (let row = 1; row < board.length; row++) {
        if (board[row][col] === board[row - 1][col]) {
          return;
        }
      }
    }

    table.style.opacity = 0.5;
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
  }
};
