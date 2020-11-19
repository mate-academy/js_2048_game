  'use strict';

  describe('2048 game', () => {
    beforeEach('Open site', () => {
      cy.visit('https://kshvetsova.github.io/js_2048_game/');
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{rightArrow}');
      cy.get('body').type('{upArrow}');
      cy.get('body').type('{rightArrow}');
      cy.contains('Score').should('not.have.value', 0);
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{leftArrow}');
      cy.get('body').type('{upArrow}');
      cy.get('body').type('{leftArrow}');
      cy.contains('Score').should('not.have.value', 0);
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{rightArrow}');
      cy.get('body').type('{downArrow}');
      cy.get('body').type('{rightArrow}');
      cy.contains('Score').should('not.have.value', 0);
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{leftArrow}');
      cy.get('body').type('{downArrow}');
      cy.get('body').type('{leftArrow}');
      cy.contains('Score').should('not.have.value', 0);
    });

    it('should reset the score', () => {
      cy.get('button').click();
      cy.get('body').type('{leftArrow}');
      cy.get('body').type('{downArrow}');
      cy.get('body').type('{leftArrow}');
      cy.get('[class="game-score"]').should('not.have.value', '0');
      cy.get('button').click();
      cy.get('[class="game-score"]').should('have.value', '');
    });

    it('game over', () => {
      cy.get('button').click();
      for (let n = 0; n < 120; n++) {
        cy.get('body').type('{rightArrow}');
        cy.get('body').type('{upArrow}');
      }
      cy.get('body').contains('lose');
    });
  });


