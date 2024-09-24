export const func_mindConnections = () => {
  const all_mindDots = document.querySelectorAll('[mind-connection]');
  if (all_mindDots.length) {
    // Group elements by 'mind-connection' attribute value
    const groups = {};
    all_mindDots.forEach((el) => {
      const key = el.getAttribute('mind-connection');
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(el);

      // Ensure each element has a higher z-index than the SVG
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'static') {
        el.style.position = 'relative'; // Ensure it can have z-index applied
      }
      el.style.zIndex = '2'; // Set a higher z-index than the SVG
    });

    // Create an SVG element to hold the lines
    let svg = document.getElementById('mind-connection-svg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'mind-connection-svg');
      svg.style.position = 'fixed';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.pointerEvents = 'none'; // So it doesn't block clicks
      svg.style.zIndex = '1'; // Set lower than the elements
      document.body.appendChild(svg);
    }

    // Store lines for updating positions
    const lines = [];

    Object.values(groups).forEach((group) => {
      if (group.length >= 2) {
        // Connect every element to every other element in the group
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const el1 = group[i];
            const el2 = group[j];

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('stroke', 'rgb(102, 102, 102)'); // Gray 600
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
            lines.push({ line, el1, el2 });
          }
        }
      }
    });

    // Function to update the positions of the lines
    const updatePositions = () => {
      lines.forEach(({ line, el1, el2 }) => {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
      });

      requestAnimationFrame(updatePositions);
    };

    // Start updating positions
    updatePositions();
  }
};
