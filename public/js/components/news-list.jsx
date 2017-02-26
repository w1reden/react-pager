import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NewsItem from './news-item.jsx';
import Pagination from './pagination.jsx';
import NewsStore from '../stores/news-store.js';
import $ from 'jquery';

import { hashHistory } from 'react-router';

class NewsList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: props.params.pageNumber,
      pagesCount: NewsStore.getPagesCount(),
      news: NewsStore.getNews(),
      pagesRange: NewsStore.getPagesRange()
    }
  }

  componentWillMount() {
    NewsStore.on('change', this.updateState.bind(this));

    NewsStore.loadNewsCount();
    NewsStore.changePage(this.state.currentPage);
  }

  componentWillUnmount() {
    NewsStore.removeListener('change', this.updateState.bind(this));
  }

  updateState() {
    const { pageNumber } = this.props.params;
    const pagesCount = NewsStore.getPagesCount();

    if (pageNumber > pagesCount) {
      return hashHistory.push(`/${pagesCount}`);
    }

    this.setState({
      currentPage: NewsStore.getCurrentPage(),
      pagesCount: pagesCount,
      news: NewsStore.getNews(),
    });
  
    $('body').animate({'scrollTop': 0}, 50);
  }

  render() {
    const { pagesCount, pagesRange, news } = this.state;
    const { pageNumber:currentPage = NewsStore.getCurrentPage() } = this.props.params;
    const totalNewsCount = NewsStore.getNewsCount();

    const newsList = news.map(newsItem => {
      return <NewsItem key={newsItem._id} item={newsItem} />
    });

    const transitionOptions = {
      transitionName: 'news',
      transitionEnterTimeout: 200,
      transitionLeaveTimeout: 200,
    }

    const titleContent = (news.length <= 0)
      ? 'No news for now. Try later'
      : `${news.length} of ${totalNewsCount} on the page`

    return (
      <div>
        <div className="news-list">
          <div className="news-list__title">{titleContent}</div>
          <ReactCSSTransitionGroup {...transitionOptions}>
            {newsList}
          </ReactCSSTransitionGroup>
        </div>
        <Pagination currentPage={currentPage} pagesCount={pagesCount} pagesRange={pagesRange}/>
      </div>
    );
  }
}

export default NewsList;