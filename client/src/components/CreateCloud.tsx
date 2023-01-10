import React from 'react';

type CreateCloudProps = {
  loading: boolean,
  search: string,
  onSubmit: Function,
  setSearch: Function
}

export default function CreateCloud(props: CreateCloudProps) {

  return (
  <div className='create-cloud'>
    <h3>Create</h3>
    <form onSubmit={(e) => {
      e.preventDefault();
      props.onSubmit();
    }}>
      <label>
        <input
          type='text'
          name='add-search'
          value={props.search}
          placeholder='Start searching'
          onChange={(e) => props.setSearch(e.target.value.toLowerCase())}
        />
      </label>
      <button
        type='submit'
        name='submit-search'
        style={props.search.length < 3 || props.search.length > 32 || props.loading ? {cursor: 'default'} : {
          animationName: 'button-enabled',
          animationDuration: '0.5s',
          animationIterationCount: '1',
          animationTimingFunction: 'ease-in-out',
          animationFillMode: 'forwards'
        }}
        disabled={props.search.length < 3 || props.search.length > 32 || props.loading}
      >
      {
        props.loading ? 'Loading' :
        props.search.length > 35 ? 'Type less' :
        'Submit'
      }
      </button>
    </form>
  </div>
  );

};
