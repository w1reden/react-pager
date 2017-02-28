import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import $ from 'jquery'
import { hashHistory } from 'react-router';

class UserStore extends EventEmitter {
  constructor() {
    super();
  }

  register({ username = '', password = '' }) {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    $.post('/user/signup', { username, password })
      .done(user => {
        // show popup or something
        console.log('done');
      })
      .fail(err => {
        if (err) throw err;
      });
  }

  authorize({ username = '', password = '' }) {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    $.post('/user/signin', { username, password })
      .done(response => {
        localStorage.setItem('jwt-token', response.token);
        // show popup or something
        this.emit('change');
      })
      .fail(err => {
        if (err) throw err;
      })
  } 

  logout() {
    localStorage.removeItem('jwt-token');
    hashHistory.push('/login');
    // this.emit('change');
  }

  isAuthorized() {
    return localStorage.getItem('jwt-token') ? true : false
  }

  handleActions(action) {
    switch (action.type) {
      case 'REGISTER_USER': this.register(action.credentials); break;
      case 'AUTHORIZE_USER': this.authorize(action.credentials); break;
      case 'LOGOUT': this.logout(); break;
    }
  }

}

const userStore = new UserStore();

dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;