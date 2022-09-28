import { Slider } from '@mui/material';
import { useState } from 'react';

export default function RangeSliderScores({onSubmit, minScore, maxScore, bottomScore, topScore}) {

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
          setRange([e.target.value[0], e.target.value[1]]);
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
