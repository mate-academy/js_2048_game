'use strict';

// Uncomment the next lines to use your game instance in the browser
'use strict';

import Game from '../modules/Game.class.js';

// Inicializa o jogo com os IDs corretos do HTML
const game = new Game('table', 'score', 'start');

// Inicializa o jogo configurando os eventos e display
game.init();
