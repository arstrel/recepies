import axios from 'axios';
import { proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
    this.img = '';
    this.author = '';
    this.url = '';
    this.ingredients = '';
    this.title = '';
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
}
