//https://chatgpt.com/c/67054b69-b9f4-8002-af18-ce204dd0cf9c
//----

export const func_heroForm = () => {
  const form = document.getElementById('main-hero-form');
  const formInputs = document.querySelectorAll('[form-step-input]');
  const figmaInput = document.querySelector('[form-step-input="1"]');
  const emailInput = document.querySelector('[form-step-input="2"]');
  const messageInput = document.querySelector('[form-step-input="3"]');
  const submitButton = document.querySelector('[fs-mirrorclick-element="trigger"]');

  const filledSteps = new Set();

  formInputs.forEach((input) => {
    input.addEventListener('input', handleInputChange);
    input.addEventListener('focus', handleInputFocus);
  });

  function handleInputFocus(event) {
    const input = event.target;
    const step = parseInt(input.getAttribute('form-step-input'), 10);
    updateActiveArrow(step);
  }

  function handleInputChange(event) {
    const input = event.target;
    const step = parseInt(input.getAttribute('form-step-input'), 10);
    const value = input.value.trim();

    // Сбрасываем существующий таймер добавления ошибки
    if (input.errorTimeout) {
      clearTimeout(input.errorTimeout);
      input.errorTimeout = null;
    }

    // Выполняем моментальную валидацию
    const isValid = isValidInput(step, value);

    // Обновляем filledSteps и UI моментально
    performValidation(input, step, value);

    if (isValid) {
      // Если ввод валиден, удаляем класс ошибки моментально
      input.classList.remove('input-error');
    } else {
      // Если ввод невалиден
      if (step === 1) {
        // Для шага 1 (Figma) добавляем класс ошибки моментально
        input.classList.add('input-error');
      } else {
        // Для шагов 2 и 3 добавляем класс ошибки с задержкой после 3 секунд неактивности
        input.errorTimeout = setTimeout(() => {
          // Проверяем, не стал ли ввод валидным за время ожидания
          const currentValue = input.value.trim();
          const currentIsValid = isValidInput(step, currentValue);

          if (!currentIsValid) {
            input.classList.add('input-error');
          }
          input.errorTimeout = null;
        }, 3000);
      }
    }
  }

  function isValidFigmaLink(value) {
    try {
      const url = new URL(value);
      return url.hostname.toLowerCase().includes('figma.com');
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
      // Поле может быть пустым, но шаг считается выполненным только при корректной ссылке
      return value === '' || isValidFigmaLink(value);
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
    // Удаляем шаг из filledSteps по умолчанию
    filledSteps.delete(step);

    const isValid = isValidInput(step, value);

    if (step === 1) {
      // Добавляем шаг в filledSteps только если ссылка не пустая и валидная
      if (value !== '' && isValidFigmaLink(value)) {
        filledSteps.add(step);
      }
    } else {
      if (isValid) {
        filledSteps.add(step);
      }
    }

    // Обновляем плейсхолдеры
    if (isValid) {
      if (step === 1) {
        input.placeholder = 'link to figma project';
      }
      if (step === 2) {
        input.placeholder = 'email';
      }
      if (step === 3) {
        input.placeholder = 'detail about the project (scope, deadlines)';
      }
    } else {
      if (step === 1) {
        input.placeholder = 'Please enter a valid Figma link';
      }
      if (step === 2) {
        input.placeholder = 'Please enter a valid email address';
      }
      if (step === 3) {
        input.placeholder = 'Please enter at least 5 characters';
      }

      // При невалидном вводе сбрасываем UI начиная с текущего шага
      resetUIFromStep(step);
    }

    // Обновляем интерфейс и состояние кнопки отправки
    updateUI();
    updateSubmitButtonState();
  }

  function resetUIFromStep(stepNum) {
    for (let i = stepNum; i <= 3; i++) {
      const ill = document.querySelector(`[form-step-ill="${i}"]`);
      ill && ill.classList.remove('is-active');

      const progressItem = document.querySelector(`[form-step-progress-item="${i}"]`);
      if (progressItem) {
        const lineFiller = progressItem.querySelector('.steps-grid_item-line-filler');
        const stepName = progressItem.querySelector('.rg-12.is-step-name');
        lineFiller && lineFiller.classList.remove('is-active');
        stepName && stepName.classList.remove('is-active');
      }

      const icon = document.querySelector(`.figma-zone-steps-icons_item[form-step-ill="${i}"]`);
      icon && icon.classList.remove('is-active');
    }
  }

  function updateActiveArrow(stepNum) {
    const illArrows = document.querySelectorAll('[form-step-ill-arrow]');
    illArrows.forEach((arrow) => {
      const arrowStep = parseInt(arrow.getAttribute('form-step-ill-arrow'), 10);
      if (arrowStep === stepNum) {
        arrow.classList.add('is-active');
      } else {
        arrow.classList.remove('is-active');
      }
    });
  }

  function updateUI() {
    for (let i = 1; i <= 3; i++) {
      const ill = document.querySelector(`[form-step-ill="${i}"]`);
      if (filledSteps.has(i)) {
        ill && ill.classList.add('is-active');
      } else {
        ill && ill.classList.remove('is-active');
      }
    }

    for (let i = 1; i <= 3; i++) {
      const progressItem = document.querySelector(`[form-step-progress-item="${i}"]`);
      if (progressItem) {
        const lineFiller = progressItem.querySelector('.steps-grid_item-line-filler');
        const stepName = progressItem.querySelector('.rg-12.is-step-name');

        if (filledSteps.has(i)) {
          lineFiller && lineFiller.classList.add('is-active');
          stepName && stepName.classList.add('is-active');
        } else {
          lineFiller && lineFiller.classList.remove('is-active');
          stepName && stepName.classList.remove('is-active');
        }
      }
    }

    for (let i = 1; i <= 3; i++) {
      const icon = document.querySelector(`.figma-zone-steps-icons_item[form-step-ill="${i}"]`);
      if (filledSteps.has(i)) {
        icon && icon.classList.add('is-active');
      } else {
        icon && icon.classList.remove('is-active');
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
    return (
      isValidInput(1, figmaInput.value.trim()) &&
      isValidInput(2, emailInput.value.trim()) &&
      isValidInput(3, messageInput.value.trim())
    );
  }

  // Обработчик отправки формы
  form.addEventListener('submit', function (event) {
    if (!isFormValid()) {
      event.preventDefault();
      event.stopPropagation();

      // Если поле с Figma-ссылкой невалидно, добавляем эффект мигания
      if (!isValidInput(1, figmaInput.value.trim())) {
        figmaInput.classList.add('input-blink');

        // Удаляем класс мигания после завершения анимации
        setTimeout(() => {
          figmaInput.classList.remove('input-blink');
        }, 1500); // Длительность эффекта мигания
      }

      // Вы можете добавить эффект мигания и для других полей при необходимости

      return false;
    }
  });

  // Инициализируем состояние кнопки отправки
  updateSubmitButtonState();
};

func_heroForm();
