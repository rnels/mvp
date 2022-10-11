import { Slider } from '@mui/material';
import { useState } from 'react';

export default function RangeSlider({onSubmit, minWords, maxWords}) {

  const [range, setRange] = useState([minWords, maxWords])

  return (
    <div className='range-view'>
      <label>Word Count</label>
      <Slider
        key='word-count-slider'
        sx={{width: '10em'}}
        value={range}
        valueLabelDisplay="auto"
        min={1}
        max={6}
        step={1}
        onChange={(e) => {
          setRange([e.target.value[0], e.target.value[1]]);
        }}
        onChangeCommitted={() => {
          onSubmit(range[0], range[1]);
        }}
        marks={[
          {
            value: 1,
            label: 1
          },
          {
            value: 6,
            label: 6
          }
        ]}
      />
    </div>
  );

};
