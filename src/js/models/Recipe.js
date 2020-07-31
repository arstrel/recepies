import axios from 'axios';
import { proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
    this.img = '';
    this.author = '';
    this.url = '';
    this.ingredients = [];
    this.title = '';
    this.time = 0;
    this.servings = 0;
  }

  async getRecipe() {
    try {
      const res = await axios.get(
        `${proxy}https://recipesapi.herokuapp.com/api/get?rId=${this.id}`
      );
      /*
      image_url: "https://res.cloudinary.com/dk4ocuiwa/image/upload/v1575163942/RecipesApi/sweetpotatokalepizza2c6db.jpg"
      ingredients: (10) ["Your favorite pizza dough-we used this", "1 large sweet potato,
      publisher_url: "http://www.twopeasandtheirpod.com"
      recipe_id: "54454"
      social_rank: 99.9999999991673
      source_url: "http://www.twopeasandtheirpod.com/sweet-potato-kale-pizza-with-rosemary-red-onion/"
      title: "Sweet Potato Kale Pizza with Rosemary & Red Onion"
      __v: 0
      _id: "5dd0f2b346d3bd53d2898f5f"
      */
      const {
        image_url,
        ingredients,
        publisher_url,
        source_url,
        title,
      } = res.data.recipe;

      this.img = image_url;
      this.author = publisher_url;
      this.url = source_url;
      this.ingredients = ingredients;
      this.title = title;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error fetching the recipe ', err);
    }
  }

  calcTime() {
    // Let's estimate that we need 15 min to cook every three ingredients
    const numOfIngredients = this.ingredients.length;
    const periods = Math.ceil(numOfIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const units = [...unitsShort, 'g', 'kg'];

    const newIngredients = this.ingredients.map((el) => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2) remove parentheses and text in parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3) Parse ingrdients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((elem) => units.includes(elem));

      let objIngredient = {};
      if (unitIndex > -1) {
        // There is a unit in the ingredient
        // Ex. 4 1/2 cups, arrCount = [4, 1/2] --> "4 + 1/2" --> 4.5
        // Ex. 4 cups, arrCount = [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          // eslint-disable-next-line no-eval
          count = eval(arrIng[0].replace('+', '').replace('-', '+'));
        } else {
          // eslint-disable-next-line no-eval
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIngredient = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit, but the first element is a number
        objIngredient = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // There is no unit and no number in the first position
        objIngredient = {
          count: 1,
          unit: '',
          ingredient,
        };
      }

      return objIngredient;
    });
    this.ingredients = newIngredients;
  }
}
