import { Fraction } from 'fractional';
import { elements } from './base';

const formatCount = (count) => {
  if (count) {
    const [int, dec] = count
      .toString()
      .split('.')
      .map((el) => Number(el));
    if (!dec) {
      return count;
    }
    if (int === 0) {
      // Ex. 0.5 --> 1/2
      const fr = new Fraction(count);
      return `${fr.numerator}/${fr.denominator}`;
    }
    // Ex. 2.5 --> 5/2 --> 2 1/2
    const fr = new Fraction(count - int);
    return `${int} ${fr.numerator}/${fr.denominator}`;
  }
  return '?';
};

const createIngredient = (item) => `
  <li class="recipe__item">
    <svg class="recipe__icon">
        <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formatCount(item.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${item.unit}</span>
        ${item.ingredient}
    </div>
  </li>
`;

// eslint-disable-next-line import/prefer-default-export
export const renderRecipe = (recipe = {}, isLiked) => {
  const { img, author, url, title, ingredients, time, servings } = recipe;

  const markup = `
  <figure class="recipe__fig">
  <img src="${img}" alt="${title}" class="recipe__img">
  <h1 class="recipe__title">
      <span>${title}</span>
  </h1>
</figure>

<div class="recipe__details">
  <div class="recipe__info">
      <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-stopwatch"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${time}</span>
      <span class="recipe__info-text"> minutes</span>
  </div>
  <div class="recipe__info">
      <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-man"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${servings}</span>
      <span class="recipe__info-text"> servings</span>

      <div class="recipe__info-buttons">
          <button id="btn-decrease" class="btn-tiny">
              <svg>
                  <use href="img/icons.svg#icon-circle-with-minus"></use>
              </svg>
          </button>
          <button id="btn-increase" class="btn-tiny">
              <svg>
                  <use href="img/icons.svg#icon-circle-with-plus"></use>
              </svg>
          </button>
      </div>

  </div>
  <button class="recipe__love">
      <svg class="header__likes">
          <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
      </svg>
  </button>
</div>



<div class="recipe__ingredients">
  <ul class="recipe__ingredient-list">
      ${ingredients.map(createIngredient).join('')}
  </ul>

  <button id="recipe__btn--add" class="btn-small recipe__btn">
      <svg class="search__icon">
          <use href="img/icons.svg#icon-shopping-cart"></use>
      </svg>
      <span>Add to shopping list</span>
  </button>
</div>

<div class="recipe__directions">
  <h2 class="heading-2">How to cook it</h2>
  <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__by">${author}</span>. Please check out directions at their website.
  </p>
  <a class="btn-small recipe__btn" href="${url}" target="_blank">
      <span>Directions</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-right"></use>
      </svg>

  </a>
</div>
  `;
  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
};

export const updateServingsIngredients = (recipe) => {
  // Update the counts
  // eslint-disable-next-line operator-linebreak
  document.querySelector('.recipe__info-data--people').textContent =
    recipe.servings;

  // Update ingredients
  const countElements = document.querySelectorAll('.recipe__count');
  countElements.forEach((el, i) => {
    // eslint-disable-next-line no-param-reassign
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
