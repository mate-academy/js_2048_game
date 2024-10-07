export const HEADER_HTML_TEMPLATE = `<h1>2048</h1>
  <div class="controls">
    <p class="info">
      Score:
      <span class="game-score" id="game-score">0</span>
    </p>
    <button
      class="button start"
        id="start"
      >
      Start
    </button>
    <button
      class="button restart hidden"
        id="restart"
      >
      Restart
    </button>
  </div>`;

export const FIELD_HTML_TEMPLATE = `<tbody>
    <tr class="field-row">
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
    </tr>

    <tr class="field-row">
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
    </tr>

    <tr class="field-row">
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
    </tr>

    <tr class="field-row">
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
      <td class="field-cell"></td>
    </tr>
  </tbody>`;

export const MESSAGE_LOSE_HTML_TEMPLATE = `<p class="message message-lose hidden" id="message-lose">You lose! Restart the game?</p>
  <p class="message message-win hidden" id="message-win">Winner! Congrats! You did it!</p>
  <p class="message message-start hidden" id="message-start">
    Press "Start" to begin game. Good luck!
  </p>`;
