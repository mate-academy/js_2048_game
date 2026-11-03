'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const audioContext = new AudioContext();

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const scoreElement = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
    game.start();
    renderBoard();
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
    game.restart();
    game.start();
    renderBoard();
  }
});

document.addEventListener('keydown', (action) => {
  if (game.getStatus() === 'win') {
    return;
  }

  if (game.getStatus() === 'lose') {
    return;
  }

  if (action.key === 'ArrowLeft') {
    const boardBefore = game.getState();

    game.moveLeft();

    if (
      boardBefore.some((row, rowIndex) => {
        return row.some((cell, cellIndex) => {
          return cell !== game.getState()[rowIndex][cellIndex];
        });
      })
    ) {
      playMergeSound();

      if (checkWin()) {
        renderBoard();

        return;
      }
      renderBoard();
    }
  }

  if (action.key === 'ArrowRight') {
    const boardBefore = game.getState();

    game.moveRight();

    if (
      boardBefore.some((row, rowIndex) => {
        return row.some((cell, cellIndex) => {
          return cell !== game.getState()[rowIndex][cellIndex];
        });
      })
    ) {
      playMergeSound();

      if (checkWin()) {
        renderBoard();

        return;
      }
      renderBoard();
    }
  }

  if (action.key === 'ArrowUp') {
    const boardBefore = game.getState();

    game.moveUp();

    if (
      boardBefore.some((row, rowIndex) => {
        return row.some((cell, cellIndex) => {
          return cell !== game.getState()[rowIndex][cellIndex];
        });
      })
    ) {
      playMergeSound();

      if (checkWin()) {
        renderBoard();

        return;
      }
      renderBoard();
    }
  }

  if (action.key === 'ArrowDown') {
    const boardBefore = game.getState();

    game.moveDown();

    if (
      boardBefore.some((row, rowIndex) => {
        return row.some((cell, cellIndex) => {
          return cell !== game.getState()[rowIndex][cellIndex];
        });
      })
    ) {
      playMergeSound();

      if (checkWin()) {
        renderBoard();

        return;
      }
      renderBoard();
    }
  }

  checkLose();
});

function renderBoard() {
  const cells = document.querySelectorAll('.field-cell');
  const board = game.getState();

  for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
    for (let rowIndex = 0; rowIndex < board[columnIndex].length; rowIndex++) {
      const cell = cells[columnIndex * board[columnIndex].length + rowIndex];

      const value = board[columnIndex][rowIndex];

      cell.textContent = value === 0 ? '' : value;

      cell.classList.remove(
        'field-cell--2',
        'field-cell--4',
        'field-cell--8',
        'field-cell--16',
        'field-cell--32',
        'field-cell--64',
        'field-cell--128',
        'field-cell--256',
        'field-cell--512',
        'field-cell--1024',
        'field-cell--2048',
      );

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
  scoreElement.textContent = game.getScore();
}

function checkWin() {
  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    startMessage.classList.add('hidden');
    playWinSound();

    return true;
  } else {
    return false;
  }
}

function checkLose() {
  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
    startMessage.classList.add('hidden');
    playLoseSound();
  }
}

function playMergeSound() {
  audioContext.resume();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(500, audioContext.currentTime);

  oscillator.frequency.exponentialRampToValueAtTime(
    250,
    audioContext.currentTime + 0.12,
  );
  gainNode.gain.value = 0.06;
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.15);
}

function playWinSound() {
  audioContext.resume();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const bassOscillator = audioContext.createOscillator();
  const bassGain = audioContext.createGain();

  bassOscillator.connect(bassGain);
  bassGain.connect(audioContext.destination);

  bassOscillator.type = 'sine';
  bassOscillator.frequency.value = 80;
  bassGain.gain.setValueAtTime(0.04, audioContext.currentTime);

  bassGain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.8,
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'square';

  oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0.07, audioContext.currentTime);

  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.8,
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.8);
  bassOscillator.start();
  bassOscillator.stop(audioContext.currentTime + 1.5);
}

function playLoseSound() {
  audioContext.resume();

  const bufferSize = audioContext.sampleRate * 2;
  const noiseBuffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate,
  );
  const channelData = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }

  const noiseSource = audioContext.createBufferSource();

  noiseSource.buffer = noiseBuffer;

  const thunderFilter = audioContext.createBiquadFilter();

  thunderFilter.type = 'highpass';
  thunderFilter.frequency.setValueAtTime(700, audioContext.currentTime);

  thunderFilter.frequency.exponentialRampToValueAtTime(
    100,
    audioContext.currentTime + 1.5,
  );

  const thunderGain = audioContext.createGain();

  noiseSource.connect(thunderFilter);
  thunderFilter.connect(thunderGain);
  thunderGain.connect(audioContext.destination);
  thunderGain.gain.setValueAtTime(1.2, audioContext.currentTime);

  thunderGain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.8,
  );
  noiseSource.start();
  noiseSource.stop(audioContext.currentTime + 1.8);
}
