'use strict';

const HIDDEN_CLASS = 'hidden';

export class MessageView {
  constructor(root) {
    this.messages = {
      idle: root.querySelector('.message-start'),
      win: root.querySelector('.message-win'),
      lose: root.querySelector('.message-lose'),
    };
  }

  render(gameStatus) {
    Object.keys(this.messages).forEach((messageStatus) => {
      const isCurrent = messageStatus === gameStatus;

      this.messages[messageStatus].classList.toggle(HIDDEN_CLASS, !isCurrent);
    });
  }
}
