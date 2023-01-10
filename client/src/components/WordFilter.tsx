import React from 'react';

type WordFilterProps = {
  filter: string,
  stopWordFilter: boolean,
  setFilter: Function,
  setStopWordFilter: Function,
}

export default function WordFilter(props: WordFilterProps) {

  return (
    <form className='word-filter'>
      <input
        type='text'
        name='filter'
        placeholder='Filter by words'
        value={props.filter}
        onChange={(e) => props.setFilter(e.target.value.toLowerCase())}
      />
      <label style={{marginTop: '6px'}}>
        <input
            className='checkmark'
            type='checkbox'
            name='filter-common-words'
            checked={props.stopWordFilter}
            onChange={(e) => props.setStopWordFilter(e.target.checked)}
          />
        <small style={{cursor: 'pointer'}}>Filter stop words</small>
      </label>
    </form>
  );

};
