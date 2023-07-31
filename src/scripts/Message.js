'use strict';

class Message {
  constructor(element) {
    this.element = element;
  }

  setMessage(messageType) {
    const messages = this.element.querySelectorAll('.message');

    messages.forEach((message) => {
      if (message.classList.contains(`message-${messageType}`)) {
        message.classList.remove('hidden');
      } else {
        message.classList.add('hidden');
      }
    });
  }
}

module.exports = Message;
