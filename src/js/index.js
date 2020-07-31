// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, renderSpinner, removeSpinner } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/*
 * App global state
 * - Search object
 * - Shopping list
 * - Liked recipes
 */
const state = {};
window.state = state;

// SEARCH CONTROLLER
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

// RECIPE CONTROLLER
const controlRecipe = async () => {
  const { hash = '' } = window.location;
  const id = hash.substring(1);
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderSpinner(elements.recipe);

    // Highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }

    // Create new recipe
    state.recipe = new Recipe(id);

    try {
      // Get recipe data
      await state.recipe.getRecipe();

      // Calc time and servings and parse ingredients
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();

      // Render the recipe
      removeSpinner();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error in Recipe Control ', err);
    }
  }
};

['hashchange', 'load'].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});

// LIST CONTROLLER
const controlList = () => {
  // Create new list if there is none yet
  if (!state.list) {
    state.list = new List();
  }
  // Add each ingredient to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el);
    listView.renderItem(item);
  });
};

// Handle delete and update list items events
elements.shoppingList.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('#shopping__count-value')) {
    const val = Number(e.target.value);

    state.list.updateCount(id, val);
  }
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('#btn-decrease, #btn-decrease *')) {
    // Decrease button clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
    }
  } else if (e.target.matches('#btn-increase, #btn-increase *')) {
    // Increase button clicked
    state.recipe.updateServings('inc');
  } else if (e.target.matches('#recipe__btn--add, #recipe__btn--add *')) {
    // Add to shopping list button
    controlList();
  }
  recipeView.updateServingsIngredients(state.recipe);
});
