import './App.css';
import { serverURL } from './config.js';
import CloudLogo from './components/CloudLogo.jsx';

import Wordcloud from './components/Wordcloud.jsx';
import RangeSlider from './components/RangeSlider.jsx';

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
      minWords: 2,
      maxWords: 5,
      minScore: 5,
      maxScore: 300,
      filter: '',
      commonWordFilter: true,
      loading: false
      // TODO: Add 'likeCount' filter?
    };
    this.getComments = this.getComments.bind(this);
    this.getSearches = this.getSearches.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  getComments() {
    if (!this.state.loading) this.setState({loading: true});
    if (this.state.getSearch === '') {
      return;
    }
    axios.get(`${serverURL}/comments`, {
      params: {
        search: this.state.getSearch,
        likeCount: 3 // Helps filter spam comments
       }
    })
      .then((result) => {
        // TODO: Add weights based on comment rating
        // console.log(result.data.comments.length); // DEBUG: Should contain comment length
        this.setState({
          comments: result.data.comments,
          loading: false
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({loading: false});
      });
  }

  getSearches() {
    axios.get(`${serverURL}/searches`)
      .then((result) => {
        // console.log(result.data.searches); // DEBUG: Should contain searches
        this.setState({
          searches: result.data.searches,
          getSearch: this.state.addSearch.length > 0 ? this.state.addSearch : result.data.searches[0]
        }, this.getComments);
      })
      .catch((error) => console.log(error));
  }

  submitSearch() {
    // console.log('submitSearch', this.state.addSearch);
    if (!this.state.loading) this.setState({loading: true});

    axios.post(`${serverURL}/comments`, { search: this.state.addSearch })
      .then((success) => {
        this.getSearches();
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log(error)
      });
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
        <div className='app-left'>
          <header className="App-header">
            <h1>Comment</h1>
              <CloudLogo
                loading={this.state.loading}
              />
            <h1>Cloud</h1>
          </header>
          <div className='main-section-left'>
            <div className='search-inputs'>
              <h3>Search</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                this.submitSearch();
              }}>
                <label>
                  <input
                    type='text'
                    name='add-search'
                    value={this.state.addSearch}
                    onChange={(e) => this.setState({addSearch: e.target.value})}
                  />
                  <button
                    type='submit'
                    name='Add'
                  >Add New</button>
                </label>
              </form>
              <form onSubmit={(e) => {
                e.preventDefault();
                this.getComments();
              }}>
                <label>
                  <input
                    type='text'
                    name='get-search'
                    value={this.state.getSearch}
                    onChange={(e) => this.setState({getSearch: e.target.value})}
                  />
                  <button
                    type='submit'
                    name='Search'
                  >Search</button>
                </label>
                </form>
              <label>
                Past Searches
                <select
                onChange={(e) => {
                  this.setState({getSearch: e.target.value}, this.getComments);
                }}>
                  {this.state.searches.map((search) => {
                    return <option value={search} key={search}>{search}</option>
                  })}
                </select>
              </label>
            </div>
            <div className='word-filters'>
              <h3>Filters</h3>
              <RangeSlider
                onSubmit={(minWords, maxWords) => {
                  this.setState({
                    minWords,
                    maxWords
                  });
                }}
                minWords={this.state.minWords}
                maxWords={this.state.maxWords}
              />
              <label>
                Includes
                <input
                  type='text'
                  name='filter'
                  value={this.state.filter}
                  onChange={(e) => {this.setState({filter: e.target.value})}}
                />
              </label>
              <label>
                <small>Filter Common Words</small>
                <input
                  className='checkbox'
                  type='checkbox'
                  name='filter-common-words'
                  checked={this.state.commonWordFilter}
                  onChange={(e) => {this.setState({commonWordFilter: e.target.checked})}}
                />
              </label>
            </div>
          </div>
        </div>
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
