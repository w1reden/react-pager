import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import $ from 'jquery'

class NewsStore extends EventEmitter {
  constructor() {
    super();
    this.currentPage = 1;
    this.perPage = 15;
    this.newsCount = 0;
    this.news = [];
  }

  loadNewsCount() {
    $.get('/news/count')
      .done(data => {
        this.newsCount = data.count;
        this.emit('change');
      })
      .fail(err => {
        if (err) throw err;
      })
  }

  loadNewsForPage(page) {
    return $.get(`/news/${page}/${this.perPage}`);
  }

  getPagesCount() {
    return Math.ceil(this.newsCount / this.perPage);
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getNews() {
    return this.news;
  }

  changePage(page) {
    this.currentPage = page;
    this.loadNewsForPage(page)
      .done(data => {
        this.news = data.news;
        this.emit('change');
      })
      .fail(err => {
        if (err) throw err;
      });
  }
  
  handleActions(action) {
    switch (action.type) {
      case 'PAGE_CHANGE': this.changePage(action.page); break;
    }
  }

}

const newsStore = new NewsStore();

dispatcher.register(newsStore.handleActions.bind(newsStore));

export default newsStore;