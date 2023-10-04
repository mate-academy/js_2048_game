const message = document.querySelector('.message');

function hideMesagge() {
  setTimeout(() => {
    message.classList.add('hidden');
  }, 1000);
}

export function messageText(eventMessage) {
  switch (eventMessage) {
    case 'start': {
      message.innerText = 'Press "Start" to begin game. Good luck!';
      message.classList.add('message-start');
      break;
    }

    case 'win': {
      message.innerText = 'Winner! Congrats! You did it!';
      message.classList.remove('hidden');

      message.classList
        .add('message')
        .add('message-win');
      break;
    }

    case 'wrong-key': {
      message.innerText = 'Wooops wrong key!';
      message.classList.remove('hidden');

      message.classList.add('message');
      hideMesagge();
      break;
    }

    case 'lose': {
      message.innerText = ' You lose! Restart the game?';
      message.classList.remove('hidden');

      message.classList
        .add('message')
        .add('message-lose');
      break;
    }

    default: {
      message.innerText = ' Something went wrong! Let\'s just reload tab?';
      message.classList.remove('hidden');
      break;
    }
  }
}
