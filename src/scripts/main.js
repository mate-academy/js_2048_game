'use strict';

const root = document.querySelector('body');
const actionButton = root.querySelector('.button');
const gameScore = root.querySelector('.game-score');
const messageLose = root.querySelector('.message-lose');
const messageWin = root.querySelector('.message-win');
const pageLogo = root.querySelector('h1');
let isGameStarted = false;

const MULTIPLIER = 2;

pageLogo.addEventListener('click', () => {
  if (!isGameStarted) {
    return;
  }
  setCellValue(getRandomCell(), 2048);
  updateScore(2048);
  updateGameStatus();
});

actionButton.addEventListener('click', (e) => {
  const startMessage = document.querySelector('.message-start');

  isGameStarted = !isGameStarted;

  if (isGameStarted) {
    handleStart();
  } else {
    handleRestart();
  }

  e.target.classList.toggle('start', !isGameStarted);
  e.target.classList.toggle('restart', isGameStarted);
  e.target.innerText = isGameStarted ? 'Restart' : 'Start';
  startMessage.hidden = isGameStarted;
});

root.addEventListener('keydown', (e) => {
  const useKeys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  if (!useKeys.includes(e.key) || !isGameStarted) {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      calculateMove('DOWN');
      break;
    case 'ArrowUp':
      calculateMove('UP');
      break;
    case 'ArrowRight':
      calculateMove('RIGHT');
      break;
    case 'ArrowLeft':
      calculateMove('LEFT');
      break;
  }
});

function calculateMove(direction) {
  const rows = [...document.querySelectorAll('.field-row')];
  let madeMoves = true;
  let generateNewCell = false;

  let i;
  let checkConditionForI;
  let actionForI;

  // Этот свитч отвечает за внешний цикл.
  // Если движение происходит по вертикали -
  // мы перебираем столбцы слева направо,
  // внутренний цикл при этом будет перебирать ячейки внутри столбца.
  // Если движение происходит по горизонтали - мы перебираем строки сверху вниз,
  // внутренний цикл при этом будет перебирать ячейки внутри строки.
  switch (direction) {
    case 'DOWN':
      i = 0;

      checkConditionForI = function() {
        return i < rows[0].children.length;
      };

      actionForI = function() {
        i++;
      };
      break;

    case 'UP':
      i = 0;

      checkConditionForI = function() {
        return i < rows[0].children.length;
      };

      actionForI = function() {
        i++;
      };
      break;

    case 'RIGHT':
      i = 0;

      checkConditionForI = function() {
        return i < rows.length;
      };

      actionForI = function() {
        i++;
      };
      break;

    case 'LEFT':
      i = 0;

      checkConditionForI = function() {
        return i < rows.length;
      };

      actionForI = function() {
        i++;
      };
      break;
  }

  while (checkConditionForI()) {
    while (madeMoves) {
      let movesCounter = 0;
      let j;
      let checkConditionForJ;
      let actionForJ;

      // Этот свитч отвечает за внутренний цикл.
      // Здесь мы определяем в каком порядке мы перебираем ячейки
      // внутри строки или столбца

      switch (direction) {
        case 'DOWN':
          // Если движение вниз -
          // мы перебираем ячейки внутри столбца начиная с последней
          j = rows.length - 1;

          checkConditionForJ = function() {
            return j > 0;
          };

          actionForJ = function() {
            j--;
          };
          break;

        case 'UP':
          // Если движение вверх -
          // мы перебираем ячейки внутри столбца начиная с первой
          j = 0;

          checkConditionForJ = function() {
            return j < rows.length - 1;
          };

          actionForJ = function() {
            j++;
          };
          break;

        case 'RIGHT':
          // Если движение направо -
          // мы перебираем ячейки внутри строки начиная с последней
          j = rows[i].children.length - 1;

          checkConditionForJ = function() {
            return j > 0;
          };

          actionForJ = function() {
            j--;
          };
          break;

        case 'LEFT':
          // Если движение налево -
          // мы перебираем ячейки внутри строки начиная с первой
          j = 0;

          checkConditionForJ = function() {
            return j < rows[i].children.length - 1;
          };

          actionForJ = function() {
            j++;
          };
          break;
      }

      while (checkConditionForJ()) {
        let currentCell;
        let nextCell;

        // В этом свитче мы определяем какая ячейка
        // при переборе является текущей
        // а какая следующей
        switch (direction) {
          case 'DOWN':
            currentCell = rows[j].children[i];
            nextCell = rows[j - 1].children[i];
            break;
          case 'UP':
            currentCell = rows[j].children[i];
            nextCell = rows[j + 1].children[i];
            break;
          case 'RIGHT':
            currentCell = rows[i].children[j];
            nextCell = rows[i].children[j - 1];
            break;
          case 'LEFT':
            currentCell = rows[i].children[j];
            nextCell = rows[i].children[j + 1];
            break;
        }

        // Первый if отвечает за перемещение ячеек
        // Второй if отвечает за объединение ячеек
        // Я использую dataset аттрибут merged чтобы отслеживать
        // ячейки которые были объединены в течение текущего хода
        // В конце хода для всех ячеек эти значения уставливаются в 'no'
        if (currentCell.innerText === '' && nextCell.innerText !== '') {
          setCellValue(currentCell, +nextCell.innerText);
          eraseCell(nextCell);
          movesCounter++;
          generateNewCell = true;
        } else if (currentCell.innerText !== ''
         && currentCell.innerText === nextCell.innerText
         && currentCell.dataset.merged === 'no'
         && nextCell.dataset.merged === 'no') {
          const newValue = +currentCell.innerText * MULTIPLIER;

          setCellValue(currentCell, newValue);
          updateScore(newValue);
          currentCell.dataset.merged = 'yes';
          eraseCell(nextCell);
          movesCounter++;
          generateNewCell = true;
        }

        actionForJ();
      }
      madeMoves = movesCounter > 0;
    }
    madeMoves = true;
    actionForI();
  }

  if (generateNewCell) {
    setCellValue(getRandomCell(), getRandomCellValue());
  }

  resetAllMerged();

  updateGameStatus();
}

function updateGameStatus() {
  messageWin.classList.toggle('hidden', !didWin());
  messageLose.classList.toggle('hidden', hasMoves());
}

function didWin() {
  const filledCells = [...document.querySelectorAll('.field-cell')]
    .filter(cell => cell.innerText !== '');

  const index = filledCells.findIndex(cell => +cell.innerText >= 2048);

  return index >= 0;
}

function hasMoves() {
  // Эта функция возвращает true если есть свободные клетки
  // Если их нет - перебирает все клетки на поле и если у двух соседних клеток
  // находит одинаковое значение - значит есть есть ходы и возвращает true
  const emptyCells = [...document.querySelectorAll('.field-cell')]
    .filter(cell => cell.innerText === '');
  const rows = [...document.querySelectorAll('.field-row')];

  if (emptyCells.length === 0) {
    // Этот цикл перебирает столбцы слева направо
    // И внутри столбцов перебирает ячейки сверху вниз
    for (let i = 0; i < rows[0].children.length; i++) {
      for (let j = 0; j < rows.length - 1; j++) {
        const currentCell = rows[j].children[i];
        const nextCell = rows[j + 1].children[i];

        if (currentCell.innerText === nextCell.innerText) {
          return true;
        }
      }
    }

    // Этот цикл перебирает строки сверху вниз
    // И внутри строк перебирает ячейки слева направо
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[0].children.length - 1; j++) {
        const currentCell = rows[i].children[j];
        const nextCell = rows[i].children[j + 1];

        if (currentCell.innerText === nextCell.innerText) {
          return true;
        }
      }
    }
  } else {
    return true;
  }

  return false;
}

function updateScore(newValue) {
  gameScore.innerText = +gameScore.innerText + newValue;
}

function resetAllMerged() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach(cell => {
    cell.dataset.merged = 'no';
  });
}

function handleStart() {
  setCellValue(getRandomCell(), getRandomCellValue());
  setCellValue(getRandomCell(), getRandomCellValue());

  resetAllMerged();
}

function handleRestart() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach(cell => {
    eraseCell(cell);
  });
  gameScore.innerText = 0;
  messageWin.classList.toggle('hidden', true);
  messageLose.classList.toggle('hidden', true);
}

function eraseCell(cell) {
  cell.classList.remove(cell.classList[1]);
  cell.innerText = '';
}

function getRandomCell() {
  const availableCells = [...document.querySelectorAll('.field-cell')]
    .filter(cell => cell.innerText === '');
  const randomCellNumber = Math.floor(Math.random() * availableCells.length);

  return availableCells[randomCellNumber];
}

function getRandomCellValue() {
  const FIRST_VALUE = 2;
  const SECOND_VALUE = 4;
  const SECOND_VALUE_PROBABILITY = 0.1;

  return Math.random() > SECOND_VALUE_PROBABILITY ? FIRST_VALUE : SECOND_VALUE;
}

function setCellValue(cell, value) {
  const useClass = `field-cell--${value}`;

  cell.innerText = value;

  if (cell.classList.length > 1) {
    cell.classList.replace(cell.classList[1], useClass);
  } else {
    cell.classList.add(useClass);
  }
}
