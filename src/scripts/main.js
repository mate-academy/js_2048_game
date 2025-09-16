'use strict';
//import Game from '../modules/Game.class';
//Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

// Elementos do DOM
const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const statusElement = document.getElementById('game-status');

/**
 * Updates the game board and score in the DOM.
 */
function updateUI() {
    const state = game.getState();
    const score = game.getScore();
    const status = game.getStatus();

    // Update score
    scoreElement.textContent = score;

    // Update board
    boardElement.innerHTML = ''; // Clear board
    state.forEach(row => {
        row.forEach(cellValue => {
            const tile = document.createElement('div');
            
            if (cellValue !== 0) {
                tile.className = `field-cell field-cell--${cellValue}`;
                tile.textContent = cellValue;
            } else {
              tile.className = 'field-cell';
            }
            boardElement.appendChild(tile);
        });
    });

    // Update game status and button
    if (status === 'win') {
        statusElement.textContent = 'You Win!';
        statusElement.className = 'win';
        statusElement.style.remove = 'hidden';
    } else if (status === 'lose') {
        statusElement.textContent = 'Game Over!';
        statusElement.className = 'lose';
        statusElement.style.remove = 'hidden';
    } else {
        statusElement.classList.add('hidden');
    }

    if (status === 'idle') {
        startButton.textContent = 'Start';
        startButton.classList.remove('restart');
    } else {
        startButton.textContent = 'Restart';
        startButton.classList.add('restart');
    }
}

/**
 * Handles user input from the keyboard.
 * @param {KeyboardEvent} event
 */
function handleKeydown(event) {
    if (game.getStatus() !== 'playing') return;
    event.preventDefault();

    let moveMade = false;
    const previousState = JSON.stringify(game.getState());

    switch (event.key) {
        case 'ArrowUp':
            game.moveUp();
            break;
        case 'ArrowDown':
            game.moveDown();
            break;
        case 'ArrowLeft':
            game.moveLeft();
            break;
        case 'ArrowRight':
            game.moveRight();
            break;
        default:
            return; // Ignore other keys
    }

    const currentState = JSON.stringify(game.getState());
    if (previousState !== currentState) {
        updateUI();
    }
}

/**
 * Handles user input from touch gestures for mobile.
 */
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

function handleGesture() {
    if (game.getStatus() !== 'playing') return;

    const dx = touchendX - touchstartX;
    const dy = touchendY - touchstartY;
    const previousState = JSON.stringify(game.getState());

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
        if (dx > 0) {
            game.moveRight();
        } else {
            game.moveLeft();
        }
    } else { // Vertical swipe
        if (dy > 0) {
            game.moveDown();
        } else {
            game.moveUp();
        }
    }
   const currentState = JSON.stringify(game.getState());
    if (previousState !== currentState) {
        updateUI();
    }
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
        game.start();
    } else {
        game.restart();
    }
    updateUI();
});

document.addEventListener('keydown', handleKeydown);

// Add touch events for mobile
document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture();
});

// Initial UI render
updateUI();
