'use strict';

/**
 * Base palette container
 */
export class Palette {
  /**
   * @typedef {Object} TileColor
   * @property {string} background - The tile's background color in CSS format.
   * @property {string} text - The color of the text on the tile.
   */
  /**
   * Tile palette
   * @type {TileColor[]}
   */
  static tilePalette = [
    { background: '#fffbe6', text: 'black' },
    { background: '#fff2cc', text: 'black' },
    { background: '#ffd699', text: 'black' },
    { background: '#ffbb66', text: 'black' },
    { background: '#ffaa52', text: 'white' },
    { background: '#ff9933', text: 'white' },
    { background: '#f26a5a', text: 'white' },
    { background: '#ec5d82', text: 'white' },
    { background: '#d95cad', text: 'white' },
    { background: '#9966cc', text: 'white' },
    { background: '#3366cc', text: 'white' },
    { background: '#008c8c', text: 'black' },
    { background: '#006633', text: 'white' },
    { background: '#ffd700', text: 'black' },
    { background: '#ffffff', text: 'black' },
    { background: '#262633', text: 'white' },
  ];
}
