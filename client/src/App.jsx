import './App.css';
import { serverURL } from './config.js';
import CloudLogo from './components/CloudLogo.jsx';

import Wordcloud from './components/Wordcloud.jsx';
import RangeSlider from './components/RangeSlider.jsx';
import RangeSliderScores from './components/RangeSliderScores.jsx';

import React from 'react';
// import Select from 'react-select';
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
      maxWords: 3,
      minScore: 1,
      maxScore: 5000,
      bottomScore: 0,
      topScore: 0,
      filter: '',
      commonWordFilter: true,
      loading: false
      // TODO: Add 'likeCount' filter?
    };
    this.getComments = this.getComments.bind(this);
    this.getSearches = this.getSearches.bind(this);
    this.addSearchSubmit = this.addSearchSubmit.bind(this);
    this.setScoreRange = this.setScoreRange.bind(this);
  }

  getComments(search) {
    if (!this.state.loading) this.setState({loading: true});
    axios.get(`${serverURL}/comments`, {
      params: {
        search,
        likeCount: 3 // Helps filter spam comments
       }
    })
      .then((result) => {
        // TODO: Add weights based on comment rating
        // console.log(result.data.comments.length); // DEBUG: Should contain comment length
        this.setState({
          comments: result.data.comments,
          loading: false
        }, this.getSearches);
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
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }

  addSearchSubmit() {
    if (!this.state.loading) this.setState({loading: true});
    axios.post(`${serverURL}/comments`, { search: this.state.addSearch })
      .then((success) => {
        this.getComments(this.state.addSearch);
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log(error)
      });
  }

  setScoreRange(bottomScore, topScore) {
    this.setState({
      bottomScore,
      topScore
    });
  }

  componentDidMount() {
    // this.setState({addSearch: 'how to use the youtube API'}, () => this.addSearchSubmit()) // DEBUG
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
            <div className='create-search-section'>
              <div className='create-cloud'>
                <h3>Create</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  this.addSearchSubmit();
                }}>
                  <label>
                    <input
                      type='text'
                      name='add-search'
                      value={this.state.addSearch.length > 0 ? this.state.addSearch : ''}
                      placeholder='Enter a search query'
                      onChange={(e) => this.setState({addSearch: e.target.value})}
                    />
                  </label>
                    <button
                      type='submit'
                      name='Send'
                      disabled={this.state.addSearch.length === 0}
                    >Send</button>
                </form>
              </div>
              <div className='search-cloud'>
                <h3>Search</h3>
                <form>
                  <select
                  onChange={(e) => {
                    this.setState({getSearch: e.target.value}, () => this.getComments(this.state.getSearch));
                  }}
                  >
                    {<option value=' ' key='defaut-option' disabled selected/>}
                    {this.state.searches.map((search) => {
                      return <option value={search} key={search}>{search}</option>
                    })}
                  </select>
                  {/* <Select
                    options={
                      this.state.searches.map((search) => {
                        return {
                          label: search,
                          value: search
                        }
                      })
                    }
                    onChange={(option) => {
                      this.setState({getSearch: option.value}, () => this.getComments(this.state.getSearch));
                    }}
                    className='custom-select'
                  /> */}
                </form>
              </div>
            </div>
            <div className='word-filters'>
              <h3>Filter</h3>
              <RangeSlider
                key='count-slider'
                onSubmit={(minWords, maxWords) => {
                  this.setState({
                    minWords,
                    maxWords
                  });
                }}
                minWords={this.state.minWords}
                maxWords={this.state.maxWords}
              />
              <RangeSliderScores
                key='score-slider'
                onSubmit={(minScore, maxScore) => {
                  this.setState({
                    minScore,
                    maxScore
                  });
                }}
                minScore={this.state.minScore}
                maxScore={this.state.maxScore}
                bottomScore={this.state.bottomScore}
                topScore={this.state.topScore}
              />
              <form>
                <input
                  type='text'
                  name='filter'
                  placeholder='Filter by words'
                  value={this.state.filter}
                  onChange={(e) => {this.setState({filter: e.target.value.toLowerCase()})}}
                />
                <label style={{'margin-top': '6px'}}>
                  <input
                      className='checkmark'
                      type='checkbox'
                      name='filter-common-words'
                      checked={this.state.commonWordFilter}
                      onChange={(e) => {this.setState({commonWordFilter: e.target.checked})}}
                    />
                  <small>Filter stop words</small>
                </label>
              </form>
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
          setScoreRange={this.setScoreRange}
        />
      </div>
    );
  }

}

export default App;
