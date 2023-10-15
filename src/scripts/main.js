import { Tile } from './tile.js';

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const gameControlsBlock = document.querySelector('.controls');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function keydownFunction(e) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';

      messageStart.classList.add('hidden');
    }
  }

  let isCellMoved = false;

  let score = 0;

  switch (e.key) {
    case 'ArrowLeft':
      for (let i = 0; i < 4; i++) {
        const merged = [];

        for (let j = 0; j < 4; j++) {
          if (Tile.tilesMatrix[i][j - 1] === null && Tile.tilesMatrix[i][j]) {
            Tile.tilesMatrix[i][j].moveTileTo(j - 1, i);

            isCellMoved = true;
            j = 0;
            continue;
          }

          if (Tile.tilesMatrix[i][j - 1] && Tile.tilesMatrix[i][j]) {
            if (Tile.tilesMatrix[i][j - 1].value
              === Tile.tilesMatrix[i][j].value
              && !merged.includes(Tile.tilesMatrix[i][j])
              && !merged.includes(Tile.tilesMatrix[i][j - 1])) {
              score += Tile.tilesMatrix[i][j - 1]
                .mergeTiles(Tile.tilesMatrix[i][j]);
              isCellMoved = true;

              merged.push(Tile.tilesMatrix[i][j - 1]);
            }
          }
        }
      }

      if (isCellMoved) {
        Tile.initNewTile();
      }
      break;
    case 'ArrowRight':
      for (let i = 0; i < 4; i++) {
        const merged = [];

        for (let j = 2; j >= 0; j--) {
          if (Tile.tilesMatrix[i][j + 1] === null && Tile.tilesMatrix[i][j]) {
            Tile.tilesMatrix[i][j].moveTileTo(j + 1, i);

            isCellMoved = true;
            j = 4;
            continue;
          }

          if (Tile.tilesMatrix[i][j + 1] && Tile.tilesMatrix[i][j]) {
            if (Tile.tilesMatrix[i][j + 1].value
              === Tile.tilesMatrix[i][j].value
              && !merged.includes(Tile.tilesMatrix[i][j])
              && !merged.includes(Tile.tilesMatrix[i][j + 1])) {
              score += Tile.tilesMatrix[i][j + 1]
                .mergeTiles(Tile.tilesMatrix[i][j]);
              isCellMoved = true;

              merged.push(Tile.tilesMatrix[i][j + 1]);
            }
          }
        }
      }

      if (isCellMoved) {
        Tile.initNewTile();
      }
      break;
    case 'ArrowUp':
      for (let i = 0; i < 4; i++) {
        const merged = [];

        for (let j = 1; j < 4; j++) {
          if (Tile.tilesMatrix[j - 1][i] === null && Tile.tilesMatrix[j][i]) {
            Tile.tilesMatrix[j][i].moveTileTo(i, j - 1);

            isCellMoved = true;
            j = 0;
            continue;
          }

          if (Tile.tilesMatrix[j - 1][i] && Tile.tilesMatrix[j][i]) {
            if (Tile.tilesMatrix[j - 1][i].value
              === Tile.tilesMatrix[j][i].value
              && !merged.includes(Tile.tilesMatrix[j - 1][i])
              && !merged.includes(Tile.tilesMatrix[j][i])) {
              score += Tile.tilesMatrix[j - 1][i]
                .mergeTiles(Tile.tilesMatrix[j][i]);
              isCellMoved = true;

              merged.push(Tile.tilesMatrix[j - 1][i]);
            }
          }
        }
      }

      if (isCellMoved) {
        Tile.initNewTile();
      }
      break;
    case 'ArrowDown':
      for (let i = 0; i < 4; i++) {
        const merged = [];

        for (let j = 2; j >= 0; j--) {
          if (Tile.tilesMatrix[j + 1][i] === null && Tile.tilesMatrix[j][i]) {
            Tile.tilesMatrix[j][i].moveTileTo(i, j + 1);

            isCellMoved = true;
            j = 3;
            continue;
          }

          if (Tile.tilesMatrix[j + 1][i] && Tile.tilesMatrix[j][i]) {
            if (Tile.tilesMatrix[j + 1][i].value
              === Tile.tilesMatrix[j][i].value
              && !merged.includes(Tile.tilesMatrix[j + 1][i])
              && !merged.includes(Tile.tilesMatrix[j][i])) {
              score += Tile.tilesMatrix[j + 1][i]
                .mergeTiles(Tile.tilesMatrix[j][i]);
              isCellMoved = true;

              merged.push(Tile.tilesMatrix[j + 1][i]);
            }
          }
        }
      }

      if (isCellMoved) {
        Tile.initNewTile();
      }
      break;
  }

  if (score !== 0) {
    gameScore.textContent = +gameScore.textContent + score;

    const gameScoreIndicator = document.createElement('span');

    gameControlsBlock.append(gameScoreIndicator);

    gameScoreIndicator.textContent = `+${score}`;
    gameScoreIndicator.classList.add('game-score-add');

    setTimeout(() => {
      gameScoreIndicator.remove();
    }, 1000);
  }
}

function buttonClickFunction() {
  if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    messageStart.classList.remove('hidden');
  }

  Tile.clearField();
  gameScore.textContent = '0';

  Tile.initNewTile();
  Tile.initNewTile();
}

window.onload = () => {
  buttonClickFunction();

  let touchStartX, touchStartY;
  let touchEndX, touchEndY;

  const elementToSwipe = document.body;

  elementToSwipe.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  elementToSwipe.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const swipeThreshold = 50;

    const swipeDistanceX = touchStartX - touchEndX;
    const swipeDistanceY = touchStartY - touchEndY;

    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
      if (swipeDistanceX > swipeThreshold) {
        simulateArrowKeyPress('ArrowLeft');
      } else if (swipeDistanceX < -swipeThreshold) {
        simulateArrowKeyPress('ArrowRight');
      }
    } else {
      if (swipeDistanceY > swipeThreshold) {
        simulateArrowKeyPress('ArrowUp');
      } else if (swipeDistanceY < -swipeThreshold) {
        simulateArrowKeyPress('ArrowDown');
      }
    }
  });
};

function simulateArrowKeyPress(arrowKey) {
  const arrowEvent = new Event('keydown');

  arrowEvent.key = arrowKey;
  keydownFunction(arrowEvent);
}

window.addEventListener('keydown', keydownFunction);
button.addEventListener('click', buttonClickFunction);
