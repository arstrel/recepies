export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike({ id, title, author, img }) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // Persist the data in localStorage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    this.likes = this.likes.filter((like) => like.id !== id);
    // Update localStorage
    this.persistData();
  }

  isLiked(id) {
    return this.likes.some((el) => el.id === id);
  }

  getNumberLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  restoreFromStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if (storage) {
      this.likes = storage;
    }
  }
}
