const messageClassOptions = [
  '.message-win',
  '.message-lose',
  '.message-start',
  '.message-restart',
];

const buttonClassOptions = ['.start', '.restart'];

const gameContainer = document.querySelector('.outer-container');

const playingClassForContainer = 'outer-container--playing-mode';
const playingClassForBody = 'body--playing-mode';

const makeMessageVisible = (classToAppear) => {
  const messageElementToAppear = document.querySelector(classToAppear);

  messageClassOptions.forEach((item) => {
    const messageElement = document.querySelector(item);

    messageElement.classList.add('hidden');
  });

  messageElementToAppear.classList.remove('hidden');
};

const switchButtons = (classToAppear) => {
  buttonClassOptions.forEach((btn) => {
    const element = document.querySelector(btn);

    if (!element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }

    if (btn === classToAppear && element.classList.contains('hidden')) {
      element.classList.remove('hidden');
    }
  });
};

const focusField = () => {
  if (!gameContainer.classList.contains(playingClassForContainer)) {
    gameContainer.classList.add(playingClassForContainer);
  }

  if (!document.body.classList.contains(playingClassForBody)) {
    document.body.classList.add(playingClassForBody);
  }
};

const defocusField = () => {
  if (gameContainer.classList.contains(playingClassForContainer)) {
    gameContainer.classList.remove(playingClassForContainer);
  }

  if (document.body.classList.contains(playingClassForBody)) {
    document.body.classList.remove(playingClassForBody);
  }
};

export default {
  makeMessageVisible,
  switchButtons,
  focusField,
  defocusField,
};
