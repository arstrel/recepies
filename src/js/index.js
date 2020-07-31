// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderSpinner, removeSpinner } from './views/base';
import * as searchView from './views/searchView';

/*
 * App global state
 * - Search object
 * - Shopping list
 * - Liked recipes
 */
const state = {};

// Search Controller
const controlSearch = async (e) => {
  e.preventDefault();
  // 1) Get query from the view
  const query = searchView.getInput();
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearSearchResults();
    renderSpinner(elements.searchResult);

    try {
      // 4) Search for recipes
      await state.search.getRecipes();

      // 5) Render results on UI
      removeSpinner();
      searchView.renderResults(state.search.result);
    } catch (err) {
      removeSpinner();
      // eslint-disable-next-line no-console
      console.log('Error in Search Control ', err);
    }
  }
};

elements.searchForm.addEventListener('submit', controlSearch);
elements.searchPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const page = Number(btn.dataset.goto);
    searchView.clearSearchResults();
    searchView.renderResults(state.search.result, page);
  }
});

// Recipe controller
const controlRecipe = async () => {
  const { hash = '' } = window.location;
  const id = hash.substring(1);
  if (id) {
    // Prepare UI for changes

    // Create new recipe
    state.recipe = new Recipe(id);

    try {
      // Get recipe data
      await state.recipe.getRecipe();

      // Calc time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render the recipe
      console.log(state.recipe);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error in Recipe Control ', err);
    }
  }
};

['hashchange', 'load'].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});
