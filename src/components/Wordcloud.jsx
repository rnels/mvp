import ReactWordcloud from 'react-wordcloud';

import { memo } from 'react';

export default memo(function Wordcloud({comments, filter, minWords, maxWords, minScore, maxScore, commonWordFilter}) {

  if (!comments.length) {
    return (
      <div className='wordcloud'>
        <h3>Search something</h3>
      </div>
    )
  }

  let temp = {};
  // Forgive me
  let regex = [
    'the',
    'of',
    'it',
    'ive',
    'then',
    'than',
    'only',
    'most',
    'a',
    'an',
    'i',
    'im',
    'as',
    'we',
    'she',
    'he',
    'her',
    'hers',
    'his',
    'him',
    'there',
    'they',
    'their',
    'theirs',
    'them',
    'our',
    'your',
    'and',
    'in',
    'so',
    'be',
    'to',
    'too',
    'is',
    'its',
    'are',
    'was',
    'at',
    'that',
    'thats',
    'this',
    'for',
    'by',
    'any',
    'just',
    'or',
    'has',
    'had',
    'but',
    'like',
    'do',
    'does',
    'on',
    'you',
    'if',
    'also',
    'can',
    'have',
    'get',
    'with',
    'from',
    'some',
    'all',
    'way',
    'think',
    'were',
    'go',
    'who',
    'lets',
    'would',
    'every',
    'put',
    'into',
    'these'
  ]
  for (let i = 0; i < comments.length; i++) {
    let split = comments[i].toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`"'’~()]/g, "")
    .replace(/[\W_]+/g," ");
    if (commonWordFilter) {
      for (let r of regex) {
        split = split.replace(new RegExp("\\b" + r + "\\b", 'g'), "");
        split = split.replace(new RegExp("\\b" + r + "\\s", 'g'), "");
        split = split.replace(new RegExp("\\s" + r + "\\b", 'g'), "");
      }
    }
    split = split.split(' ');
    for (let i = 0; i < split.length; i++) {
      split[i] = split[i].trim();
      if (!split[i].length) {
        split.splice(i, 1);
        i--;
      }
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

  for (let key in temp) {
    if (temp[key] >= minScore && temp[key] < maxScore && key.includes(filter)) {
      words.push({
        text: key,
        value: temp[key]
      })
    }
  }

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