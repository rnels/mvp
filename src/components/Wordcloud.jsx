import ReactWordcloud from 'react-wordcloud';

export default function Wordcloud({comments, filter='', minWords, maxWords, minScore, maxScore, commonWordFilter}) {

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
    'me',
    'she',
    'he',
    'her',
    'hers',
    'his',
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
    'this',
    'my',
    'for',
    'by',
    'how',
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
    'when',
    'where',
    'how',
    'why',
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
            temp[phrase] = 0;
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

  return <ReactWordcloud words={words}/>;
}
