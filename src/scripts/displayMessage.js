/**
 *
 * @param {Object<string, HTMLElement>} HTMLMessages
 * @param {string} gameStatus
 * @param {string} hiddenClass
 */
function displayMessage(HTMLMessages, gameStatus, hiddenClass) {
  for (const HTMLMessage in HTMLMessages) {
    if (!HTMLMessages[HTMLMessage].classList.contains(hiddenClass)) {
      HTMLMessages[HTMLMessage].classList.add(hiddenClass);
    }
  }

  HTMLMessages[gameStatus]?.classList.remove(hiddenClass);
}

module.exports = displayMessage;
