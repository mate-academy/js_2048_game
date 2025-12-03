'use strict';

import { Modal } from './Modal.class';
import { Sound } from './Sound.class';
import mainThemeUrl from 'url:../audio/Stranglers-GoldenBrown.mp3';

/**
 * Class for score record
 */
export class ScoreRecord {
  /**
   * Name
   * @type {String}
   * @public
   */
  nickname;

  /**
   * Score
   * @type {number}
   * @public
   */
  score;

  /**
   * Constructor
   *
   * @param nickname
   * @param score
   */
  constructor(nickname, score) {
    this.nickname = nickname;
    this.score = score;
  }
}

/**
 * Class for score window
 */
export class Score extends Modal {
  /**
   * High-score local storage key
   * @type {String}
   * @private
   */
  static #highScoreLocalStorage = 'highScore';

  /**
   * High-score container selector
   * @type {string}
   */
  static #highScoreContainerSelector = '.window-score-body';

  /**
   * Score record selector
   * @type {string}
   */
  static #scoreRecordSelector = '.score-record';

  /**
   * High-score container
   * @private
   */
  #highScoreContainer;

  /**
   * Score board
   * @type {[ScoreRecord]} score board
   * @private
   */
  static #scoreBoardFallback = [
    { nickname: 'OOO', score: 1024 },
    { nickname: 'OOO', score: 512 },
    { nickname: 'PPP', score: 256 },
    { nickname: 'SSS', score: 128 },
    { nickname: 'III', score: 64 },
    { nickname: 'DDD', score: 32 },
    { nickname: 'III', score: 16 },
    { nickname: 'DDD', score: 8 },
    { nickname: 'III', score: 4 },
    { nickname: 'TTT', score: 2 },
  ];

  /**
   * Actual scoreboard
   * @type {[ScoreRecord]}
   */
  #scoreBoard = [];

  /**
   * Score board records limit
   * @type {number}
   */
  static #scoreBoardLimit = 10;

  /**
   * Main sound theme path
   * @type {string}
   */
  static #mainThemePath = mainThemeUrl;

  /**
   * Constructor
   *
   * @param args
   */
  constructor(...args) {
    super(...args);
    this._postInit();
  }

  /**
   * Initializes high-score table and animation
   *
   * @private
   */
  _postInit() {
    // define this scope for _show
    this._show = this._show.bind(this);

    if (
      (this.#scoreBoard = localStorage.getItem(Score.#highScoreLocalStorage))
    ) {
      try {
        this.#scoreBoard = JSON.parse(this.#scoreBoard);
      } catch (e) {
        // suppress non-epic issues
      }
    }

    // fallback to constant scores
    if (!Array.isArray(this.#scoreBoard) || this.#scoreBoard.length === 0) {
      this.#scoreBoard = Score.#scoreBoardFallback;
    }

    this.#highScoreContainer = document.querySelector(
      Score.#highScoreContainerSelector,
    );

    if (!this.#highScoreContainer) {
      throw new Error('highScoreContainer is not defined');
    }

    // Init visuals
    for (const record of this.#scoreBoard) {
      const recordElement = document.createElement('div');

      recordElement.className = 'score-record';

      recordElement.innerHTML = `
        <div class="score-record-nickname">${record.nickname}</div>
        <div class="score-record-score">${record.score}</div>
      `;

      this.#highScoreContainer.appendChild(recordElement);
    }

    // CTA to hide high-score table
    this.#highScoreContainer.addEventListener('click', () => {
      this.#highScoreContainer
        .querySelectorAll(Score.#scoreRecordSelector)
        .forEach((el) => el.classList.add('hidden'));
    });
  }

  _show() {
    super._show();
    Sound.play(Score.#mainThemePath, true);

    this.#highScoreContainer
      .querySelectorAll(Score.#scoreRecordSelector)
      .forEach((el) => el.classList.remove('hidden'));
  }

  addScore(nickname, score) {
    if (
      typeof nickname !== 'string' ||
      nickname.length !== 3 ||
      !Number.isInteger(score) ||
      score < 0
    ) {
      throw new Error('Invalid nickname or score');
    }

    this.#scoreBoard.push(new ScoreRecord(nickname, score));
    this.#scoreBoard.sort((a, b) => b.score - a.score);
    this.#scoreBoard.splice(Score.#scoreBoardLimit);

    localStorage.setItem(
      Score.#highScoreLocalStorage,
      JSON.stringify(this.#scoreBoard),
    );
  }
}
