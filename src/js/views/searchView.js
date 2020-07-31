import { elements } from './base';

export const getInput = () => elements.searchInput.value;

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};

const renderRecipe = (recipe = {}) => {
  /*
  image_url: "https://res.cloudinary.com/dk4ocuiwa/image/upload/v1575163942/RecipesApi/sweetpotatokalepizza2c6db.jpg"
  publisher: "Two Peas and Their Pod"
  publisher_url: "http://www.twopeasandtheirpod.com"
  recipe_id: "54454"
  social_rank: 99.9999999991673
  source_url: "http://www.twopeasandtheirpod.com/sweet-potato-kale-pizza-with-rosemary-red-onion/"
  title: "Sweet Potato Kale Pizza with Rosemary & Red Onion"
  _id: "5dd0f2b346d3bd53d2898f5f"
 */
  const { image_url, publisher, recipe_id, title } = recipe;
  const markup = `
    <li>
    <a class="results__link" href="#${recipe_id}">
      <figure class="results__fig">
        <img src="${image_url}" alt="${title}" />
      </figure>
      <div class="results__data">
        <h4 class="results__name">${limitRecipeTitle(title)}</h4>
        <p class="results__author">${publisher}</p>
      </div>
    </a>
  </li>
  `;
  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createPaginationButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${
  type === 'next' ? page + 1 : page - 1
}>
<span>Page ${type === 'next' ? page + 1 : page - 1}</span>
<svg class="search__icon">
<use href="img/icons.svg#icon-triangle-${
  type === 'next' ? 'right' : 'left'
}"></use>
</svg>
      </button>`;

const renderPaginationButtons = (page, numResults, resultsPerPage) => {
  const pages = Math.ceil(numResults / resultsPerPage);
  let button;

  if (page === 1 && pages > 1) {
    // Only button to go to the next page
    button = createPaginationButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = `
      ${createPaginationButton(page, 'prev')}
      ${createPaginationButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // Only button to go back
    button = createPaginationButton(page, 'prev');
  }
  if (button) {
    elements.searchPages.insertAdjacentHTML('afterbegin', button);
  }
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  if (recipes.length > resultsPerPage) {
    renderPaginationButtons(page, recipes.length, resultsPerPage);
  }
};

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearSearchResults = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchPages.innerHTML = '';
};
