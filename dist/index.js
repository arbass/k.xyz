"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"https://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/button-text-toggl.ts
  var func_buttonTextToggl = () => {
    const all_newAlements = document.querySelectorAll("[button-text-toggl]");
    if (all_newAlements.length) {
      all_newAlements.forEach((button) => {
        const textElement = button.querySelector("[button-text-toggl-values]");
        if (textElement) {
          const values = textElement.getAttribute("button-text-toggl-values").split("/");
          if (values.length === 2) {
            textElement.textContent = values[0];
            button.addEventListener("click", (e) => {
              e.preventDefault();
              const currentText = textElement.textContent;
              textElement.textContent = currentText === values[0] ? values[1] : values[0];
            });
          }
        }
      });
    }
  };

  // src/utils/collapse-buttons.ts
  var func_collapseButtons = () => {
    const allSections = document.querySelectorAll("[collapse-section]");
    if (allSections.length) {
      allSections.forEach((section) => {
        const button = section.querySelector("[collapse-button]");
        const elementsToToggle = section.querySelectorAll("[collapse-element-class]");
        if (button) {
          button.addEventListener("click", () => {
            button.classList.toggle("is-active");
            elementsToToggle.forEach((element) => {
              const classToToggle = element.getAttribute("collapse-element-class");
              if (classToToggle) {
                element.classList.toggle(classToToggle);
              }
            });
          });
        }
      });
    }
  };

  // src/utils/height-transition.ts
  var func_heightTransition = () => {
    const allElements = document.querySelectorAll("[height-transition]");
    if (allElements.length) {
      allElements.forEach((element) => {
        const transitionDuration = element.getAttribute("height-transition") || "0.5s";
        element.style.overflow = "hidden";
        element.style.transitionProperty = "max-height, opacity";
        element.style.transitionDuration = `${transitionDuration}, ${transitionDuration}`;
        element.style.transitionTimingFunction = "ease, ease";
        if (element.classList.contains("collapsed")) {
          element.style.maxHeight = "0";
          element.style.opacity = "0";
        } else {
          element.style.maxHeight = element.scrollHeight + "px";
          element.style.opacity = "1";
        }
        const observer = new MutationObserver(() => {
          if (element.classList.contains("collapsed")) {
            element.style.transitionProperty = "max-height, opacity";
            element.style.transitionDuration = `${transitionDuration}, ${transitionDuration}`;
            element.style.maxHeight = "0";
            element.style.opacity = "0";
          } else {
            element.style.transitionProperty = "max-height";
            element.style.transitionDuration = `${transitionDuration}`;
            element.style.maxHeight = element.scrollHeight + "px";
            setTimeout(() => {
              element.style.transitionProperty = "opacity";
              element.style.transitionDuration = `${transitionDuration}`;
              element.style.opacity = "1";
            }, 500);
          }
        });
        observer.observe(element, { attributes: true, attributeFilter: ["class"] });
      });
    }
  };

  // src/utils/hero-form.ts
  var func_heroForm = () => {
    const form = document.getElementById("main-hero-form");
    const formInputs = document.querySelectorAll("[form-step-input]");
    const figmaInput = document.querySelector('[form-step-input="1"]');
    const emailInput = document.querySelector('[form-step-input="2"]');
    const messageInput = document.querySelector('[form-step-input="3"]');
    const submitButton = document.querySelector('[fs-mirrorclick-element="trigger"]');
    const filledSteps = /* @__PURE__ */ new Set();
    formInputs.forEach((input) => {
      input.addEventListener("input", handleInputChange);
      input.addEventListener("focus", handleInputFocus);
    });
    function handleInputFocus(event) {
      const input = event.target;
      const step = parseInt(input.getAttribute("form-step-input"), 10);
      updateActiveArrow(step);
    }
    function handleInputChange(event) {
      const input = event.target;
      const step = parseInt(input.getAttribute("form-step-input"), 10);
      const value = input.value.trim();
      if (input.errorTimeout) {
        clearTimeout(input.errorTimeout);
        input.errorTimeout = null;
      }
      const isValid = isValidInput(step, value);
      performValidation(input, step, value);
      if (isValid) {
        input.classList.remove("input-error");
      } else {
        if (step === 1) {
          input.classList.add("input-error");
        } else {
          input.errorTimeout = setTimeout(() => {
            const currentValue = input.value.trim();
            const currentIsValid = isValidInput(step, currentValue);
            if (!currentIsValid) {
              input.classList.add("input-error");
            }
            input.errorTimeout = null;
          }, 3e3);
        }
      }
    }
    function isValidFigmaLink(value) {
      try {
        const url = new URL(value);
        return url.hostname.toLowerCase().includes("figma.com");
      } catch (e) {
        return false;
      }
    }
    function validateEmail(email) {
      const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      return re.test(email);
    }
    function isValidInput(step, value) {
      if (step === 1) {
        return value === "" || isValidFigmaLink(value);
      }
      if (step === 2) {
        return validateEmail(value);
      }
      if (step === 3) {
        return value.length >= 5;
      }
      return false;
    }
    function performValidation(input, step, value) {
      filledSteps.delete(step);
      const isValid = isValidInput(step, value);
      if (step === 1) {
        if (value !== "" && isValidFigmaLink(value)) {
          filledSteps.add(step);
        }
      } else {
        if (isValid) {
          filledSteps.add(step);
        }
      }
      if (isValid) {
        if (step === 1) {
          input.placeholder = "link to figma project";
        }
        if (step === 2) {
          input.placeholder = "email";
        }
        if (step === 3) {
          input.placeholder = "detail about the project (scope, deadlines)";
        }
      } else {
        if (step === 1) {
          input.placeholder = "Please enter a valid Figma link";
        }
        if (step === 2) {
          input.placeholder = "Please enter a valid email address";
        }
        if (step === 3) {
          input.placeholder = "Please enter at least 5 characters";
        }
        resetUIFromStep(step);
      }
      updateUI();
      updateSubmitButtonState();
    }
    function resetUIFromStep(stepNum) {
      for (let i = stepNum; i <= 3; i++) {
        const ill = document.querySelector(`[form-step-ill="${i}"]`);
        ill && ill.classList.remove("is-active");
        const progressItem = document.querySelector(`[form-step-progress-item="${i}"]`);
        if (progressItem) {
          const lineFiller = progressItem.querySelector(".steps-grid_item-line-filler");
          const stepName = progressItem.querySelector(".rg-12.is-step-name");
          lineFiller && lineFiller.classList.remove("is-active");
          stepName && stepName.classList.remove("is-active");
        }
        const icon = document.querySelector(`.figma-zone-steps-icons_item[form-step-ill="${i}"]`);
        icon && icon.classList.remove("is-active");
      }
    }
    function updateActiveArrow(stepNum) {
      const illArrows = document.querySelectorAll("[form-step-ill-arrow]");
      illArrows.forEach((arrow) => {
        const arrowStep = parseInt(arrow.getAttribute("form-step-ill-arrow"), 10);
        if (arrowStep === stepNum) {
          arrow.classList.add("is-active");
        } else {
          arrow.classList.remove("is-active");
        }
      });
    }
    function updateUI() {
      for (let i = 1; i <= 3; i++) {
        const ill = document.querySelector(`[form-step-ill="${i}"]`);
        if (filledSteps.has(i)) {
          ill && ill.classList.add("is-active");
        } else {
          ill && ill.classList.remove("is-active");
        }
      }
      for (let i = 1; i <= 3; i++) {
        const progressItem = document.querySelector(`[form-step-progress-item="${i}"]`);
        if (progressItem) {
          const lineFiller = progressItem.querySelector(".steps-grid_item-line-filler");
          const stepName = progressItem.querySelector(".rg-12.is-step-name");
          if (filledSteps.has(i)) {
            lineFiller && lineFiller.classList.add("is-active");
            stepName && stepName.classList.add("is-active");
          } else {
            lineFiller && lineFiller.classList.remove("is-active");
            stepName && stepName.classList.remove("is-active");
          }
        }
      }
      for (let i = 1; i <= 3; i++) {
        const icon = document.querySelector(`.figma-zone-steps-icons_item[form-step-ill="${i}"]`);
        if (filledSteps.has(i)) {
          icon && icon.classList.add("is-active");
        } else {
          icon && icon.classList.remove("is-active");
        }
      }
    }
    function updateSubmitButtonState() {
      if (isFormValid()) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
    }
    function isFormValid() {
      return isValidInput(1, figmaInput.value.trim()) && isValidInput(2, emailInput.value.trim()) && isValidInput(3, messageInput.value.trim());
    }
    form.addEventListener("submit", function(event) {
      if (!isFormValid()) {
        event.preventDefault();
        event.stopPropagation();
        if (!isValidInput(1, figmaInput.value.trim())) {
          figmaInput.classList.add("input-blink");
          setTimeout(() => {
            figmaInput.classList.remove("input-blink");
          }, 1500);
        }
        return false;
      }
    });
    updateSubmitButtonState();
  };
  func_heroForm();

  // src/utils/mind-connections-leader.ts
  var func_mindConnectionsLeader = () => {
    setTimeout(() => {
      let currentLineStyleIndex = 1;
      const lineStyles = ["straight", "grid", "curved"];
      const connectionsData = [];
      const breakpoints = [480, 769, 992];
      let previousWindowWidth = window.innerWidth;
      let shouldUpdateLines = true;
      function drawConnections() {
        let svg = document.getElementById("connection-svg");
        if (!svg) {
          svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("id", "connection-svg");
          svg.style.position = "absolute";
          svg.style.top = "0";
          svg.style.left = "0";
          svg.style.width = "100%";
          svg.style.height = "100%";
          svg.style.pointerEvents = "none";
          svg.style.overflow = "visible";
          svg.style.zIndex = "-1";
          document.body.insertBefore(svg, document.body.firstChild);
        }
        const connections = document.querySelectorAll("[mind-connection]");
        const lineThickness = 1;
        const lineColor = "#666666";
        connections.forEach((startEl) => {
          const targetSelectors = startEl.getAttribute("mind-connection").split(",").map((selector) => selector.trim());
          targetSelectors.forEach((targetSelector) => {
            const matchingElements = document.querySelectorAll(
              `[mind-connection~="${targetSelector}"]`
            );
            if (matchingElements.length > 0) {
              const endEl = matchingElements[0];
              const isMobile = window.innerWidth < 768;
              const startElHiddenOnMobile = startEl.classList.contains("hide-on-mobile");
              const endElHiddenOnMobile = endEl.classList.contains("hide-on-mobile");
              if (isMobile && (startElHiddenOnMobile || endElHiddenOnMobile)) {
                return;
              }
              const isHorizontalAttr = startEl.getAttribute("data-start-horizontal");
              const isHorizontalStart = isHorizontalAttr !== null ? isHorizontalAttr === "true" ? true : false : null;
              let connection = connectionsData.find(
                (data) => data.startEl === startEl && data.endEl === endEl
              );
              if (!connection) {
                const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                pathElement.setAttribute("stroke", lineColor);
                pathElement.setAttribute("stroke-width", lineThickness);
                pathElement.setAttribute("fill", "none");
                pathElement.classList.add("connection-line");
                svg.appendChild(pathElement);
                connection = {
                  startEl,
                  endEl,
                  pathElement,
                  isHorizontalStart
                };
                connectionsData.push(connection);
              }
              updateLine(connection);
            }
          });
        });
      }
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
        if (currentLineStyle === "straight") {
          path = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else if (currentLineStyle === "curved") {
          const dx = (x2 - x1) / 2;
          const dy = (y2 - y1) / 2;
          path = `M ${x1} ${y1} Q ${x1} ${y1 + dy}, ${x1 + dx} ${y1 + dy} T ${x2} ${y2}`;
        } else if (currentLineStyle === "grid") {
          if (isHorizontalStart === null) {
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
          } else if (isHorizontalStart) {
            path = `M ${x1} ${y1} H ${x2} V ${y2}`;
          } else {
            path = `M ${x1} ${y1} V ${y2} H ${x2}`;
          }
        }
        const previousPath = pathElement.getAttribute("d");
        if (previousPath !== path) {
          pathElement.setAttribute("d", path);
        }
      }
      function updateAllLines() {
        if (!shouldUpdateLines)
          return;
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
        const hoverElements = document.querySelectorAll("[hover-lines-changer]");
        hoverElements.forEach((element) => {
          element.addEventListener("mouseenter", onHover);
        });
      }
      function onHover(event) {
        if (window.innerWidth >= 768) {
          const element = event.currentTarget;
          const newLineStyle = element.getAttribute("hover-lines-changer");
          if (["straight", "grid", "fluid", "curved"].includes(newLineStyle)) {
            const styleName = newLineStyle === "fluid" ? "curved" : newLineStyle;
            setLineStyle(styleName);
          }
        }
      }
      function restartScript() {
        const svg = document.getElementById("connection-svg");
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
        }, 1e3);
      }
      drawConnections();
      requestAnimationFrame(updateAllLines);
      addHoverListeners();
      window.addEventListener("resize", () => {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
          handleResize();
        }, 100);
      });
      function handleResize() {
        const currentWindowWidth = window.innerWidth;
        let crossedBreakpoint = false;
        for (const breakpoint of breakpoints) {
          if (previousWindowWidth < breakpoint && currentWindowWidth >= breakpoint || previousWindowWidth >= breakpoint && currentWindowWidth < breakpoint) {
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
      const observer = new MutationObserver(() => {
        connectionsData.forEach((connection) => {
          updateLine(connection);
        });
      });
      const config = { attributes: true, childList: true, subtree: true, characterData: true };
      observer.observe(document.body, config);
    }, 2500);
  };

  // src/utils/stats-hero.ts
  var func_statsHero = () => {
    const all_func_statsHero = document.querySelectorAll(".card.is-hero-orange-section");
    if (all_func_statsHero.length) {
      fetch("https://dev.kopytok.xyz/site-stats").then((response) => {
        if (!response.ok) {
          throw new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445");
        }
        return response.json();
      }).then((data) => {
        const totalStats = data["total-stats"];
        for (const key in totalStats) {
          if (totalStats.hasOwnProperty(key)) {
            const element = document.getElementById(key);
            if (element) {
              element.textContent = totalStats[key];
            }
          }
        }
      }).catch((error) => {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430:", error);
      });
    }
  };

  // src/utils/sync-click.ts
  var func_syncClick = () => {
    const all_newElements = document.querySelectorAll("[sync-click]");
    const elementPairs = /* @__PURE__ */ new Map();
    const recentlyClicked = /* @__PURE__ */ new WeakSet();
    all_newElements.forEach((el) => {
      const syncValue = el.getAttribute("sync-click");
      if (!elementPairs.has(syncValue)) {
        elementPairs.set(syncValue, []);
      }
      elementPairs.get(syncValue).push(el);
    });
    elementPairs.forEach((elements, syncValue) => {
      if (elements.length !== 2) {
        elementPairs.delete(syncValue);
      }
    });
    const temporarilyDisableSyncClick = (element) => {
      recentlyClicked.add(element);
      setTimeout(() => {
        recentlyClicked.delete(element);
      }, 500);
    };
    elementPairs.forEach((elements) => {
      const [el1, el2] = elements;
      el1.addEventListener("click", () => {
        if (!recentlyClicked.has(el1)) {
          temporarilyDisableSyncClick(el1);
          if (!recentlyClicked.has(el2)) {
            el2.click();
          }
        }
      });
      el2.addEventListener("click", () => {
        if (!recentlyClicked.has(el2)) {
          temporarilyDisableSyncClick(el2);
          if (!recentlyClicked.has(el1)) {
            el1.click();
          }
        }
      });
    });
  };

  // src/utils/toggl-class-trigger-target.ts
  var func_togglClassTriggerTarget = () => {
    const all_togglClassTriggerTarget = document.querySelectorAll("[toggl-class-trigger]");
    if (all_togglClassTriggerTarget.length) {
      all_togglClassTriggerTarget.forEach((trigger) => {
        trigger.addEventListener("click", () => {
          const triggerValue = trigger.getAttribute("toggl-class-trigger");
          const targetElement = document.querySelector(`[toggl-class-target="${triggerValue}"]`);
          if (targetElement) {
            const className = targetElement.getAttribute("toggl-class-name");
            if (className) {
              targetElement.classList.toggle(className);
            }
          }
        });
      });
    }
  };

  // src/utils/year-counter.ts
  var func_yearCounter = () => {
    const all_yearCounter = document.querySelectorAll("[year-counter]");
    if (all_yearCounter.length) {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const yearsPassed = currentYear - 2016;
      all_yearCounter.forEach((element) => {
        element.textContent = yearsPassed;
      });
    }
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    func_heroForm();
    func_collapseButtons();
    func_heightTransition();
    func_syncClick();
    func_buttonTextToggl();
    func_statsHero();
    func_yearCounter();
    func_togglClassTriggerTarget();
    func_mindConnectionsLeader();
  });
})();
//# sourceMappingURL=index.js.map
