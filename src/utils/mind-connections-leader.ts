//chatgpt.com/c/6734b5cd-8f54-8002-882d-9b9a64349588

// Задержка запуска скрипта на 2.5 секунды
https: setTimeout(() => {
  let currentLineStyleIndex = 1; // Индекс текущего стиля линии ('grid')
  const lineStyles = ['straight', 'grid', 'curved']; // Массив стилей линий
  const connectionsData = []; // Для хранения данных о соединениях

  // Функция для отрисовки всех соединений
  function drawConnections() {
    // Если SVG еще не создан, создаем его
    let svg = document.getElementById('connection-svg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'connection-svg');
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.pointerEvents = 'none'; // Чтобы SVG не перекрывал другие элементы
      svg.style.overflow = 'visible'; // Чтобы линии не обрезались
      document.body.appendChild(svg);
    }

    const connections = document.querySelectorAll('[mind-connection]');

    // Задайте толщину и цвет линии
    const lineThickness = 1; // Ваша изначальная толщина
    const lineColor = '#666666'; // Цвет линий

    // Обновляем или создаем линии
    connections.forEach((startEl) => {
      const targetSelector = startEl.getAttribute('mind-connection');
      const matchingElements = document.querySelectorAll(`[mind-connection="${targetSelector}"]`);

      // Предполагается, что первый элемент — начало, а второй — конец
      if (matchingElements.length >= 2) {
        const endEl = matchingElements[1];
        const isHorizontalAttr = startEl.getAttribute('data-start-horizontal');
        const isHorizontalStart =
          isHorizontalAttr !== null ? (isHorizontalAttr === 'true' ? true : false) : null;

        // Ищем существующие данные о линии между этими элементами
        let connection = connectionsData.find(
          (data) => data.startEl === startEl && data.endEl === endEl
        );

        if (!connection) {
          // Если соединения еще нет, создаем новое
          const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          pathElement.setAttribute('stroke', lineColor);
          pathElement.setAttribute('stroke-width', lineThickness);
          pathElement.setAttribute('fill', 'none');
          pathElement.classList.add('connection-line');
          svg.appendChild(pathElement);

          connection = {
            startEl,
            endEl,
            pathElement,
            isHorizontalStart,
          };
          connectionsData.push(connection);
        }

        // Обновляем позицию линии
        updateLine(connection);
      }
    });
  }

  // Функция для обновления линии
  function updateLine(connection) {
    const { startEl, endEl, pathElement, isHorizontalStart } = connection;
    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();

    const x1 = startRect.left + startRect.width / 2 + window.scrollX;
    const y1 = startRect.top + startRect.height / 2 + window.scrollY;
    const x2 = endRect.left + endRect.width / 2 + window.scrollX;
    const y2 = endRect.top + endRect.height / 2 + window.scrollY;

    let path;
    const currentLineStyle = lineStyles[currentLineStyleIndex];

    if (currentLineStyle === 'straight') {
      // Прямая линия
      path = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (currentLineStyle === 'curved') {
      // Плавная кривая
      const dx = (x2 - x1) / 2;
      const dy = (y2 - y1) / 2;
      path = `M ${x1} ${y1} Q ${x1} ${y1 + dy}, ${x1 + dx} ${y1 + dy} T ${x2} ${y2}`;
    } else if (currentLineStyle === 'grid') {
      // Ломаная линия с углами
      if (isHorizontalStart === null) {
        // Если направление не указано, рисуем прямую линию
        path = `M ${x1} ${y1} L ${x2} ${y2}`;
      } else if (isHorizontalStart) {
        // Горизонтальное начало
        path = `M ${x1} ${y1} H ${x2} V ${y2}`;
      } else {
        // Вертикальное начало
        path = `M ${x1} ${y1} V ${y2} H ${x2}`;
      }
    }

    const previousPath = pathElement.getAttribute('d');
    if (previousPath !== path) {
      // Анимируем переход между путями
      pathElement.animate([{ d: previousPath }, { d: path }], {
        duration: 1000,
        fill: 'forwards',
      });
      pathElement.setAttribute('d', path);
    }
  }

  // Функция для обновления всех линий (используется для анимации)
  function updateAllLines() {
    connectionsData.forEach((connection) => {
      updateLine(connection);
    });
    requestAnimationFrame(updateAllLines);
  }

  // Функция для установки стиля линий
  function setLineStyle(styleName) {
    const index = lineStyles.indexOf(styleName);
    if (index !== -1) {
      currentLineStyleIndex = index;
      // Перерисовываем линии
      connectionsData.forEach((connection) => {
        updateLine(connection);
      });
    }
  }

  // Обработчики наведения
  function addHoverListeners() {
    const hoverElements = document.querySelectorAll('[hover-lines-changer]');
    hoverElements.forEach((element) => {
      element.addEventListener('mouseenter', onHover);
      // Не добавляем обработчик 'mouseleave', так как эффект должен сохраняться
    });
  }

  function onHover(event) {
    if (window.innerWidth >= 992) {
      const element = event.currentTarget;
      const newLineStyle = element.getAttribute('hover-lines-changer');
      if (['straight', 'grid', 'fluid', 'curved'].includes(newLineStyle)) {
        const styleName = newLineStyle === 'fluid' ? 'curved' : newLineStyle;
        setLineStyle(styleName);
      }
    }
  }

  // Первая отрисовка
  drawConnections();
  // Запускаем обновление линий
  requestAnimationFrame(updateAllLines);
  // Добавляем обработчики наведения
  addHoverListeners();

  // Перерисовка при изменении размера окна
  window.addEventListener('resize', () => {
    // Используем debounce, чтобы не вызывать функцию слишком часто
    clearTimeout(window.drawConnectionsTimeout);
    window.drawConnectionsTimeout = setTimeout(() => {
      drawConnections();
    }, 100);
  });

  // Наблюдатель за изменениями в DOM
  const observer = new MutationObserver(() => {
    connectionsData.forEach((connection) => {
      updateLine(connection);
    });
  });

  // Настройки наблюдателя
  const config = { attributes: true, childList: true, subtree: true, characterData: true };

  // Начинаем наблюдение за документом
  observer.observe(document.body, config);

  // Удаляем этот блок, чтобы отключить переключение стиля линий по интервалу
  // setInterval(() => {
  //   toggleLineStyle();
  // }, 10000);
}, 2500);