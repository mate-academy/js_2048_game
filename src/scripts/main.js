
import PlayingField from './playinfField';
window.PlayingField = PlayingField;

const playingField = new PlayingField();

function startGame() {
  playingField.field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  playingField.score = 0;
  playingField.start();
  draw();
  document.querySelector('.message.message-lose').classList.add('hidden');
  document.querySelector('.message.message-win').classList.add('hidden');
  document.querySelector('.start').classList.add('hidden');
  document.querySelector('.restart').classList.remove('hidden');
}

document.querySelector('.start').addEventListener('click', function() {
  document.querySelector('.message.message-start').classList.add('hidden');

  startGame();
});

document.querySelector('.message.message-lose').addEventListener('click', function() {
  startGame();
});

document.querySelector('.restart').addEventListener('click', function() {
  startGame();
});

const gameKeys = function(occurrent) {
  const loseMessage = document.querySelector('.message.message-lose');
  const winMassage = document.querySelector('.message.message-win');

  if (loseMessage && !(loseMessage.classList.contains('hidden'))) {
      return;
  }

  if (winMassage && !(winMassage.classList.contains('hidden'))) {
      return;
  } else {
    switch (occurrent.key) {
      case 'ArrowUp':
        playingField.up();
        draw();
        break;
      case 'ArrowDown':
        playingField.down();
        draw();
        break;
      case 'ArrowRight':
        try {
          playingField.right();
        } catch (e) {}
        draw();
        break;
      case 'ArrowLeft':
        try {
          playingField.left();
        } catch (el) {}
        draw();
        break;
      default:
        break;
    }
  }
};

document.addEventListener('keydown', gameKeys);

function draw() {
  const fieldCeils = document.querySelectorAll('.field-cell');

  playingField.field.flat().forEach((el, index) => {
    if (el === 0) {
      fieldCeils[index].textContent = '';
      fieldCeils[index].classList = ['field-cell'];
    } else {
      fieldCeils[index].textContent = el;
      fieldCeils[index].classList = [`field-cell field-cell--${el}`];
    }
  });

  loseGame();
  winner();
  changeScore();
}

function changeScore() {
  const score = document.querySelector('.game-score');

  score.textContent = playingField.score;
}

function loseGame() {
  const currentField = playingField.field.flat();

  if (currentField.every(el => el !== 0) && notAdded(playingField.field)) {
    document.querySelector('.message.message-lose.hidden').classList.remove('hidden');
    document.querySelector('.message.message-lose').style.cursor = 'pointer';
  }
}

function notAdded(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const currentValue = matrix[i][j];

      if (i > 0 && matrix[i - 1][j] === currentValue) {
        return false;
      }

      if (i < n - 1 && matrix[i + 1][j] === currentValue) {
        return false;
      }

      if (j > 0 && matrix[i][j - 1] === currentValue) {
        return false;
      }

      if (j < m - 1 && matrix[i][j + 1] === currentValue) {
        return false;
      }
    }
  }

  return true;
}

function winner() {
  if (playingField.field.flat().some(el => el === 2048) && playingField.score === 2048) {
    document.querySelector('.message.message-win.hidden').classList.remove('hidden');
  }
}
