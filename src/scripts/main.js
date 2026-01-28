'use strict';

/**
 * =============================================================================
 * MAIN.JS - INTERFACE DO USUÁRIO DO JOGO 2048
 * =============================================================================
 *
 * Este arquivo gerencia toda a interação entre o usuário e o jogo:
 * - Renderização do tabuleiro no DOM
 * - Atualização da pontuação
 * - Controle dos botões Start/Restart
 * - Exibição de mensagens (início, vitória, derrota)
 * - Captura de eventos de teclado (setas direcionais)
 *
 * ARQUITETURA:
 * - A lógica do jogo está em Game.class.js
 * - Este arquivo apenas reflete o estado do jogo na interface
 *
 * @author Implementado para Mate Academy
 * =============================================================================
 */

import Game from '../modules/Game.class.js';

// Instância única do jogo
const game = new Game();

// ===========================================================================
// ELEMENTOS DO DOM
// ===========================================================================
// Referências aos elementos HTML que serão manipulados
const gameField = document.querySelector('.game-field'); // Tabuleiro
const scoreElement = document.querySelector('.game-score'); // Pontuação
const button = document.querySelector('.button'); // Botão Start/Restart
const messageStart = document.querySelector('.message-start'); // Msg inicial
const messageWin = document.querySelector('.message-win'); // Msg vitória
const messageLose = document.querySelector('.message-lose'); // Msg derrota

// ===========================================================================
// FUNÇÕES DE RENDERIZAÇÃO
// ===========================================================================

/**
 * Renderiza o tabuleiro do jogo no DOM
 *
 * Percorre a matriz de estado do jogo e atualiza cada célula:
 * - Remove classes de valor anteriores
 * - Se a célula tem valor > 0, exibe o número e adiciona classe de estilo
 * - Se a célula está vazia (0), limpa o conteúdo
 *
 * CLASSES CSS:
 * - field-cell: classe base de toda célula
 * - field-cell--{valor}: classe específica para estilização (cor de fundo)
 *   Exemplo: field-cell--2, field-cell--4, field-cell--2048
 */
function renderBoard() {
  const state = game.getState();
  const rows = gameField.querySelectorAll('.field-row');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, colIndex) => {
      const value = state[rowIndex][colIndex];

      // Reset: remove todas as classes de valor
      cell.className = 'field-cell';

      if (value > 0) {
        // Célula com valor: exibe número e adiciona classe de estilo
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        // Célula vazia: limpa conteúdo
        cell.textContent = '';
      }
    });
  });
}

/**
 * Atualiza a exibição da pontuação
 */
function updateScore() {
  scoreElement.textContent = game.getScore();
}

/**
 * Gerencia a exibição das mensagens do jogo
 *
 * Baseado no status atual:
 * - idle: mostra mensagem "Press Start to begin"
 * - playing: esconde todas as mensagens
 * - win: mostra mensagem de vitória
 * - lose: mostra mensagem de derrota
 *
 * Usa a classe CSS 'hidden' para controlar visibilidade
 */
function updateMessages() {
  const gameStatus = game.getStatus();

  // Esconde todas as mensagens primeiro
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  // Mostra apenas a mensagem apropriada
  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

/**
 * Atualiza o botão principal (Start/Restart)
 *
 * - Quando idle: mostra "Start" com estilo verde
 * - Quando playing/win/lose: mostra "Restart" com estilo vermelho
 *
 * CLASSES CSS:
 * - start: estilo verde para iniciar
 * - restart: estilo vermelho para reiniciar
 */
function updateButton() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  } else {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

/**
 * Função principal de renderização
 *
 * Atualiza todos os elementos visuais do jogo.
 * Deve ser chamada após qualquer alteração no estado do jogo.
 */
function render() {
  renderBoard();
  updateScore();
  updateMessages();
  updateButton();
}

// ===========================================================================
// EVENT LISTENERS - Manipuladores de Eventos
// ===========================================================================

/**
 * Handler do botão Start/Restart
 *
 * - Se o jogo está idle: inicia o jogo (start)
 * - Se o jogo está em outro estado: reinicia (restart)
 *
 * Após a ação, renderiza a interface atualizada.
 */
button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

/**
 * Handler de teclado para movimentação
 *
 * Captura as teclas de seta e executa o movimento correspondente.
 * Só funciona quando o jogo está em andamento (status 'playing').
 *
 * TECLAS:
 * - ArrowLeft: move para esquerda
 * - ArrowRight: move para direita
 * - ArrowUp: move para cima
 * - ArrowDown: move para baixo
 *
 * preventDefault() evita que a página role ao pressionar setas.
 */
document.addEventListener('keydown', (e) => {
  const gameStatus = game.getStatus();

  // Ignora teclas se o jogo não está em andamento
  if (gameStatus !== 'playing') {
    return;
  }

  // Mapeamento de teclas para métodos do jogo
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  // Se a tecla pressionada é uma seta válida
  if (moves[e.key]) {
    e.preventDefault(); // Evita scroll da página
    moves[e.key](); // Executa o movimento
    render(); // Atualiza a interface
  }
});

// ===========================================================================
// INICIALIZAÇÃO
// ===========================================================================

// Renderiza o estado inicial do jogo ao carregar a página
render();
