export const elements = {
  searchInput: document.querySelector('.search__field'),
  searchForm: document.querySelector('.search'),
  searchResult: document.querySelector('.results'),
  searchResultList: document.querySelector('.results__list'),
  searchPages: document.querySelector('.results__pages'),
};

export const elementStrings = {
  loader: 'loader',
};

export const renderSpinner = (parent) => {
  const spinner = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', spinner);
};
export const removeSpinner = () => {
  const spinner = document.querySelector(`.${elementStrings.loader}`);
  // same as spinner.remove();
  if (spinner) {
    spinner.parentElement.removeChild(spinner);
  }
};
