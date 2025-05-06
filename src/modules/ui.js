/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
const startButton = document.querySelector('.button');
const scoreText = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const tableRows = document.querySelector('.game-field').tBodies[0].rows;

const renderState = (state) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!state[i][j]) {
        tableRows[i].children[j].textContent = '';
        tableRows[i].children[j].className = '';

        tableRows[i].children[j].classList.add('field-cell');
        continue;
      }
      tableRows[i].children[j].textContent = state[i][j];
      tableRows[i].children[j].className = '';

      tableRows[i].children[j].classList.add(
        'field-cell',
        `field-cell--${state[i][j]}`,
      );
    }
  }
};

const showStartMessage = () => {
  startMessage.classList.add('hidden');
};

const showWinOrLoseMessage = (gameStatus) => {
  startMessage.classList.add('hidden');

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
};

const updateScore = (score) => {
  scoreText.textContent = score;
};

const toggleButton = (isRestart) => {
  startButton.classList.toggle('start', !isRestart);
  startButton.classList.toggle('restart', isRestart);
  startButton.textContent = isRestart ? 'Restart' : 'Start';
};

export {
  renderState,
  showStartMessage,
  showWinOrLoseMessage,
  startButton,
  toggleButton,
  updateScore
};

