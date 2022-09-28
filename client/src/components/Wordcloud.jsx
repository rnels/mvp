import ReactWordcloud from 'react-wordcloud';
import { memo } from 'react';

import { removeStopwords } from 'stopword';

export default memo(function Wordcloud({comments, filter, minWords, maxWords, minScore, maxScore, commonWordFilter, setScoreRange}) {

  if (!comments.length) {
    return (
      <div className='wordcloud'>
        <h3>Search something</h3>
      </div>
    )
  }

  let temp = {};

  for (let i = 0; i < comments.length; i++) {
    let split = comments[i].toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`"'’~()]/g, "")
    .replace(/[\W_]+/g," ");
    split = split.split(' ');
    if (commonWordFilter) {
      split = removeStopwords(split);
    }
    for (let z = minWords; z <= maxWords && z <= split.length; z++) {
      for (let j = 0; j + z <= split.length; j++) {
        let phrase = split.slice(j, j + z).join(' ');
        if (phrase.length > 2) { // Exclude phrases under 3 characters
          if (!temp[phrase]) {
            temp[phrase] = 1;
          }
          temp[phrase] += 1;
        }
      }
    }
  }

  let words = [];
  let bottomScore = null;
  let topScore = null;

  for (let key in temp) {
    if (bottomScore === null) {
      bottomScore = temp[key];
    } else if (bottomScore > temp[key]) {
      bottomScore = temp[key];
    }
    if (topScore === null) {
      topScore = temp[key];
    } else if (topScore < temp[key]) {
      topScore = temp[key];
    }
    if (temp[key] >= minScore && temp[key] <= maxScore && key.includes(filter)) {
      words.push({
        text: key,
        value: temp[key]
      })
    }
  }

  if (bottomScore !== null && topScore !== null) { setScoreRange(bottomScore, topScore); }

  const options = {
    colors: ["#ff3333", "#ff9966", "#dfcc97", "#df4497", "#66cce6", "#90ee90"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "Arial",
    fontSizes: [10, 40],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 4,
    rotationAngles: [-40, 40],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };
  const size = [
    window.innerWidth > 750 ? window.innerWidth * 0.50 : window.innerWidth * 0.95,
    window.innerHeight * 0.60
  ];

  return (
    <div className='wordcloud'>
      <ReactWordcloud
        words={words}
        options={options}
        size={size}
      />
    </div>
  );

});