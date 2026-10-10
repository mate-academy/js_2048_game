'use strict';

Cypress.Commands.add('shuffleBoxes', (arrow1, arrow2, times) => {
  cy.get('.button.start').click();

  for (let n = 0; n < times; n++) {
    cy.get('body').type(arrow1);
    cy.get('body').type(arrow2);
  }
});

describe('2048 game UI', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the initial score', () => {
    cy.get('.button.start').click();
    cy.get('.game-score').should('have.value', '');
  });

  it('should show the score shuffling to the left and up only', () => {
    cy.shuffleBoxes('{leftArrow}', '{upArrow}', 3);
    cy.get('.game-score').invoke('text').then(parseFloat).should('be.gt', 1);
  });

  it('should show the score shuffling to the right and up only', () => {
    cy.shuffleBoxes('{rightArrow}', '{upArrow}', 3);
    cy.get('.game-score').invoke('text').then(parseFloat).should('be.gt', 1);
  });

  it('should show the score shuffling to the right and down only', () => {
    cy.shuffleBoxes('{rightArrow}', '{downArrow}', 3);
    cy.get('.game-score').invoke('text').then(parseFloat).should('be.gt', 1);
  });

  it('should show the score shuffling to the left and down only', () => {
    cy.shuffleBoxes('{leftArrow}', '{downArrow}', 3);
    cy.get('.game-score').invoke('text').then(parseFloat).should('be.gt', 1);
  });

  it('should reset the score', () => {
    cy.shuffleBoxes('{leftArrow}', '{downArrow}', 3);
    cy.get('.game-score').invoke('text').then(parseFloat).should('be.gt', 1);
    cy.get('.button.restart').click();
    cy.get('.game-score').should('have.value', '');
  });

  it('should show message in case of the loss', () => {
    cy.get('.button.start').click();

    for (let n = 0; n < 100; n++) {
      cy.get('body').type('{rightArrow}');
      cy.get('body').type('{downArrow}');
      cy.get('body').type('{leftArrow}');
      cy.get('body').type('{upArrow}');
    }

    cy.contains('You lose! Restart the game?').should('be.visible');
  });
});

describe('2048 game touch controls', () => {
  const cellsText = () =>
    cy
      .get('.field-cell')
      .then(($cells) => [...$cells].map((cell) => cell.textContent.trim()));

  // Swipes on the board with real PointerEvents.
  const swipe = (deltaX, deltaY, pointerType = 'touch') => {
    cy.get('.game-field').then(($field) => {
      const rect = $field[0].getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const options = {
        eventConstructor: 'PointerEvent',
        pointerId: 1,
        pointerType,
        isPrimary: true,
        button: 0,
      };

      cy.wrap($field).trigger('pointerdown', {
        ...options,
        clientX: x,
        clientY: y,
      });

      cy.wrap($field).trigger('pointerup', {
        ...options,
        clientX: x + deltaX,
        clientY: y + deltaY,
      });
    });
  };

  // With Math.random stubbed to 0, new tiles are always a "2" placed in the
  // first empty cell, so Start gives a board of [2, 2, _, _] in the top row.
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
  });

  const board = (...filled) => {
    const cells = Array(16).fill('');

    filled.forEach(([index, value]) => {
      cells[index] = value;
    });

    return cells;
  };

  it('should not move before the game is started', () => {
    swipe(-100, 0);
    cellsText().should('deep.equal', board());
    cy.get('.game-score').should('have.text', '0');
  });

  it('should move left on a left swipe', () => {
    cy.get('.button.start').click();
    swipe(-100, 0);
    cellsText().should('deep.equal', board([0, '4'], [1, '2']));
    cy.get('.game-score').should('have.text', '4');
  });

  it('should move right on a right swipe', () => {
    cy.get('.button.start').click();
    swipe(100, 0);
    cellsText().should('deep.equal', board([0, '2'], [3, '4']));
    cy.get('.game-score').should('have.text', '4');
  });

  it('should move down on a down swipe', () => {
    cy.get('.button.start').click();
    swipe(0, 100);
    cellsText().should('deep.equal', board([0, '2'], [12, '2'], [13, '2']));
  });

  it('should move up on an up swipe', () => {
    cy.get('.button.start').click();
    swipe(0, 100);
    swipe(0, -100);
    cellsText().should('deep.equal', board([0, '4'], [1, '2'], [2, '2']));
    cy.get('.game-score').should('have.text', '4');
  });

  it('should use the dominant axis of a diagonal swipe', () => {
    cy.get('.button.start').click();
    swipe(100, 40);
    cellsText().should('deep.equal', board([0, '2'], [3, '4']));
  });

  it('should ignore a tap or a short drag', () => {
    cy.get('.button.start').click();
    swipe(0, 0);
    swipe(-10, 8);
    cellsText().should('deep.equal', board([0, '2'], [1, '2']));
    cy.get('.game-score').should('have.text', '0');
  });

  it('should ignore mouse dragging on the board', () => {
    cy.get('.button.start').click();
    swipe(-100, 0, 'mouse');
    swipe(100, 0, 'mouse');
    cellsText().should('deep.equal', board([0, '2'], [1, '2']));
    cy.get('.game-score').should('have.text', '0');
  });

  it('should keep keyboard controls working alongside swipes', () => {
    cy.get('.button.start').click();
    swipe(0, 100);
    cy.get('body').type('{upArrow}');
    cellsText().should('deep.equal', board([0, '4'], [1, '2'], [2, '2']));
    cy.get('.game-score').should('have.text', '4');
  });

  it('should reset the board on Restart after swiping', () => {
    cy.get('.button.start').click();
    swipe(-100, 0);
    cy.get('.button.restart').click();
    cellsText().should('deep.equal', board());
    cy.get('.game-score').should('have.text', '0');
    cy.get('.button.start').should('exist');
  });
});
