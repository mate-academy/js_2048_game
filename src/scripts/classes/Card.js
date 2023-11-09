const ANIMATION_DURATION = 300;

export function createCard(weight = Math.random() < 0.1 ? 4 : 2) {
  const card = document.createElement('div');

  card.setXY = function(x, y) {
    this.x = x;
    this.y = y;

    this.style.setProperty('--x', x);
    this.style.setProperty('--y', y);
  };

  card.setWeight = function(newWeight) {
    this.weight = newWeight;
    card.className = '';
    card.classList.add(`card`, `card--${newWeight}`);
    card.textContent = newWeight;
  };

  card.remove = function() {
    this.parentNode.removeChild(this);
  };

  card.playAnimation = function(AnimationName, duration = ANIMATION_DURATION) {
    this.style.animation = `${AnimationName} ${duration}ms`;

    setTimeout(() => {
      this.style.animation = '';
    }, duration);
  };

  card.setWeight(weight);

  card.playAnimation('cardCreation');

  return card;
}
