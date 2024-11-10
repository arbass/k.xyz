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

  // src/utils/mind-connections.ts
  var func_mindConnections = () => {
    const all_mindDots = document.querySelectorAll("[mind-connection]");
    if (all_mindDots.length) {
      const groups = {};
      all_mindDots.forEach((el) => {
        const key = el.getAttribute("mind-connection");
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(el);
        const computedStyle = window.getComputedStyle(el);
        if (computedStyle.position === "static") {
          el.style.position = "relative";
        }
        el.style.zIndex = "2";
      });
      let svg = document.getElementById("mind-connection-svg");
      if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "mind-connection-svg");
        svg.style.position = "fixed";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "1";
        document.body.appendChild(svg);
      }
      const lines = [];
      Object.values(groups).forEach((group) => {
        if (group.length >= 2) {
          for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
              const el1 = group[i];
              const el2 = group[j];
              const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
              line.setAttribute("stroke", "rgb(102, 102, 102)");
              line.setAttribute("stroke-width", "1");
              const rect1 = el1.getBoundingClientRect();
              const rect2 = el2.getBoundingClientRect();
              const initialX = rect1.left + rect1.width / 2;
              const initialY = rect1.top + rect1.height / 2;
              line.setAttribute("x1", initialX);
              line.setAttribute("y1", initialY);
              line.setAttribute("x2", initialX);
              line.setAttribute("y2", initialY);
              svg.appendChild(line);
              lines.push({
                line,
                el1,
                el2,
                animated: false
                // Флаг для отслеживания анимации
              });
            }
          }
        }
      });
      const animateLine = (lineObj) => {
        const { line, el1, el2 } = lineObj;
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        const startX = rect1.left + rect1.width / 2;
        const startY = rect1.top + rect1.height / 2;
        const endX = rect2.left + rect2.width / 2;
        const endY = rect2.top + rect2.height / 2;
        const duration = 300;
        const startTime = performance.now();
        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;
          line.setAttribute("x2", currentX);
          line.setAttribute("y2", currentY);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            line.setAttribute("x2", endX);
            line.setAttribute("y2", endY);
            lineObj.animated = true;
          }
        };
        requestAnimationFrame(animate);
      };
      setTimeout(() => {
        lines.forEach((lineObj) => {
          animateLine(lineObj);
        });
      }, 2500);
      const updatePositions = () => {
        lines.forEach(({ line, el1, el2, animated }) => {
          const rect1 = el1.getBoundingClientRect();
          const rect2 = el2.getBoundingClientRect();
          const x1 = rect1.left + rect1.width / 2;
          const y1 = rect1.top + rect1.height / 2;
          const x2 = rect2.left + rect2.width / 2;
          const y2 = rect2.top + rect2.height / 2;
          line.setAttribute("x1", x1);
          line.setAttribute("y1", y1);
          if (animated) {
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
          }
        });
        requestAnimationFrame(updatePositions);
      };
      updatePositions();
    }
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
        console.log("\u0414\u0430\u043D\u043D\u044B\u0435 total-stats:", totalStats);
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

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    func_mindConnections();
    func_heroForm();
    func_collapseButtons();
    func_heightTransition();
    func_syncClick();
    func_buttonTextToggl();
    func_statsHero();
  });
})();
//# sourceMappingURL=index.js.map
