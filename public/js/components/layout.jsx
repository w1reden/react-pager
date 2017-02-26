import React, { Component } from 'react';
import Search from './search.jsx';

class Layout extends Component {
  render() {
    return (
      <div>

        <header className="app-header">
          <div className="app-container">
            <div className="app-header__title">
             <span className="main-color">ReactJS</span>&nbsp;pager
            </div>
            <Search />
          </div>
        </header>

        <section className="app-content">
          <div className="app-container">

            {this.props.children}

          </div>
        </section>

      </div>
    );
  }
}

export default Layout;