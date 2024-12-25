let startX, startY, endX, endY;
const minDistance = 30;

export function onTouchStart(e) {
  const touch = e.touches[0];

  startX = touch.pageX;
  startY = touch.pageY;
}

export function onTouchEnd(e) {
  const touch = e.changedTouches[0];

  endX = touch.pageX;
  endY = touch.pageY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > minDistance) {
      e.key = 'ArrowRight';

      return e;
    }

    if (deltaX < -minDistance) {
      e.key = 'ArrowLeft';

      return e;
    }
  }

  if (deltaY > minDistance) {
    e.key = 'ArrowDown';

    return e;
  }

  if (deltaY < -minDistance) {
    e.key = 'ArrowUp';

    return e;
  }
}
