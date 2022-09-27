import './App.css';
import { serverURL } from './config.js';

import React from 'react';
import axios from 'axios';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      getSearch: '',
      addSearch: ''
    };
  }

  getComments() {
    console.log('getComments', this.state.getSearch);
    axios.get(`${serverURL}/comments`, {
      params: { search: this.state.getSearch }
    })
      .then((result) => {
        console.log(result.data.comments); // DEBUG: Should contain a comments object
        this.setState({comments: result.data.comments});
      })
      .catch((error) => console.log(error));
  }

  submitSearch() {
    console.log('submitSearch', this.state.addSearch);
    axios.post(`${serverURL}/comments`, { search: this.state.addSearch })
      .then((success) => console.log(success))
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    // this.getComments(); // DEBUG
    // this.submitSearch(); // DEBUG
    // this.setState({search: 'how to use the youtube API'})  // DEBUG
  }

  // TODO: Consolidate adding and searching forms
  // Where you search and if it exists in the db it returns the results, if not it queries the API
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Comments</h1>
        </header>
        <form onSubmit={(e) => {
          e.preventDefault();
          this.getComments();
        }}>
          <label>
            Get
            <input
              type='text'
              name='get-search'
              value={this.state.getSearch}
              onChange={(e) => this.setState({getSearch: e.target.value})}
            />
          </label>
          <input
            type='submit'
            value='Search'
          />
        </form>
        <form onSubmit={(e) => {
          e.preventDefault();
          this.submitSearch();
        }}>
          <label>
            Add
            <input
              type='text'
              name='add-search'
              value={this.state.addSearch}
              onChange={(e) => this.setState({addSearch: e.target.value})}
            />
          </label>
          <input
            type='submit'
            value='Add'
          />
        </form>
        {this.state.comments.length > 0 &&
           this.state.comments.map((comment, i) => {
            return <span key={`${comment}-${i}`}>{comment}</span>
        })}
      </div>
    );
  }

}

export default App;
