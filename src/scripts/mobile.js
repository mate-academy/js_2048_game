'use strict';

function checkDirection(startX, endX, startY, endY) {
  const e = new Event('keyup');

  if (endX < startX && startX - endX >= 100) {
    e.key = 'ArrowLeft';
    document.body.dispatchEvent(e);
  } else if (endX > startX && endX - startX >= 100) {
    e.key = 'ArrowRight';
    document.body.dispatchEvent(e);
  } else if (endY < startY && startY - endY >= 100) {
    e.key = 'ArrowUp';
    document.body.dispatchEvent(e);
  } else if (endY > startY && endY - startY >= 100) {
    e.key = 'ArrowDown';
    document.body.dispatchEvent(e);
  }
}

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

module.exports = {
  mobileSwipes,
};
