import './App.css';
import { serverURL } from './config.js';
import Wordcloud from './components/Wordcloud.jsx';

import React from 'react';
import axios from 'axios';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      searches: [],
      getSearch: '',
      addSearch: '',
      minWords: 3,
      maxWords: 5,
      minScore: 10,
      maxScore: 1000,
      filter: '',
      commonWordFilter: true
    };
    this.getComments = this.getComments.bind(this);
    this.getSearches = this.getSearches.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  getComments() {
    axios.get(`${serverURL}/comments`, {
      params: { search: this.state.getSearch }
    })
      .then((result) => {
        console.log(result.data.comments.length); // DEBUG: Should contain comment text
        this.setState({comments: result.data.comments});
      })
      .catch((error) => console.log(error));
  }

  getSearches() {
    axios.get(`${serverURL}/searches`)
      .then((result) => {
        console.log(result.data.searches); // DEBUG: Should contain searches
        this.setState({searches: result.data.searches});
      })
      .catch((error) => console.log(error));
  }

  submitSearch() {
    console.log('submitSearch', this.state.addSearch);
    axios.post(`${serverURL}/comments`, { search: this.state.addSearch })
      .then((success) => {
        console.log(success);
        this.getSearches();
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    // this.setState({addSearch: 'how to use the youtube API'}, () => this.submitSearch()) // DEBUG
    // this.setState({getSearch: 'how to use the youtube API'}, () => this.getComments()) // DEBUG
    this.getSearches();
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
        <form onSubmit={(e) => {
          e.preventDefault();
        }}>
          <label>
            Min Words
            <input
              type='Number'
              name='set-min-words'
              value={this.state.minWords}
              min={1}
              max={this.state.maxWords}
              onChange={(e) => this.setState({minWords: parseInt(e.target.value)})}
            />
          </label>
          <label>
            Max Words
            <input
              type='Number'
              name='set-max-words'
              value={this.state.maxWords}
              min={this.state.minWords}
              onChange={(e) => this.setState({maxWords: parseInt(e.target.value)})}
            />
          </label>
          <label>
            Saved searches
            <select
            onChange={(e) => {
              e.preventDefault();
              this.setState({getSearch: e.target.value}, () => this.getComments());
            }}>
              {this.state.searches.map((search) => {
                return <option value={search}>{search}</option>
              })}
            </select>
          </label>
        </form>
        <form>
          <label>
            Filter
            <input
              type='text'
              name='filter'
              value={this.state.filter}
              onChange={(e) => {this.setState({filter: e.target.value})}}
            />
          </label>
        </form>
        <label>
            Filter Common Words
            <input
              type='checkbox'
              name='filter-common-words'
              checked={this.state.commonWordFilter}
              onChange={(e) => {this.setState({commonWordFilter: e.target.checked})}}
            />
        </label>
        <Wordcloud
          key={'cloud'}
          comments={this.state.comments}
          minWords={this.state.minWords}
          maxWords={this.state.maxWords}
          minScore={this.state.minScore}
          maxScore={this.state.maxScore}
          filter={this.state.filter}
          commonWordFilter={this.state.commonWordFilter}
        />
      </div>
    );
  }

}

export default App;
