import './App.css';
import { serverURL } from './config';
import CloudLogo from './components/CloudLogo';
import WordCloud from './components/WordCloud';
import RangeSlider from './components/RangeSlider';
import RangeSliderScores from './components/RangeSliderScores';
import CreateCloud from './components/CreateCloud';
import SearchCloud from './components/SearchCloud';
import WordFilter from './components/WordFilter';

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
      loading: true
    };
    this.getComments = this.getComments.bind(this);
    this.getSearches = this.getSearches.bind(this);
    this.addSearchSubmit = this.addSearchSubmit.bind(this);
    this.setScoreRange = this.setScoreRange.bind(this);
  }

  getComments(search: string) {
    if (!this.state.loading) { this.setState({ loading: true }); }
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
        if (error instanceof AxiosError) { console.log(error.message); }
        else { console.log(error); }
        this.setState({ loading: false });
      });
  }

  getSearches(activeSearch='') {
    if (!this.state.loading) { this.setState({ loading: true }); }
    axios.get(`${serverURL}/searches`)
      .then((result: AxiosResponse) => {
        let searches: string[] = result.data.searches;
        this.setState({
          searches,
          activeSearch,
          loading: false
        });
      })
      .catch((error) => {
        if (error instanceof AxiosError) { console.log(error.message); }
        else { console.log(error); }
      });
  }

  addSearchSubmit() {
    if (!this.state.loading) { this.setState({ loading: true }); }
    axios.post(`${serverURL}/comments`, { search: this.state.addSearch })
      .then(() => this.getComments(this.state.addSearch))
      .catch((error) => {
        if (error instanceof AxiosError) { console.log(error.message); }
        else { console.log(error); }
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
              <CreateCloud
                loading={this.state.loading}
                search={this.state.addSearch}
                onSubmit={this.addSearchSubmit}
                setSearch={(addSearch: string) => this.setState({ addSearch })}
              />
              <SearchCloud
                loading={this.state.loading}
                activeSearch={this.state.activeSearch}
                searches={this.state.searches}
                setSearch={(activeSearch: string) => {
                    this.setState({ activeSearch });
                    this.getComments(activeSearch);
                  }
                }
              />
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
              <WordFilter
                filter={this.state.filter}
                stopWordFilter={this.state.stopWordFilter}
                setFilter={(filter: string) => this.setState({ filter })}
                setStopWordFilter={(stopWordFilter: boolean) => this.setState({ stopWordFilter })}
              />
            </div>
          </div>
        </div>
        <div className='app-right'>
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
      </div>
    );
  }

}

export default App;
