'use strict';
import Game from './game.js';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

const game = new Game();

const body = document.body;
const cells = document.querySelectorAll('.field-cell');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const startButton = document.querySelector('.start');
const scoreTable = document.querySelector('.game-score');


body.addEventListener('keydown', (e) => { 
        if(e.key === "ArrowLeft") {
           doSomeMove('left');
           render();
        }
        
        if(e.key === 'ArrowRight') {
           doSomeMove('right');
           render();
        }

        if(e.key === "ArrowDown") {
           doSomeMove('down');
           render();
        }

        if(e.key === "ArrowUp") {
           doSomeMove('up');
           render();
        }

        game.checkWin();
        game.getStatus();
    })


startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
        game.start();
        startButton.textContent = 'Restart';
        startButton.classList.remove('start');
        startButton.classList.add('restart');
        startMessage.hidden = true;
    } else {
        game.restart();
        loseMessage.hidden = true;
    }
    
    render();
    scoreTable.textContent = game.getScore();
});


function render() {
    const ourState = game.getState();
    
    for(let i = 0; i < ourState.length; i++) {
        for(let j = 0; j < ourState.length; j++) {
            const cell = cells[i * 4 + j];
            
            for (const cls of cell.classList) {
                if (cls.startsWith('field-cell--')) {
                    cell.classList.remove(cls);
                }
            }
            
            if(ourState[i][j] > 0) {
                cell.textContent = ourState[i][j];
                cell.classList.add(`field-cell--${ourState[i][j]}`);
            } else {
                cell.textContent = '';
            }
        }
    }
}


function doSomeMove(side) {
    let move;

    switch(side) {
        case 'left':
            move = game.moveLeft();
        break;

        case 'right':
            move = game.moveRight();
        break;

        case 'down':
            move = game.moveDown();
        break;

        case 'up': 
           move = game.moveUp();
        break;
    }

    if(move) {
            scoreTable.textContent = game.getScore();

            const gameWin = game.checkWin();
            const gameStatus = game.getStatus();

            if(gameWin) {
                createMessage('win')
            }

            if(!gameStatus) {
                createMessage('lose')
            }
           }
}


function createMessage(status) {
        switch(status) {
            case 'win':
                winMessage.classList.remove('hidden');
                loseMessage.classList.add('hidden');
            break;
            
            case 'lose': 
                loseMessage.classList.remove('hidden');
                winMessage.classList.add('hidden');
            break;
    }
}