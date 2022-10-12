import React, { useState } from 'react';
import { Slider } from '@mui/material';

interface RangeSliderScoresProps {
  onSubmit: Function,
  minScore: number,
  maxScore: number,
  bottomScore: number,
  topScore: number
}

export default function RangeSliderScores(props: RangeSliderScoresProps) {

  const [range, setRange] = useState([props.minScore, props.maxScore]);

  return (
    <div className='range-score-view'>
      <label>Word Score</label>
      <Slider
        key='word-score-slider'
        sx={{width: '10em'}}
        value={range}
        valueLabelDisplay="auto"
        min={props.bottomScore}
        max={props.topScore}
        onChange={(e) => {
          let leftValue: number = (e.target as any).value[0];
          let rightValue: number = (e.target as any).value[1];
          setRange([leftValue, rightValue]);
        }}
        onChangeCommitted={() => {
          props.onSubmit(range[0], range[1]);
        }}
        marks={[
          {
            value: props.bottomScore,
            label: props.bottomScore !== 0 ? props.bottomScore : ''
          },
          {
            value: props.topScore,
            label: props.topScore !== 0 ? props.topScore : ''
          }
        ]}
      />
    </div>
  );

};
