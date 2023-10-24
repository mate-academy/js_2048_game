
import { moveCell } from './moveCell';
import { quantityRows, quantityCols, board, trs } from '../main';

export const realizeAlgorithmBy = (
  firstLoopParamIsRow, secondLoopIsIncrease,
) => {
  switch (true) {
    case (firstLoopParamIsRow && secondLoopIsIncrease): {
      for (let r = 0; r <= quantityRows; r++) {
        for (let c = 0; c <= quantityCols; c++) {
          if (board[r][c] !== 0 && c !== 0) {
            for (let i = c - 1; i >= 0; i--) {
              if (trs[r][i].innerText !== '') {
                if (trs[r][i].innerText === trs[r][c].innerText
                  && !trs[r][i].classList['notAdd']) {
                  moveCell(r, c, i, true, true);
                  break;
                }

                if (c !== i + 1) {
                  moveCell(r, c, i + 1, true, false);
                }
                break;
              } else if (i === 0) {
                moveCell(r, c, i, true, false);
              }
            }
          }
        }
      }

      break;
    }

    case (firstLoopParamIsRow && !secondLoopIsIncrease): {
      for (let r = 0; r <= quantityRows; r++) {
        for (let c = quantityCols; c >= 0; c--) {
          if (board[r][c] !== 0 && c !== quantityCols) {
            for (let i = c + 1; i <= quantityCols; i++) {
              if (trs[r][i].innerText !== '') {
                if (trs[r][i].innerText === trs[r][c].innerText
                  && !trs[r][i].classList['notAdd']) {
                  moveCell(r, c, i, true, true);
                  break;
                }

                if (c !== i - 1) {
                  moveCell(r, c, i - 1, true, false);
                }
                break;
              } else if (i === quantityCols) {
                moveCell(r, c, i, true, false);
              }
            }
          }
        }
      }

      break;
    }

    case (!firstLoopParamIsRow && secondLoopIsIncrease): {
      for (let c = 0; c <= quantityCols; c++) {
        for (let r = 0; r <= quantityRows; r++) {
          if (board[r][c] !== 0 && r !== 0) {
            for (let i = r - 1; i >= 0; i--) {
              if (trs[i][c].innerText !== '') {
                if (trs[i][c].innerText === trs[r][c].innerText
                  && !trs[i][c].classList['notAdd']) {
                  moveCell(c, r, i, false, true);
                  break;
                }

                if (r !== i + 1) {
                  moveCell(c, r, i + 1, false, false);
                }
                break;
              } else if (i === 0) {
                moveCell(c, r, i, false, false);
              }
            }
          }
        }
      }

      break;
    }

    case (!firstLoopParamIsRow && !secondLoopIsIncrease): {
      for (let c = 0; c <= quantityCols; c++) {
        for (let r = quantityRows; r >= 0; r--) {
          if (board[r][c] !== 0 && r !== quantityRows) {
            for (let i = r + 1; i <= quantityRows; i++) {
              if (trs[i][c].innerText !== '') {
                if (trs[i][c].innerText === trs[r][c].innerText
                  && !trs[i][c].classList['notAdd']) {
                  moveCell(c, r, i, false, true);
                  break;
                }

                if (r !== i - 1) {
                  moveCell(c, r, i - 1, false, false);
                }
                break;
              } else if (i === quantityRows) {
                moveCell(c, r, i, false, false);
              }
            }
          }
        }
      }

      break;
    }

    default:
  }
};
