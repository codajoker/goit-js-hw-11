import axios from 'axios';
export default class NewsApiServerce {
  constructor() {
    this.serch = '';
    this.page = 1;
    this.key = '24245591-38d8af0f79f16661bb7c2f839';
  }

  async fetchApi() {
    const url = `https://pixabay.com/api/?key=${this.key}&q=${this.serch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    try {
      const { data } = await axios.get(url);
      this.incrementPage();

      return data.hits;
    } catch (error) {
      return error;
    }
  }

  async totalHits() {
    const url = `https://pixabay.com/api/?key=${this.key}&q=${this.serch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    try {
      const { data } = await axios.get(url);

      return data.totalHits;
    } catch (error) {
      return error;
    }
  }

  incrementPage() {
    this.page += 1;
  }
  decrementPage() {
    this.page -= 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.serch;
  }
  set query(newSerch) {
    this.serch = newSerch;
  }
}
