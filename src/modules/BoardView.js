'use strict';

const Tile = require('./Tile.class');

class BoardView {
  constructor(game, tilesLayer, gameField) {
    this.game = game;
    this.tilesLayer = tilesLayer;
    this.gameField = gameField;
    this.tiles = [];
  }

  reset() {
    this.tiles.forEach((t) => t.remove());
    this.tiles = [];
  }

  getCellPosition(row, col) {
    const CELL_SIZE = 75;
    const GAP = 10;

    return {
      x: col * (CELL_SIZE + GAP),
      y: row * (CELL_SIZE + GAP),
    };
  }

  spawnTile(value, row, col) {
    const tile = new Tile(value, row, col);
    const pos = this.getCellPosition(row, col);

    tile.setPosition(pos.x, pos.y);

    this.tiles.push(tile);
    this.tilesLayer.appendChild(tile.element);

    return tile;
  }

  getTileAt(row, col) {
    return this.tiles.find((t) => t.row === row && t.col === col);
  }

  syncInitial(board) {
    this.reset();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] !== 0) {
          this.spawnTile(board[r][c], r, c);
        }
      }
    }
  }

  applyMoves(meta) {
    for (const m of meta.moves) {
      const tile = this.getTileAt(m.from.r, m.from.c);

      if (!tile) {
        continue;
      }

      tile.row = m.to.r;
      tile.col = m.to.c;

      const pos = this.getCellPosition(tile.row, tile.col);

      tile.setPosition(pos.x, pos.y);
    }
  }

  applyMerges(meta) {
    for (const m of meta.merges) {
      const tile = this.getTileAt(m.at.r, m.at.c);

      if (!tile) {
        continue;
      }

      tile.updateValue(m.value);
    }
  }
}

module.exports = BoardView;
