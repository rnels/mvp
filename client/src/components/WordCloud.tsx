import React, { memo } from 'react';
import ReactWordcloud, { MinMaxPair, OptionsProp, Word } from 'react-wordcloud';
import { removeStopwords } from 'stopword';

type WordCloudProps = {
  comments: string[],
  filter: string,
  minWords: number,
  maxWords: number,
  minScore: number,
  maxScore: number,
  stopWordFilter: boolean,
  setScoreRange: Function
}

export default memo(function WordCloud(props: WordCloudProps) {

  const words: Word[] = [];
  const options: OptionsProp = {
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
  const size: MinMaxPair = [
    window.innerWidth > 1100 ? window.innerWidth * 0.40 : window.innerWidth * 0.80,
    window.innerWidth > 1100 ? window.innerHeight * 0.60 : window.innerHeight * 0.50
  ];

  let bottomScore = 0;
  let topScore = 0;

  if (!props.comments.length) {
    let textChoices = ['Comment Cloud', 'Comment Cloud', 'Comment Cloud', 'comment cloud', '¡Comment Cloud!', 'comment cloud!', 'comment', 'cloud', 'commentCloud', 'comment_cloud', '¿Comment cloud?'];
    for (let i = 0; i < 50; i++) {
      let choice = Math.round(Math.random() * 12);
      let value = Math.round(Math.random() * 100);
      if (bottomScore === 0 || bottomScore > value) {
        bottomScore = value;
      }
      if (topScore === 0 || topScore < value) {
        topScore = value;
      }
      words.push({
        text: textChoices[choice],
        value
      });
    }

    props.setScoreRange(bottomScore, topScore);

    return (
      <div className='wordcloud'>
        <ReactWordcloud
          words={words}
          options={options}
          size={size} // TODO: Consider disabling this to enable responsive resizing
        />
      </div>
    )
  }

  let phrases: any = {};

  for (let i = 0; i < props.comments.length; i++) {
    let tempPhrases: any = {};
    let regex = props.comments[i].toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`"'’~()]/g, "")
    .replace(/[\W_]+/g," ");
    let split = regex.split(' ');
    if (props.stopWordFilter) { split = removeStopwords(split); }
    for (let z = props.minWords; z <= props.maxWords && z <= split.length; z++) {
      for (let j = 0; j + z <= split.length; j++) {
        let phrase = split.slice(j, j + z).join(' ');
        // Exclude phrases under 3 characters
        if (phrase.length > 2 && !tempPhrases[phrase]) {
          tempPhrases[phrase] = 1;
        }
      }
    }
    // This limits each comment to scoring +1 on a phrase, especially useful in the case of comments which are repeating words over and over
    for (let phrase in tempPhrases) {
      if (!phrases[phrase]) { phrases[phrase] = 0; }
      phrases[phrase] += 1;
    }
  }

  for (let key in phrases) {
    if (key.includes(props.filter)) {
      if (bottomScore === 0 || bottomScore > phrases[key]) {
        bottomScore = phrases[key];
      }
      if (topScore === 0 || topScore < phrases[key]) {
        topScore = phrases[key];
      }
      if (phrases[key] >= props.minScore && phrases[key] <= props.maxScore) {
        words.push({
          text: key,
          value: phrases[key]
        });
      }
    }
  }

  props.setScoreRange(bottomScore, topScore);

  return (
    <div className='wordcloud'>
      <ReactWordcloud
        words={words}
        options={options}
        size={size} // TODO: Consider disabling this to enable responsive resizing
      />
    </div>
  );

});
