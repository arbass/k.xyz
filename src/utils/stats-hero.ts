export const func_statsHero = () => {
  // Проверяем, есть ли на странице элементы с любым атрибутом
  const all_func_statsHero = document.querySelectorAll('.card.is-hero-orange-section');
  if (all_func_statsHero.length) {
    // Запрашиваем данные с вашего VPS
    fetch('https://dev.kopytok.xyz/site-stats')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        return response.json();
      })
      .then((data) => {
        const totalStats = data['total-stats'];
        // console.log('Данные total-stats:', totalStats);
        // Проходим по ключам в объекте totalStats
        for (const key in totalStats) {
          if (totalStats.hasOwnProperty(key)) {
            // Ищем элемент с id, равным текущему ключу
            const element = document.getElementById(key);
            if (element) {
              // Устанавливаем textContent элемента на значение из totalStats
              element.textContent = totalStats[key];
            }
          }
        }
      })
      .catch((error) => {
        console.error('Ошибка:', error);
      });
  }
};
