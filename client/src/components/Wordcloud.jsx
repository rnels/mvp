import ReactWordcloud from 'react-wordcloud';
import { memo } from 'react';

import { removeStopwords } from 'stopword';

export default memo(function Wordcloud({comments, filter, minWords, maxWords, minScore, maxScore, commonWordFilter, setScoreRange}) {

  const words = [];
  const options = {
    colors: ["#ff3333", "#ff9966", "#dfcc97", "#df4497", "#66cce6", "#90ee90"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "Arial",
    fontSizes: [10, 40],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 10,
    rotationAngles: [-25, 25],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };
  const size = [
    window.innerWidth > 1100 ? window.innerWidth * 0.40 : window.innerWidth * 0.80,
    window.innerWidth > 1100 ? window.innerHeight * 0.60 : window.innerHeight * 0.50
  ];

  let bottomScore = null;
  let topScore = null;

  if (!comments.length) {
    let textChoices = ['Comment Cloud', 'Comment Cloud', 'Comment Cloud', 'comment cloud', '¡Comment Cloud!', 'comment cloud!', 'comment', 'cloud', 'commentCloud', 'comment_cloud', '¿Comment cloud?'];
    for (let i = 0; i < 50; i++) {
      let choice = Math.round(Math.random() * 12);
      let value = Math.round(Math.random() * 100);
      if (bottomScore === null) {
        bottomScore = value;
      } else if (bottomScore > value) {
        bottomScore = value;
      }
      if (topScore === null) {
        topScore = value;
      } else if (topScore < value) {
        topScore = value;
      }
      words.push({
        text: textChoices[choice],
        value
      })
    }

    if (bottomScore !== null && topScore !== null) { setScoreRange(bottomScore, topScore); }

    return (
      <div className='wordcloud'>
        <ReactWordcloud
          words={words}
          options={options}
          size={size}
        />
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
            temp[phrase] = 0;
          }
          temp[phrase] += 1;
        }
      }
    }
  }

  for (let key in temp) {
    if (key.includes(filter)) {
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
      if (temp[key] >= minScore && temp[key] <= maxScore) {
        words.push({
          text: key,
          value: temp[key]
        })
      }
    }
  }

  if (bottomScore !== null && topScore !== null) {
    setScoreRange(bottomScore, topScore);
   }

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