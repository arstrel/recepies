// Global app controller
import Search from './models/Search';
import { elements, renderSpinner, removeSpinner } from './views/base';
import * as searchView from './views/searchView';

/*
 * App global state
 * - Search object
 * - Shopping list
 * - Liked recipes
 */
const state = {};

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

    // 4) Search for recipes
    await state.search.getRecipes();

    // 5) Render results on UI
    removeSpinner();
    searchView.renderResults(state.search.result);
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
