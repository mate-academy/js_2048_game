'use strict';

function boardRefresh() {
  const cells = game.getState().flat();

  tds.forEach((td, index) => {
    if (cells[index] !== 0) {
      td.textContent = cells[index];
      td.className = 'field-cell';
      td.classList.add(`field-cell--${cells[index]}`);
    } else {
      td.textContent = '';
      td.className = 'field-cell';
    }
  });
}

const Game = require('../modules/Game.class');
const game = new Game();
const clickButton = document.querySelector('button');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const lostMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const tds = Array.from(document.querySelectorAll('td'));
const field = document.querySelector('.game-field');
const gameOverMessage = document.querySelector('.game-over');
const styleSheet = document.styleSheets[0];

clickButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    boardRefresh();
    startMessage.classList.add('hidden');

    clickButton.classList.remove('start');
    clickButton.classList.add('restart');
    clickButton.textContent = 'Restart';
  } else {
    game.restart();
    boardRefresh();
    game.setScore(0);
    score.textContent = game.getScore();
    startMessage.classList.remove('hidden');
    lostMessage.classList.add('hidden');
    field.classList.remove('game-field--lose');
    gameOverMessage.classList.remove('game-over--visible');

    clickButton.classList.remove('restart');
    clickButton.classList.add('start');
    clickButton.textContent = 'Start';

    tds.forEach((item) => {
      item.style.animationName = '';
    });

    for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
      const rule = styleSheet.cssRules[i];

      if (
        rule.type === CSSRule.KEYFRAMES_RULE &&
        window.keyframeNames.includes(rule.name)
      ) {
        styleSheet.deleteRule(i);
      }
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    if (e.key === 'ArrowUp') {
      game.moveUp();
      boardRefresh();
      score.textContent = game.getScore();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
      boardRefresh();
      score.textContent = game.getScore();
    }

    if (e.key === 'ArrowLeft') {
      game.moveLeft();
      boardRefresh();
      score.textContent = game.getScore();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
      boardRefresh();
      score.textContent = game.getScore();
    }
  }

  if (game.getStatus() === 'lose') {
    field.classList.add('game-field--lose');
    lostMessage.classList.remove('hidden');

    gameOverMessage.classList.add('game-over--visible');

    tds.forEach((item, index) => {
      const title = `shake-${index}`;

      let keyframes = `@keyframes ${title} {`;

      for (let i = 0; i <= 80; i++) {
        const rot = (i % 2 === 0 ? 2 : -2) * (i % 4 < 2 ? 1 : -1);
        const tx = (i % 2 === 0 ? 2 : -2) * (i % 4 < 2 ? 1 : -1);

        keyframes += `${i}% { transform: rotate(${rot}deg) translateX(${tx}px) scale(1); }`;
      }

      const randX = (Math.random() - 0.5) * 1000;
      const randY = (Math.random() - 0.5) * 1000;
      const rotEnd = (Math.random() - 0.5) * 1440;

      keyframes += `
        80% { transform: rotate(0deg) translate(0,0); opacity: 1 }
        100% { transform: rotate(${rotEnd}deg) translate(${randX}px, ${randY}px); opacity: 0;}
      `;

      keyframes += `}`;

      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      item.style.animationName = title;
      item.style.animationDelay = `${Math.random() * 0.2}s`;
      item.style.animationDuration = `${1.5 + Math.random()}s`;
      item.style.animationFillMode = 'forwards';
    });

    lostMessage.addEventListener('click', () => {
      game.restart();
      boardRefresh();
      game.setScore(0);
      score.textContent = game.getScore();
      startMessage.classList.remove('hidden');
      lostMessage.classList.add('hidden');
      field.classList.remove('game-field--lose');
      gameOverMessage.classList.remove('game-over--visible');

      clickButton.classList.remove('restart');
      clickButton.classList.add('start');
      clickButton.textContent = 'Start';

      tds.forEach((item) => {
        item.style.animationName = '';
      });

      for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        const rule = styleSheet.cssRules[i];

        if (
          rule.type === CSSRule.KEYFRAMES_RULE &&
          window.keyframeNames.includes(rule.name)
        ) {
          styleSheet.deleteRule(i);
        }
      }
    });
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');

    winMessage.addEventListener('click', () => {
      game.restart();
      boardRefresh();
      game.setScore(0);
      score.textContent = game.getScore();
      startMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');

      clickButton.classList.remove('restart');
      clickButton.classList.add('start');
      clickButton.textContent = 'Start';
    });
  }
});
