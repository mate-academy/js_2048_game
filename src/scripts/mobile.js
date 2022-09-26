'use strict';

// - Module for mobile phones:
// |-- To be able to play on mobile phones using swipes:
function mobileSwipes(field) {
  let touchstartX = 0;
  let touchendX = 0;
  let touchstartY = 0;
  let touchendY = 0;

  field.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
  });

  field.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    checkDirection(touchstartX, touchendX, touchstartY, touchendY);
  });
}

function checkDirection(startX, endX, startY, endY) {
  const e = new Event('keyup');

  if (endX < startX && startX - endX >= 100) {
    e.key = 'ArrowLeft';
  } else if (endX > startX && endX - startX >= 100) {
    e.key = 'ArrowRight';
  } else if (endY < startY && startY - endY >= 100) {
    e.key = 'ArrowUp';
  } else if (endY > startY && endY - startY >= 100) {
    e.key = 'ArrowDown';
  }

  document.body.dispatchEvent(e);
}

module.exports = {
  mobileSwipes,
};
