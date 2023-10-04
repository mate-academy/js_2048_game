const message = document.querySelector('.message');

function hideMesagge() {
  setTimeout(() => {
    message.classList.add('hidden');
  }, 1000);
}

export function messageText(eventMessage) {
  message.classList.remove('hidden');
  message.classList.add('message');

  switch (eventMessage) {
    case 'start': {
      message.innerText = 'Press "Start" to begin game. Good luck!';
      message.classList.add('message-start');
      break;
    }

    case 'win': {
      message.innerText = 'Winner! Congrats! You did it!';

      message.classList

        .add('message-win');
      break;
    }

    case 'wrong-key': {
      message.innerText = 'Wooops wrong key!';
      hideMesagge();
      break;
    }

    case 'lose': {
      message.innerText = ' You lose! Restart the game?';

      message.classList.add('message-lose');
      break;
    }

    case 'skip': {
      // eslint-disable-next-line max-len
      message.innerText = 'The skip button is created just for checking if you can win without sitting for 30 minutes, as I did))))';

      message.classList.add('message-lose');
      break;
    }

    default: {
      message.innerText = ' Something went wrong! Let\'s just reload tab?';
      break;
    }
  }
}
