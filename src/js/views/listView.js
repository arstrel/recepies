import { elements } from './base';

export const renderItem = (item) => {
  const { id, count, unit, ingredient } = item;
  const markup = `
  <li class="shopping__item" data-itemid=${id}>
    <div class="shopping__count">
        <input id="shopping__count-value" type="number" min="0" value="${count}" step="${count}">
        <p>${unit}</p>
    </div>
    <p class="shopping__description">${ingredient}</p>
    <button class="shopping__delete btn-tiny">
      <svg>
          <use href="img/icons.svg#icon-circle-with-cross"></use>
      </svg>
  </button>
</li>
  `;
  elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = (id) => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  if (item) {
    // Same as
    // item.parentElement.removeChild(item);
    item.remove();
  }
};
