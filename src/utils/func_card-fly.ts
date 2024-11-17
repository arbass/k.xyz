export const func_cardFly = () => {
  console.log('func_cardFly initialized');

  const all_cardFly = document.querySelectorAll('[card-fly-parent]');
  console.log('all_cardFly:', all_cardFly);

  if (all_cardFly.length) {
    const toggle = document.querySelector('[card-fly-toggl]');
    console.log('test');

    const grid = document.querySelector('[card-fly-grid]');
    const cards = grid.querySelectorAll('[card-fly-child]');

    console.log('toggle:', toggle);
    console.log('grid:', grid);
    console.log('cards:', cards);

    let animationId = null;
    let floatingCards = [];

    // Устанавливаем начальные стили для режима сетки
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    grid.style.gridGap = '20px';
    grid.style.position = 'relative';
    grid.style.transition = 'all 0.5s ease';

    toggle.addEventListener('click', () => {
      console.log('Toggle clicked');

      if (grid.classList.contains('floating')) {
        console.log('Switching back to grid mode');

        // Возвращаемся в режим сетки
        grid.classList.remove('floating');
        grid.style.display = 'grid';

        // Останавливаем анимацию
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
          console.log('Animation stopped');
        }

        // Сбрасываем стили карточек
        cards.forEach((card, index) => {
          console.log(`Resetting styles for card ${index}`);
          card.style.position = '';
          card.style.left = '';
          card.style.top = '';
          card.style.opacity = '';
          card.style.transition = '';
        });
      } else {
        console.log('Switching to floating mode');

        // Переходим в режим плавного движения
        grid.classList.add('floating');
        grid.style.display = 'block'; // Убираем сетку

        const gridWidth = grid.clientWidth;
        const gridHeight = grid.clientHeight;

        console.log('gridWidth:', gridWidth);
        console.log('gridHeight:', gridHeight);

        floatingCards = [];

        cards.forEach((card, index) => {
          console.log(`Setting up card ${index}`);

          card.style.position = 'absolute';

          const cardWidth = card.offsetWidth;
          const cardHeight = card.offsetHeight;

          // Случайная горизонтальная позиция
          const randomLeft = Math.random() * (gridWidth - cardWidth);
          card.style.left = `${randomLeft}px`;

          // Начальная позиция внизу
          const startY = gridHeight;

          // Устанавливаем начальные стили
          card.style.top = `${startY}px`;
          card.style.opacity = '0';
          card.style.transition = 'opacity 1s ease-in-out';

          // Случайная скорость и задержка
          const speed = 0.5 + Math.random(); // пикселей за кадр
          const delay = Math.random() * 5000; // миллисекунд

          console.log(`Card ${index} speed: ${speed}, delay: ${delay}`);

          floatingCards.push({
            element: card,
            x: randomLeft,
            y: startY,
            width: cardWidth,
            height: cardHeight,
            speed: speed,
            delay: delay,
            startTime: null,
            opacity: 0,
          });
        });

        // Функция анимации
        function animate(time) {
          animationId = requestAnimationFrame(animate);

          floatingCards.forEach((cardObj, index) => {
            if (!cardObj.startTime) {
              cardObj.startTime = time + cardObj.delay;
              return;
            }

            const elapsed = time - cardObj.startTime;
            if (elapsed < 0) {
              return; // Все еще в периоде задержки
            }

            // Обновляем позицию
            cardObj.y -= cardObj.speed;

            // Обновляем прозрачность для плавного появления и исчезновения
            const totalDistance = gridHeight + cardObj.height * 2;
            const progress = (gridHeight - cardObj.y) / totalDistance;

            if (progress < 0.1) {
              cardObj.opacity = progress / 0.1; // Появление
            } else if (progress > 0.9) {
              cardObj.opacity = (1 - progress) / 0.1; // Исчезновение
            } else {
              cardObj.opacity = 1;
            }

            cardObj.element.style.top = `${cardObj.y}px`;
            cardObj.element.style.opacity = cardObj.opacity;

            // Сбрасываем позицию, если карточка вышла за верхнюю границу
            if (cardObj.y + cardObj.height < 0) {
              console.log(`Card ${index} reached top, resetting position`);
              cardObj.y = gridHeight;
              cardObj.startTime = time + cardObj.delay;
            }
          });
        }

        animationId = requestAnimationFrame(animate);
        console.log('Animation started');
      }
    });
  } else {
    console.log('No elements found with [card-fly-parent]');
  }
};
