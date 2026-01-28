'use strict';

/**
 * =============================================================================
 * CLASSE GAME - LÓGICA PRINCIPAL DO JOGO 2048
 * =============================================================================
 *
 * Esta classe gerencia toda a lógica do jogo 2048, incluindo:
 * - Estado do tabuleiro (matriz 4x4)
 * - Pontuação do jogador
 * - Movimentação e fusão das células
 * - Condições de vitória e derrota
 *
 * REGRAS DO JOGO:
 * 1. O tabuleiro é 4x4
 * 2. Cada célula pode estar vazia (0) ou conter: 2, 4, 8, 16... 2^n
 * 3. O jogador move as células com as setas do teclado
 * 4. Células iguais adjacentes se fundem ao mover
 * 5. Uma célula fundida não pode fundir novamente no mesmo movimento
 * 6. Após cada movimento válido, uma nova célula (2 ou 4) aparece
 * 7. Vitória: atingir 2048. Derrota: sem movimentos possíveis
 *
 * @author Implementado para Mate Academy
 * =============================================================================
 */
class Game {
  /**
   * Constantes de status do jogo
   * - idle: jogo não iniciado (estado inicial)
   * - playing: jogo em andamento
   * - win: jogador venceu (atingiu 2048)
   * - lose: jogador perdeu (sem movimentos)
   */
  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  /**
   * Construtor - Cria uma nova instância do jogo
   *
   * @param {number[][]} initialState - Estado inicial do tabuleiro (opcional)
   *
   * Se não for passado, o tabuleiro começa vazio (todos zeros).
   * O estado inicial é armazenado para permitir reiniciar o jogo.
   *
   * IMPORTANTE: Fazemos cópia profunda do array para evitar
   * que modificações no state afetem o initialState original.
   */
  constructor(initialState) {
    // Tabuleiro padrão: matriz 4x4 vazia
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // Armazena estado inicial (cópia profunda para não alterar o original)
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : defaultState;

    // Estado atual do tabuleiro (cópia do inicial)
    this.state = this.initialState.map((row) => [...row]);

    // Pontuação começa em zero
    this.score = 0;

    // Status inicial: jogo não iniciado
    this.status = Game.STATUS.idle;
  }

  // ===========================================================================
  // MÉTODOS DE MOVIMENTO
  // ===========================================================================

  /**
   * Move todas as células para a ESQUERDA
   *
   * - Só executa se o jogo estiver em andamento
   * - Após movimento válido, adiciona nova célula aleatória
   * - Atualiza status para verificar vitória/derrota
   */
  moveLeft() {
    // Ignora se o jogo não está em andamento
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    // Executa o movimento e verifica se houve alteração
    const moved = this.move('left');

    // Se houve movimento, adiciona nova célula e verifica status
    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  /**
   * Move todas as células para a DIREITA
   */
  moveRight() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const moved = this.move('right');

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  /**
   * Move todas as células para CIMA
   */
  moveUp() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const moved = this.move('up');

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  /**
   * Move todas as células para BAIXO
   */
  moveDown() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const moved = this.move('down');

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  // ===========================================================================
  // MÉTODOS GETTERS - Retornam informações do jogo
  // ===========================================================================

  /**
   * Retorna a pontuação atual do jogador
   * @returns {number} Pontuação acumulada
   */
  getScore() {
    return this.score;
  }

  /**
   * Retorna o estado atual do tabuleiro
   * @returns {number[][]} Matriz 4x4 com os valores das células
   */
  getState() {
    return this.state;
  }

  /**
   * Retorna o status atual do jogo
   *
   * @returns {string} Um dos valores:
   * - 'idle': jogo não iniciado
   * - 'playing': jogo em andamento
   * - 'win': jogador venceu
   * - 'lose': jogador perdeu
   */
  getStatus() {
    return this.status;
  }

  // ===========================================================================
  // MÉTODOS DE CONTROLE DO JOGO
  // ===========================================================================

  /**
   * Inicia o jogo
   *
   * - Muda o status para 'playing'
   * - Adiciona 2 células aleatórias ao tabuleiro
   *   (seguindo a regra: 90% chance de ser 2, 10% de ser 4)
   */
  start() {
    this.status = Game.STATUS.playing;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Reinicia o jogo
   *
   * - Restaura o tabuleiro ao estado inicial
   * - Zera a pontuação
   * - Volta o status para 'idle'
   *
   * NOTA: Não inicia automaticamente, o jogador precisa clicar em Start
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUS.idle;
  }

  // ===========================================================================
  // MÉTODOS AUXILIARES (PRIVADOS)
  // ===========================================================================

  /**
   * Adiciona uma célula aleatória (2 ou 4) em uma posição vazia
   *
   * Probabilidades:
   * - 90% de chance de ser 2
   * - 10% de chance de ser 4
   *
   * ALGORITMO:
   * 1. Encontra todas as células vazias (valor 0)
   * 2. Escolhe uma aleatoriamente
   * 3. Define o valor (2 ou 4 baseado na probabilidade)
   */
  addRandomTile() {
    // Array para armazenar posições das células vazias
    const emptyCells = [];

    // Percorre o tabuleiro buscando células vazias
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    // Se não há células vazias, não faz nada
    if (emptyCells.length === 0) {
      return;
    }

    // Escolhe uma célula vazia aleatória
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    // Define o valor: 10% chance de 4, 90% chance de 2
    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  /**
   * Move e funde uma linha para a ESQUERDA
   *
   * @param {number[]} rowData - Array com os 4 valores da linha
   * @returns {Object} Objeto contendo:
   *   - newRow: nova linha após o movimento
   *   - scoreAdded: pontos ganhos com fusões
   *   - moved: se houve alguma alteração
   *
   * ALGORITMO:
   * 1. Remove todos os zeros (células vazias)
   * 2. Percorre da esquerda para direita
   * 3. Se duas células adjacentes são iguais, funde (dobra o valor)
   * 4. Uma célula fundida não pode fundir novamente
   * 5. Preenche o restante com zeros
   *
   * EXEMPLO: [2, 0, 2, 4] → [4, 4, 0, 0] (pontos: +4)
   */
  moveRowLeft(rowData) {
    // Remove zeros para facilitar a fusão
    const filtered = rowData.filter((val) => val !== 0);
    const newRow = [];
    let scoreAdded = 0;
    let i = 0;

    // Processa células da esquerda para direita
    while (i < filtered.length) {
      // Verifica se pode fundir com a próxima célula
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        // Funde: dobra o valor
        const mergedValue = filtered[i] * 2;

        newRow.push(mergedValue);
        scoreAdded += mergedValue; // Pontuação = valor da fusão
        i += 2; // Pula as duas células fundidas
      } else {
        // Não funde, apenas move
        newRow.push(filtered[i]);
        i++;
      }
    }

    // Preenche o resto da linha com zeros
    while (newRow.length < 4) {
      newRow.push(0);
    }

    // Verifica se a linha mudou
    const moved = rowData.some((val, idx) => val !== newRow[idx]);

    return { newRow, scoreAdded, moved };
  }

  /**
   * Move e funde uma linha para a DIREITA
   *
   * @param {number[]} rowData - Array com os 4 valores da linha
   * @returns {Object} Objeto contendo:
   *   - newRow: nova linha após o movimento
   *   - scoreAdded: pontos ganhos com fusões
   *   - moved: se houve alguma alteração
   *
   * Similar ao moveRowLeft, mas processa da direita para esquerda
   * para que as fusões ocorram no lado direito.
   *
   * EXEMPLO: [2, 2, 0, 4] → [0, 0, 4, 4] (pontos: +4)
   */
  moveRowRight(rowData) {
    // Remove zeros
    const filtered = rowData.filter((val) => val !== 0);
    const newRow = [];
    let scoreAdded = 0;
    let i = filtered.length - 1;

    // Processa da direita para esquerda
    while (i >= 0) {
      // Verifica se pode fundir com a célula anterior
      if (i - 1 >= 0 && filtered[i] === filtered[i - 1]) {
        // Funde: dobra o valor
        const mergedValue = filtered[i] * 2;

        newRow.unshift(mergedValue); // Adiciona no início
        scoreAdded += mergedValue;
        i -= 2; // Pula as duas células fundidas
      } else {
        // Não funde, apenas move
        newRow.unshift(filtered[i]);
        i--;
      }
    }

    // Preenche o início da linha com zeros
    while (newRow.length < 4) {
      newRow.unshift(0);
    }

    // Verifica se a linha mudou
    const moved = rowData.some((val, idx) => val !== newRow[idx]);

    return { newRow, scoreAdded, moved };
  }

  /**
   * Executa o movimento do tabuleiro na direção especificada
   *
   * @param {'left' | 'right' | 'up' | 'down'} direction - Direção do movimento
   * @returns {boolean} True se alguma célula foi movida
   *
   * ESTRATÉGIA:
   * - Esquerda/Direita: processa cada linha
   * - Cima/Baixo: extrai colunas como arrays, processa, e devolve
   *
   * Para cima: usa moveRowLeft (células vão para o início)
   * Para baixo: usa moveRowRight (células vão para o fim)
   */
  move(direction) {
    let moved = false;
    let totalScoreAdded = 0;

    if (direction === 'left') {
      // Processa cada linha da esquerda para direita
      for (let row = 0; row < 4; row++) {
        const result = this.moveRowLeft(this.state[row]);

        if (result.moved) {
          moved = true;
        }
        this.state[row] = result.newRow;
        totalScoreAdded += result.scoreAdded;
      }
    } else if (direction === 'right') {
      // Processa cada linha da direita para esquerda
      for (let row = 0; row < 4; row++) {
        const result = this.moveRowRight(this.state[row]);

        if (result.moved) {
          moved = true;
        }
        this.state[row] = result.newRow;
        totalScoreAdded += result.scoreAdded;
      }
    } else if (direction === 'up') {
      // Processa cada coluna de cima para baixo
      for (let col = 0; col < 4; col++) {
        // Extrai a coluna como um array
        const column = [
          this.state[0][col],
          this.state[1][col],
          this.state[2][col],
          this.state[3][col],
        ];

        // Usa moveRowLeft (células vão para o "início" = topo)
        const result = this.moveRowLeft(column);

        if (result.moved) {
          moved = true;
        }

        // Devolve os valores para a coluna
        for (let row = 0; row < 4; row++) {
          this.state[row][col] = result.newRow[row];
        }
        totalScoreAdded += result.scoreAdded;
      }
    } else if (direction === 'down') {
      // Processa cada coluna de baixo para cima
      for (let col = 0; col < 4; col++) {
        // Extrai a coluna como um array
        const column = [
          this.state[0][col],
          this.state[1][col],
          this.state[2][col],
          this.state[3][col],
        ];

        // Usa moveRowRight (células vão para o "fim" = base)
        const result = this.moveRowRight(column);

        if (result.moved) {
          moved = true;
        }

        // Devolve os valores para a coluna
        for (let row = 0; row < 4; row++) {
          this.state[row][col] = result.newRow[row];
        }
        totalScoreAdded += result.scoreAdded;
      }
    }

    // Atualiza pontuação total
    this.score += totalScoreAdded;

    return moved;
  }

  // ===========================================================================
  // MÉTODOS DE VERIFICAÇÃO DE ESTADO
  // ===========================================================================

  /**
   * Verifica se o jogador venceu (atingiu 2048)
   *
   * @returns {boolean} True se existe uma célula com valor 2048
   *
   * Percorre todo o tabuleiro procurando o valor 2048.
   * Retorna true assim que encontrar (otimização).
   */
  hasWon() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Verifica se ainda existem movimentos válidos
   *
   * @returns {boolean} True se há pelo menos um movimento possível
   *
   * Um movimento é possível se:
   * 1. Existe pelo menos uma célula vazia (0), OU
   * 2. Existem duas células adjacentes com mesmo valor
   *    (horizontal ou vertical)
   */
  canMove() {
    // Verifica se há células vazias
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    // Verifica células iguais adjacentes na horizontal
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    // Verifica células iguais adjacentes na vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    // Nenhum movimento possível = game over
    return false;
  }

  /**
   * Atualiza o status do jogo baseado no estado atual
   *
   * Chamado após cada movimento para verificar:
   * 1. Se o jogador venceu (atingiu 2048)
   * 2. Se o jogador perdeu (sem movimentos possíveis)
   *
   * O status 'playing' é mantido se nenhuma das condições acima for atendida.
   */
  updateStatus() {
    if (this.hasWon()) {
      this.status = Game.STATUS.win;
    } else if (!this.canMove()) {
      this.status = Game.STATUS.lose;
    }
  }
}

// ===========================================================================
// EXPORTAÇÃO DO MÓDULO
// ===========================================================================
// Suporta dois sistemas de módulos:
// - CommonJS (module.exports) - usado pelo Jest nos testes
// - ES Modules (import/export) - usado pelo navegador via Parcel
// ===========================================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}
