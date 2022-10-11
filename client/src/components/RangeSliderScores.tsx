import React, { useState } from 'react';
import { Slider } from '@mui/material';

interface IRangeSliderScores {
  onSubmit: Function,
  minScore: number,
  maxScore: number,
  bottomScore: number,
  topScore: number
}

export default function RangeSliderScores({onSubmit, minScore, maxScore, bottomScore, topScore}: IRangeSliderScores) {

  const [range, setRange] = useState([minScore, maxScore]);

  return (
    <div className='range-score-view'>
      <label>Word Score</label>
      <Slider
        key='word-score-slider'
        sx={{width: '10em'}}
        value={range}
        valueLabelDisplay="auto"
        min={bottomScore}
        max={topScore}
        onChange={(e) => {
          let leftValue: number = (e.target as any).value[0];
          let rightValue: number = (e.target as any).value[1];
          setRange([leftValue, rightValue]);
        }}
        onChangeCommitted={() => {
          onSubmit(range[0], range[1]);
        }}
        marks={[
          {
            value: bottomScore,
            label: bottomScore !== 0 ? bottomScore : ''
          },
          {
            value: topScore,
            label: topScore !== 0 ? topScore : ''
          }
        ]}
      />
    </div>
  );

};
