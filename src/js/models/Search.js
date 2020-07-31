import axios from 'axios';
import { proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
    this.result = [];
  }

  async getRecipes() {
    try {
      const res = await axios.get(
        `${proxy}https://recipesapi.herokuapp.com/api/search?q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error fetching list of recipes ', err);
    }
  }
}
