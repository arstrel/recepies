// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import List from './models/List';
import { elements, renderSpinner, removeSpinner } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

//  TESTING
state.likes = new Likes();
likesView.toggleLikesMenu(state.likes.getNumberLikes());
// REMOVE THIS ^^

// LIKE CONTROLLER
const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentId = state.recipe.id;

  if (!state.likes.isLiked(currentId)) {
    //  current recipe is not yet liked
    // Add like to the state
    const newLike = state.likes.addLike(state.recipe);

    // Toggle the like button
    likesView.toggleLikeButtonTo(true);
    // Add like to UI list
    likesView.renderLike(newLike);
  } else {
    // user has liked current recipe
    // Remove like from the state
    state.likes.deleteLike(currentId);
    // Toggle the like button
    likesView.toggleLikeButtonTo(false);
    // Remove like to UI list
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikesMenu(state.likes.getNumberLikes());
};

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
    // Add ingredients to shopping list button
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
  recipeView.updateServingsIngredients(state.recipe);
});
