import './App.css';
import { serverURL } from './config.js';

import React from 'react';
import axios from 'axios';
import ReactWordcloud from 'react-wordcloud';

const words = [
  {
    text: 'told',
    value: 11,
  },
  {
    text: 'mistake',
    value: 11,
  },
  {
    text: 'thought',
    value: 11,
  },
  {
    text: 'bad',
    value: 11,
  },
]

function SimpleWordcloud() {
  return <ReactWordcloud words={words} />
}


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      words: [],
      getSearch: '',
      addSearch: ''
    };
  }

  createWordsObj(comments) {
    let temp = {};
    for (let word of comments.join(' ').toLowerCase().split(' ')) {
      if (!temp[word]) {
        temp[word] = 0;
      }
      temp[word] += 1;
    }

    let words = [];

    for (let word in temp) {
      words.push({
        text: word,
        value: temp[word]
      })
    }

    for (let word of words) {
      console.log(word.text, word.value);
    }
    this.setState({words});
  }

  getComments() {
    console.log('getComments', this.state.getSearch);
    axios.get(`${serverURL}/comments`, {
      params: { search: this.state.getSearch }
    })
      .then((result) => {
        console.log(result.data.comments); // DEBUG: Should contain a comments object
        this.createWordsObj(result.data.comments)
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
    // this.setState({addSearch: 'how to use the youtube API'}, this.submitSearch()) // DEBUG
    // this.setState({getSearch: 'how to use the youtube API'}, this.getComments()) // DEBUG
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
        {/* {this.state.comments.length > 0 &&
           this.state.comments.map((comment, i) => {
            return <span key={`${comment}-${i}`}>{comment}</span>
        })} */}
        <ReactWordcloud words={this.state.words} />
      </div>
    );
  }

}

export default App;
