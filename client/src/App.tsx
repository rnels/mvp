import './App.css';
import { serverURL } from './config';
import CloudLogo from './components/CloudLogo';
import WordCloud from './components/WordCloud';
import RangeSlider from './components/RangeSlider';
import RangeSliderScores from './components/RangeSliderScores';

import React from 'react';
// import Select from 'react-select';
import axios, { AxiosError, AxiosResponse } from 'axios';

type AppProps = {};

type AppState = {
  comments: string[],
  searches: string[],
  activeSearch: string,
  addSearch: string,
  minWords: number,
  maxWords: number,
  minScore: number,
  maxScore: number,
  bottomScore: number,
  topScore: number,
  filter: string,
  stopWordFilter: boolean,
  loading: boolean
};

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      comments: [],
      searches: [],
      activeSearch: '',
      addSearch: '',
      minWords: 2,
      maxWords: 5,
      minScore: 2,
      maxScore: 100,
      bottomScore: 0,
      topScore: 0,
      filter: '',
      stopWordFilter: true,
      loading: false
    };
    this.getComments = this.getComments.bind(this);
    this.getSearches = this.getSearches.bind(this);
    this.addSearchSubmit = this.addSearchSubmit.bind(this);
    this.setScoreRange = this.setScoreRange.bind(this);
  }

  getComments(search: string) {
    if (!this.state.loading) this.setState({loading: true});
    axios.get(`${serverURL}/comments`, {
      params: {
        search,
        likeCount: 1 // Helps filter spam comments
       }
    })
      .then((result: AxiosResponse) => {
        // TODO: Add weights based on comment rating
        let comments: string[] = result.data.comments;
        this.setState({
          comments,
          addSearch: '',
          loading: false
        }, () => this.getSearches(search));
      })
      .catch((error) => {
        if (error instanceof AxiosError) console.log(error.message);
        else console.log(error);
        this.setState({ loading: false });
      });
  }

  getSearches(activeSearch='') {
    axios.get(`${serverURL}/searches`)
      .then((result: AxiosResponse) => {
        let searches: string[] = result.data.searches;
        this.setState({
          searches,
          activeSearch
        });
      })
      .catch((error) => {
        if (error instanceof AxiosError) console.log(error.message);
        else console.log(error);
      });
  }

  addSearchSubmit() {
    if (!this.state.loading) this.setState({loading: true});
    axios.post(`${serverURL}/comments`, { search: this.state.addSearch })
      .then(() => this.getComments(this.state.addSearch))
      .catch((error) => {
        if (error instanceof AxiosError) console.log(error.message);
        else console.log(error);
        this.setState({ loading: false });
      });
  }

  setScoreRange(bottomScore: number, topScore: number) {
    this.setState({
      bottomScore,
      topScore
    });
  }

  componentDidMount() {
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
                      value={this.state.addSearch}
                      placeholder='Start searching'
                      onChange={(e) => this.setState({addSearch: e.target.value.toLowerCase()})}
                    />
                  </label>
                    <button
                      type='submit'
                      name='submit-search'
                      style={this.state.addSearch.length < 3 || this.state.addSearch.length > 35 || this.state.loading ? undefined : {
                        animationName: 'button-enabled',
                        animationDuration: '0.5s',
                        animationIterationCount: '1',
                        animationTimingFunction: 'ease-in-out',
                        animationFillMode: 'forwards'
                      }}
                      disabled={this.state.addSearch.length < 3 || this.state.addSearch.length > 35 || this.state.loading}
                    >{
                      this.state.loading ? 'Loading' :
                      this.state.addSearch.length > 35 ? 'Type less' :
                      'Submit'
                      }
                    </button>
                </form>
              </div>
              <div className='search-cloud'>
                <h3>Search</h3>
                <form>
                  <select
                  value={this.state.activeSearch}
                  onChange={(e) => {
                    this.setState({activeSearch: e.target.value}, () => this.getComments(this.state.activeSearch));
                  }}
                  >
                    {<option value='' key='default-option' disabled selected>See past searches</option>}
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
                      this.setState({activeSearch: option.value}, () => this.getComments(this.state.activeSearch));
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
                onSubmit={(minWords: number, maxWords: number) => {
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
                onSubmit={(minScore: number, maxScore: number) => {
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
                <label style={{marginTop: '6px'}}>
                  <input
                      className='checkmark'
                      type='checkbox'
                      name='filter-common-words'
                      checked={this.state.stopWordFilter}
                      onChange={(e) => {this.setState({stopWordFilter: e.target.checked})}}
                    />
                  <small>Filter stop words</small>
                </label>
              </form>
            </div>
          </div>
        </div>
        <WordCloud
          key={'cloud'}
          comments={this.state.comments}
          minWords={this.state.minWords}
          maxWords={this.state.maxWords}
          minScore={this.state.minScore}
          maxScore={this.state.maxScore}
          filter={this.state.filter}
          stopWordFilter={this.state.stopWordFilter}
          setScoreRange={this.setScoreRange}
        />
      </div>
    );
  }

}

export default App;
