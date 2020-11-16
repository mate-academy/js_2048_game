  'use strict';

  describe('Test', () => {
    beforeEach('Open site', () => {
      cy.visit('http://localhost:8080/');
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{rightArrow}');
      cy.get('body').type('{upArrow}');
      cy.contains('Score').contains('4');
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{leftArrow}');
      cy.get('body').type('{upArrow}');
      cy.contains('Score').contains('4');
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{rightArrow}');
      cy.get('body').type('{downArrow}');
      cy.contains('Score').contains('4');
    });

    it('should show the score', () => {
      cy.get('button').click();
      cy.get('body').type('{leftArrow}');
      cy.get('body').type('{downArrow}');
      cy.contains('Score').contains('4');
    });

    it('should reset the score', () => {
      cy.get('button').click();
      cy.get('body').type('{leftArrow}');
      cy.get('body').type('{downArrow}');
      cy.contains('Score').contains('4');
      cy.get('button').click();
      cy.contains('Score').contains('0');
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


