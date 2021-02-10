'use strict';

Cypress.Commands.add('shuffleBoxes', (arrow1, arrow2, times) => {
  cy.get('.button.start').click();

  for (let n = 0; n < times; n++) {
    cy.get('body').type(arrow1);
    cy.get('body').type(arrow2);
  }
});

describe('2048 game', () => {
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

    cy.contains('You lose! Restart the game?')
      .should('be.visible');
  });
});
