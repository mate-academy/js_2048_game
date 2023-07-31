'use strict';

const Field = require('./Field');
const Button = require('./Button');
const Message = require('./Message');
const Score = require('./Score');
const SwipeControls = require('./SwipeControls');

class Game {
  constructor() {
    this.START_VALUE = 2;
    this.END_VALUE = 2048;

    this.MESSAGES = {
      WIN: 'win',
      LOSE: 'lose',
      START: 'start',
    };

    const getRandomValue = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.score = new Score(document.querySelector('.game-score'));
    this.message = new Message(document.querySelector('.message-container'));
    this.field = new Field(document.querySelector('.game-field'));

    const onStart = () => {
      this.field.addTile(this.START_VALUE * getRandomValue(1, 2));
      this.field.addTile(this.START_VALUE * getRandomValue(1, 2));
      this.message.setMessage();
      this.controls.enabled = true;
    };

    const onRestart = () => {
      this.score.reset();
      this.message.setMessage(this.MESSAGES.START);
      this.field.reset();
      this.controls.enabled = false;
    };

    const onLeft = () => {
      const points = this.field.shiftLeft();

      this.score.addPoints(points);
    };

    const onRight = () => {
      const points = this.field.shiftRight();

      this.score.addPoints(points);
    };

    const onUp = () => {
      const points = this.field.shiftUp();

      this.score.addPoints(points);
    };

    const onDown = () => {
      const points = this.field.shiftDown();

      this.score.addPoints(points);
    };

    const onAction = () => {
      const maxValue = this.field.getMaxValue();

      if (maxValue === this.END_VALUE) {
        this.message.setMessage(this.MESSAGES.WIN);
        this.controls.enabled = false;

        return;
      }

      if (!this.field.hasAvailableMoves()) {
        this.message.setMessage(this.MESSAGES.LOSE);
        this.controls.enabled = false;

        return;
      }

      const newValue = this.START_VALUE * getRandomValue(1, 2);

      this.field.addTile(newValue);
    };

    this.button = new Button(
      document.querySelector('.controls .button'),
      onStart, onRestart
    );

    this.controls = new SwipeControls(onLeft, onRight, onUp, onDown, onAction);
    this.message.setMessage(this.MESSAGES.START);
  }
}

module.exports = Game;
