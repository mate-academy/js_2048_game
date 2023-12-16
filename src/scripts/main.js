'use strict';

const start = document.querySelector('.start');
const rows = document.querySelectorAll('.field-row');
const gameScoreField = document.querySelector('.game-score');
const messages = document.querySelectorAll('.message');
let tempRowIndex = Math.floor(Math.random() * 4);
let tempColIndex = Math.floor(Math.random() * 4);
const gameSize = 4;
let splitCounter = 0;
let gameScore = 0;
const game = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];

start.addEventListener('click', e => {
  for (let row = 0; row < game.length; row++) {
    for (let col = 0; col < game[row].length; col++) {
      game[row][col] = '';
      rows[row].children[col].className = '';
      rows[row].children[col].classList.add('field-cell');
      start.textContent = 'Re start';
    }
  }

  start.classList.add('restart');
  game[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;

  while (game[tempRowIndex][tempColIndex] !== '') {
    tempRowIndex = Math.floor(Math.random() * 4);
    tempColIndex = Math.floor(Math.random() * 4);
  };

  game[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;

  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[i].length; j++) {
      rows[i].children[j].textContent = game[i][j];

      if (game[i][j] !== '') {
        rows[i].children[j].classList.add(`field-cell--${game[i][j]}`);
      }
    }
  }

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].classList.contains('message-start')) {
      messages[i].classList.add('hidden');
    }

    if (messages[i].classList.contains('message-lose')) {
      messages[i].classList.add('hidden');
    }
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    game.forEach((item, mainIndex, array) => {
      const digits = item.map(element => {
        if (element === '') {
          return 0;
        } else {
          return element;
        }
      });

      digits.sort((a, b) => {
        if (a === 0 && b !== 0) {
          splitCounter++;

          return -1;
        }

        if (a !== 0 && b === 0) {
          return 1;
        }

        return 0;
      });

      for (let firstIndex = digits.length - 1; firstIndex > 0; firstIndex--) {
        if (digits[firstIndex] === digits[firstIndex - 1]
          && digits[firstIndex] !== 0) {
          digits[firstIndex] += digits[firstIndex - 1];
          gameScore += digits[firstIndex];
          digits[firstIndex - 1] = 0;
          splitCounter++;
          rows[mainIndex].children[firstIndex].textContent = digits[firstIndex];
        };

        if (digits[firstIndex] === 0) {
          digits[firstIndex] = digits[firstIndex - 1];
          digits[firstIndex - 1] = 0;
        };
      }

      for (let index = 0; index < item.length; index++) {
        if (digits[index] === 0) {
          item[index] = '';
          rows[mainIndex].children[index].textContent = item[index];
        } else {
          item[index] = digits[index];
        }
      }
    });

    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length; j++) {
        rows[i].children[j].textContent = game[i][j];
        rows[i].children[j].className = '';
        rows[i].children[j].classList.add('field-cell');

        if (game[i][j] !== '') {
          rows[i].children[j].classList.add(`field-cell--${game[i][j]}`);
        }
      }
    };
  }

  if (e.key === 'ArrowLeft') {
    game.forEach((item, mainIndex, array) => {
      const digits = item.map(element => {
        if (element === '') {
          return 0;
        } else {
          return element;
        }
      });

      digits.sort((b, a) => {
        if (a === 0 && b !== 0) {
          splitCounter++;

          return -1;
        }

        if (a !== 0 && b === 0) {
          return 1;
        }

        return 0;
      });

      // Складываем числа если они одинаковы и выводим это на поле

      for (let firstIndex = 0; firstIndex < digits.length - 1; firstIndex++) {
        if (digits[firstIndex] === digits[firstIndex + 1]
          && digits[firstIndex] !== 0) {
          digits[firstIndex] += digits[firstIndex + 1];
          gameScore += digits[firstIndex];
          digits[firstIndex + 1] = 0;
          splitCounter++;
          rows[mainIndex].children[firstIndex].textContent = digits[firstIndex];
        };

        if (digits[firstIndex] === 0) {
          digits[firstIndex] = digits[firstIndex + 1];
          digits[firstIndex + 1] = 0;
        };
      }

      for (let index = 0; index < item.length; index++) {
        if (digits[index] === 0) {
          item[index] = '';
          rows[mainIndex].children[index].textContent = item[index];
        } else {
          item[index] = digits[index];
        }
      }
    });

    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length; j++) {
        rows[i].children[j].textContent = game[i][j];
        rows[i].children[j].className = '';
        rows[i].children[j].classList.add('field-cell');

        if (game[i][j] !== '') {
          rows[i].children[j].classList.add(`field-cell--${game[i][j]}`);
        }
      }
    };
  }

  if (e.key === 'ArrowDown') {
    // перебираем все элементы массивов и заменяем все пустые строки нулями
    game.forEach(item => {
      for (let i = 0; i < item.length; i++) {
        if (item[i] === '') {
          item[i] = 0;
        }
      }
    });

    // сортируем все элементы в одном столбце

    for (let i = 0; i < gameSize; i++) {
      const tempArr = [];

      for (let j = 0; j < game.length; j++) {
        tempArr.push(game[j][i]);
      };

      tempArr.sort((a, b) => {
        if (a === 0 && b !== 0) {
          splitCounter++;

          return -1;
        }

        if (a !== 0 && b === 0) {
          return 1;
        }

        return 0;
      });

      for (let j = tempArr.length - 1; j > 0; j--) {
        if (tempArr[j] === tempArr[j - 1] && tempArr[j] !== 0) {
          tempArr[j] += tempArr[j];
          gameScore += tempArr[j];
          tempArr[j - 1] = 0;
          splitCounter++;

          tempArr.sort((a, b) => {
            if (a === 0 && b !== 0) {
              return -1;
            }

            if (a !== 0 && b === 0) {
              return 1;
            }

            return 0;
          });
        }
      }

      for (let j = 0; j < game.length; j++) {
        if (tempArr[j] === 0) {
          game[j][i] = '';
        } else {
          game[j][i] = tempArr[j];
        }
      };

      // Отрисовка поля перед добавлением новой цифры
      for (let index = 0; index < game.length; index++) {
        for (let j = 0; j < game[index].length; j++) {
          rows[index].children[j].textContent = game[index][j];
          rows[index].children[j].className = '';
          rows[index].children[j].classList.add('field-cell');

          if (game[index][j] !== '') {
            rows[index].children[j]
              .classList.add(`field-cell--${game[index][j]}`);
          }
        }
      };
    };
  };

  if (e.key === 'ArrowUp') {
    // перебираем все элементы массивов и заменяем все пустые строки нулями
    game.forEach(item => {
      for (let i = 0; i < item.length; i++) {
        if (item[i] === '') {
          item[i] = 0;
        }
      }
    });

    // сортируем все элементы в одном столбце

    for (let i = 0; i < gameSize; i++) {
      const tempArr = [];

      for (let j = 0; j < game.length; j++) {
        tempArr.push(game[j][i]);
      };

      tempArr.sort((b, a) => {
        if (a === 0 && b !== 0) {
          splitCounter++;

          return -1;
        }

        if (a !== 0 && b === 0) {
          return 1;
        }

        return 0;
      });

      for (let j = tempArr.length - 1; j > 0; j--) {
        if (tempArr[j] === tempArr[j - 1] && tempArr[j] !== 0) {
          tempArr[j] += tempArr[j];
          gameScore += tempArr[j];
          tempArr[j - 1] = 0;
          splitCounter++;

          tempArr.sort((b, a) => {
            if (a === 0 && b !== 0) {
              return -1;
            }

            if (a !== 0 && b === 0) {
              return 1;
            }

            return 0;
          });
        }
      }

      for (let j = 0; j < game.length; j++) {
        if (tempArr[j] === 0) {
          game[j][i] = '';
        } else {
          game[j][i] = tempArr[j];
        }
      };

      // Отрисовка поля перед добавлением новой цифры

      for (let index = 0; index < game.length; index++) {
        for (let j = 0; j < game[index].length; j++) {
          rows[index].children[j].textContent = game[index][j];
          rows[index].children[j].className = '';
          rows[index].children[j].classList.add('field-cell');

          if (game[index][j] !== '') {
            rows[index].children[j]
              .classList.add(`field-cell--${game[index][j]}`);
          }
        }
      };
    };
  };

  if (splitCounter === 0) {
    let checkEmpty = false;

    for (let i = 0; i < game.length; i++) {
      if (game[i].includes('')) {
        checkEmpty = true;
      }
    };

    if (!checkEmpty) {
      let checkPosibility = false;

      for (let i = 0; i < game.length; i++) {
        for (let j = 0; j < game[i].length - 1; j++) {
          if (game[i][j] === game[i][j + 1]) {
            checkPosibility = true;
          }
        }
      }

      for (let i = 0; i < game.length - 1; i++) {
        for (let j = 0; j < game[i].length; j++) {
          if (game[i][j] === game[i + 1][j]) {
            checkPosibility = true;
          }
        }
      }

      if (!checkPosibility) {
        for (let index = 0; index < messages.length; index++) {
          if (messages[index].classList.contains('message-win')) {
            messages[index].classList.add('hidden');
          }

          if (messages[index].classList.contains('message-lose')) {
            messages[index].classList.remove('hidden');
          }
        }
      };
    };
  };

  // добавляем 2 или 4 если произошли изменения

  if (splitCounter > 0) {
    while (game[tempRowIndex][tempColIndex] !== '') {
      tempRowIndex = Math.floor(Math.random() * 4);
      tempColIndex = Math.floor(Math.random() * 4);
    };

    game[tempRowIndex][tempColIndex] = Math.random() > 0.9 ? 4 : 2;

    splitCounter = 0;

    if (splitCounter === 0) {
      let checkEmpty = false;

      for (let i = 0; i < game.length; i++) {
        if (game[i].includes('')) {
          checkEmpty = true;
        }
      };

      if (!checkEmpty) {
        let checkPosibility = false;

        for (let i = 0; i < game.length; i++) {
          for (let j = 0; j < game[i].length - 1; j++) {
            if (game[i][j] === game[i][j + 1]) {
              checkPosibility = true;
            }
          }
        };

        for (let i = 0; i < game.length - 1; i++) {
          for (let j = 0; j < game[i].length; j++) {
            if (game[i][j] === game[i + 1][j]) {
              checkPosibility = true;
            }
          }
        };

        if (!checkPosibility) {
          for (let index = 0; index < messages.length; index++) {
            if (messages[index].classList.contains('message-win')) {
              messages[index].classList.add('hidden');
            }

            if (messages[index].classList.contains('message-lose')) {
              messages[index].classList.remove('hidden');
            }
          }
        };
      };
    };
  };

  gameScoreField.textContent = gameScore;

  // Отрисовка поля после изменений

  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[i].length; j++) {
      rows[i].children[j].textContent = game[i][j];

      if (game[i][j] === 2048) {
        for (let index = 0; index < messages.length; index++) {
          if (messages[index].classList.contains('message-win')) {
            messages[index].classList.remove('hidden');
          }
        }
      };

      if (game[i][j] !== '') {
        rows[i].children[j].classList.add(`field-cell--${game[i][j]}`);
      } else {
        rows[i].children[j].className = '';
        rows[i].children[j].classList.add('field-cell');
      }
    }
  };

  tempRowIndex = Math.floor(Math.random() * 4);
  tempColIndex = Math.floor(Math.random() * 4);
});
