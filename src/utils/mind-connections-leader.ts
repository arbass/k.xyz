export const func_mindConnectionsLeader = () => {
  // Задержка запуска скрипта на 2.5 секунды
  setTimeout(() => {
    let currentLineStyleIndex = 1; // Индекс текущего стиля линии ('grid')
    const lineStyles = ['straight', 'grid', 'curved']; // Массив стилей линий
    const connectionsData = []; // Для хранения данных о соединениях
    const breakpoints = [480, 769, 992]; // Контрольные точки разрешений
    let previousWindowWidth = window.innerWidth; // Предыдущая ширина окна
    let shouldUpdateLines = true; // Флаг для контроля обновления линий

    // Функция для отрисовки всех соединений
    function drawConnections() {
      let svg = document.getElementById('connection-svg');
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', 'connection-svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.overflow = 'visible';
        svg.style.zIndex = '-1';
        document.body.insertBefore(svg, document.body.firstChild);
      }

      const connections = document.querySelectorAll('[mind-connection]');
      const lineThickness = 1; // Толщина линий
      const lineColor = '#666666'; // Цвет линий

      connections.forEach((startEl) => {
        const targetSelectors = startEl.getAttribute('mind-connection').split(',');

        targetSelectors.forEach((targetSelector) => {
          const trimmedSelector = targetSelector.trim();
          const endEl = document.querySelector(`[mind-connection="${trimmedSelector}"]`);

          if (!endEl) return;

          const isMobile = window.innerWidth < 768;
          const startElHiddenOnMobile = startEl.classList.contains('hide-on-mobile');
          const endElHiddenOnMobile = endEl.classList.contains('hide-on-mobile');

          if (isMobile && (startElHiddenOnMobile || endElHiddenOnMobile)) {
            return;
          }

          const isHorizontalAttr = startEl.getAttribute('data-start-horizontal');
          const isHorizontalStart =
            isHorizontalAttr !== null ? (isHorizontalAttr === 'true' ? true : false) : null;

          let connection = connectionsData.find(
            (data) => data.startEl === startEl && data.endEl === endEl
          );

          if (!connection) {
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

          updateLine(connection);
        });
      });
    }

    function updateLine(connection) {
      const { startEl, endEl, pathElement, isHorizontalStart } = connection;
      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();

      const x1 = +(startRect.left + startRect.width / 2 + window.scrollX).toFixed(2);
      const y1 = +(startRect.top + startRect.height / 2 + window.scrollY).toFixed(2);
      const x2 = +(endRect.left + endRect.width / 2 + window.scrollX).toFixed(2);
      const y2 = +(endRect.top + endRect.height / 2 + window.scrollY).toFixed(2);

      let path;
      const currentLineStyle = lineStyles[currentLineStyleIndex];

      if (currentLineStyle === 'straight') {
        path = `M ${x1} ${y1} L ${x2} ${y2}`;
      } else if (currentLineStyle === 'curved') {
        const dx = +((x2 - x1) / 2).toFixed(2);
        const dy = +((y2 - y1) / 2).toFixed(2);
        path = `M ${x1} ${y1} Q ${x1} ${y1 + dy}, ${x1 + dx} ${y1 + dy} T ${x2} ${y2}`;
      } else if (currentLineStyle === 'grid') {
        if (isHorizontalStart === null) {
          path = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else if (isHorizontalStart) {
          path = `M ${x1} ${y1} H ${x2} V ${y2}`;
        } else {
          path = `M ${x1} ${y1} V ${y2} H ${x2}`;
        }
      }

      const previousPath = pathElement.getAttribute('d');

      // Пропускаем анимацию, если значения одинаковы или изменения слишком малы
      if (
        previousPath === path ||
        (previousPath && previousPath.replace(/\s/g, '') === path.replace(/\s/g, '')) ||
        (Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1)
      ) {
        return;
      }

      if (previousPath && previousPath !== path) {
        pathElement.animate([{ d: previousPath }, { d: path }], {
          duration: 1000,
          fill: 'forwards',
        });
      }
      pathElement.setAttribute('d', path);
    }

    function updateAllLines() {
      if (!shouldUpdateLines) return;
      connectionsData.forEach((connection) => {
        updateLine(connection);
      });
      requestAnimationFrame(updateAllLines);
    }

    function setLineStyle(styleName) {
      const index = lineStyles.indexOf(styleName);
      if (index !== -1) {
        currentLineStyleIndex = index;
        connectionsData.forEach((connection) => {
          updateLine(connection);
        });
      }
    }

    function addHoverListeners() {
      const hoverElements = document.querySelectorAll('[hover-lines-changer]');
      hoverElements.forEach((element) => {
        element.addEventListener('mouseenter', onHover);
      });
    }

    function onHover(event) {
      if (window.innerWidth >= 768) {
        const element = event.currentTarget;
        const newLineStyle = element.getAttribute('hover-lines-changer');
        if (['straight', 'grid', 'fluid', 'curved'].includes(newLineStyle)) {
          const styleName = newLineStyle === 'fluid' ? 'curved' : newLineStyle;
          setLineStyle(styleName);
        }
      }
    }

    function restartScript() {
      const svg = document.getElementById('connection-svg');
      if (svg) {
        svg.parentNode.removeChild(svg);
      }

      connectionsData.length = 0;
      shouldUpdateLines = false;

      setTimeout(() => {
        previousWindowWidth = window.innerWidth;
        shouldUpdateLines = true;
        drawConnections();
        addHoverListeners();
      }, 1000);
    }

    drawConnections();
    requestAnimationFrame(updateAllLines);
    addHoverListeners();

    window.addEventListener('resize', () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        handleResize();
      }, 100);
    });

    function handleResize() {
      const currentWindowWidth = window.innerWidth;

      let crossedBreakpoint = false;

      for (const breakpoint of breakpoints) {
        if (
          (previousWindowWidth < breakpoint && currentWindowWidth >= breakpoint) ||
          (previousWindowWidth >= breakpoint && currentWindowWidth < breakpoint)
        ) {
          crossedBreakpoint = true;
          break;
        }
      }

      if (crossedBreakpoint) {
        restartScript();
      } else {
        drawConnections();
      }

      previousWindowWidth = currentWindowWidth;
    }
  }, 2500);
};
