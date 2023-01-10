import React, { useState } from 'react';
import { Slider } from '@mui/material';

type RangeSliderProps = {
  onSubmit: Function,
  minWords: number,
  maxWords: number
}

export default function RangeSlider(props: RangeSliderProps) {

  const [range, setRange] = useState([props.minWords, props.maxWords]);

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
          let leftValue: number = (e.target as any).value[0];
          let rightValue: number = (e.target as any).value[1];
          setRange([leftValue, rightValue]);
        }}
        onChangeCommitted={() => props.onSubmit(range[0], range[1])}
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
