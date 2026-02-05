import { Game } from './modules/Game.class.js';

const game = new Game();
const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');

/**
 * Atualiza a interface do usuário com base no estado atual do jogo
 */
function render() {
    boardElement.innerHTML = '';
    
    game.grid.forEach((row) => {
        row.forEach((value) => {
            const cell = document.createElement('div');
            
            // CORREÇÃO: Adiciona a classe base e mantém a específica separada
            cell.classList.add('field-cell'); 
            if (value > 0) {
                cell.classList.add(`field-cell--${value}`);
                cell.textContent = value;
            }
            
            boardElement.appendChild(cell);
        });
    });
    
    if (scoreElement) {
        scoreElement.textContent = game.score;
    }
}

/**
 * Escuta eventos de teclado usando e.key para evitar depreciação
 * e evita erro de 'event' is already a global variable
 */
window.addEventListener('keydown', (e) => {
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    if (validKeys.includes(e.key)) {
        // Se o movimento resultou em mudança, adiciona um novo tile e re-renderiza
        if (game.move(e.key)) {
            game.addRandomTile();
            render();
        }
    }
});

// Renderização inicial
render();
