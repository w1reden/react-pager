import React, { Component } from 'react';
import Page from './page.jsx';
import PageMobile from './page-mobile.jsx';
import { range } from '../utils/range.js';
import { browserHistory } from 'react-router';

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWidth: document.documentElement.clientWidth,
      breakpoint: 550,
    }
  }

  reloadOnBreakpoint() {
    const { currentWidth, breakpoint } = this.state;
    const width = document.documentElement.clientWidth;

    if (currentWidth >= breakpoint && width <= breakpoint) {
      location.reload();
    }

    if (currentWidth <= breakpoint && width >= breakpoint) {
      location.reload();
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.reloadOnBreakpoint.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.reloadOnBreakpoint);
  }

  isMobileVersion() {
    return document.documentElement.clientWidth < this.state.breakpoint;
  }

  hasPrev(current) {
    return current > 1;
  }

  hasNext(current) {
    return current < this.props.pagesCount;
  }

  increasePage(current) {
    if (this.hasNext(current)) {
      browserHistory.push(`/app/${+current + 1}`);
    }
  }

  decreasePage(current) {
    if (this.hasPrev(current)) {
      browserHistory.push(`/app/${+current - 1}`);
    }
  }

  sendTo(page) {
    browserHistory.push(`/app/${page}`);
  }

  renderPages() {
    let output;
    const { currentPage, pagesCount } = this.props;

    if (this.isMobileVersion()) {
      if (pagesCount > 1) {
        output = <PageMobile currentPage={currentPage} total={pagesCount}/>
      } else null
    } else {
      output = range(this.getRangeStart(), this.getRangeEnd()).map(page => {
        return (
          <Page key={page}
            page={page}
            isActive={currentPage == page}
            onClick={() => browserHistory.push(`/app/${page}`)}
          />
        )
      });
    }

    return output;
  }

  getRangeStart() {
    const { pagesRange, currentPage, pagesCount } = this.props;
    let start = currentPage - pagesRange;

    return (start > 0) ? start : 1;
  }

  getRangeEnd() {
    const { pagesRange, currentPage, pagesCount } = this.props;
    let end = +currentPage + pagesRange;

    return (end < pagesCount) ? end : pagesCount
  }

  getFirstPageLink() {
    return (this.getRangeStart() !== 1 && !this.isMobileVersion())
      ? <li onClick={this.sendTo.bind(this, 1)}
          className="news-pagination__page news-pagination__first--ellipsis">1
        </li>
      : null
  }

  getLastPageLink() {
    const { pagesCount:count } = this.props

    return (this.getRangeEnd() < count && !this.isMobileVersion())
      ? <li onClick={this.sendTo.bind(this, count)}
          className="news-pagination__page news-pagination__last--ellipsis">{count}
        </li>
      : null
  }

  render() {
    const { currentPage, pagesCount } = this.props;

    const pages = this.renderPages();

    const prevButton = (currentPage > 1)
      ? <li className="news-pagination__arrow" onClick={() => this.decreasePage(currentPage)}>
          <i className="ion-chevron-left"></i>
        </li>
      : null

    const nextButton = (currentPage < pagesCount)
      ? <li className="news-pagination__arrow" onClick={() => this.increasePage(currentPage)}>
          <i className="ion-chevron-right"></i>
        </li>
      : null

    return (
      <div className="news-pagination">
        <ul className="news-pagination__list">
          {prevButton}
          {this.getFirstPageLink()}
          {pages}
          {this.getLastPageLink()}
          {nextButton}
        </ul>
      </div>
    );
  }
}

export default Pagination;