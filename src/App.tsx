function App() {
  return (
    <div className="container">
      <div className="game-header">
        <h1>2048</h1>
        <div className="controls">
          <p className="info">
            Score: <span className="game-score">0</span>
          </p>
          <button type="button" className="button start">
            Start
          </button>
        </div>
      </div>

      <table className="game-field">
        <tbody>
          <tr className="field-row">
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
          </tr>

          <tr className="field-row">
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
          </tr>

          <tr className="field-row">
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
          </tr>

          <tr className="field-row">
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
            <td className="field-cell" />
          </tr>
        </tbody>
      </table>

      <div className="message-container">
        <p className="message message-lose hidden">
          You lose! Restart the game?
        </p>
        <p className="message message-win hidden">
          Winner! Congrats! You did it!
        </p>
        <p className="message message-start">
          Press &quot;Start&quot; to begin game. Good luck!
        </p>
      </div>
    </div>
  );
}

export default App;
