'use strict';

const handleAction = (actionKey, field, gameScore) => {
  let addedScore = 0;

  switch (actionKey) {
    case 'ArrowUp':
      for (let row = 0; row < field.length; row++) {
        for (let col = 0; col < field[row].length; col++) {
          const currentCell = field[row][col];

          for (let i = row + 1; i < field.length; i++) {
            const comparedCell = field[i][col];

            if (comparedCell.textContent) {
              if (!currentCell.textContent) {
                currentCell.textContent = comparedCell.textContent;
                comparedCell.textContent = '';
              } else if (currentCell.textContent === comparedCell.textContent) {
                addedScore += (+currentCell.textContent) * 2;

                currentCell.textContent = `${+currentCell.textContent
                + (+comparedCell.textContent)}`;
                comparedCell.textContent = '';

                break;
              } else {
                break;
              }
            }
          }
        }
      }

      break;

    case 'ArrowDown':
      for (let row = field.length - 1; row >= 0; row--) {
        for (let col = 0; col < field[row].length; col++) {
          const currentCell = field[row][col];

          for (let i = row - 1; i >= 0; i--) {
            const comparedCell = field[i][col];

            if (comparedCell.textContent) {
              if (!currentCell.textContent) {
                currentCell.textContent = comparedCell.textContent;
                comparedCell.textContent = '';
              } else if (currentCell.textContent === comparedCell.textContent) {
                addedScore += (+currentCell.textContent) * 2;

                currentCell.textContent = `${+currentCell.textContent
                + (+comparedCell.textContent)}`;
                comparedCell.textContent = '';

                break;
              } else {
                break;
              }
            }
          }
        }
      }

      break;

    case 'ArrowLeft':
      for (let col = 0; col < field.length; col++) {
        for (let row = 0; row < field.length; row++) {
          const currentCell = field[row][col];

          for (let i = col + 1; i < field.length; i++) {
            const comparedCell = field[row][i];

            if (comparedCell.textContent) {
              if (!currentCell.textContent) {
                currentCell.textContent = comparedCell.textContent;
                comparedCell.textContent = '';
              } else if (currentCell.textContent === comparedCell.textContent) {
                addedScore += (+currentCell.textContent) * 2;

                currentCell.textContent = `${+currentCell.textContent
                + (+comparedCell.textContent)}`;
                comparedCell.textContent = '';

                break;
              } else {
                break;
              }
            }
          }
        }
      }

      break;

    case 'ArrowRight':
      for (let col = field.length - 1; col >= 0; col--) {
        for (let row = 0; row < field.length; row++) {
          const currentCell = field[row][col];

          for (let i = col - 1; i >= 0; i--) {
            const comparedCell = field[row][i];

            if (comparedCell.textContent) {
              if (!currentCell.textContent) {
                currentCell.textContent = comparedCell.textContent;
                comparedCell.textContent = '';
              } else if (currentCell.textContent === comparedCell.textContent) {
                addedScore += (+currentCell.textContent) * 2;

                currentCell.textContent = `${+currentCell.textContent
                + (+comparedCell.textContent)}`;
                comparedCell.textContent = '';

                break;
              } else {
                break;
              }
            }
          }
        }
      }

      break;

    default:
      break;
  }

  gameScore.textContent = `${((+gameScore.textContent) + addedScore)}`;
};

module.exports = { handleAction };
