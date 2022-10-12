import React from 'react';

type SearchCloudProps = {
  loading: boolean,
  activeSearch: string,
  searches: string[],
  setSearch: Function
}

export default function SearchCloud(props: SearchCloudProps) {

  return (
  <div className='search-cloud'>
    <h3>Search</h3>
    <form>
      <label>
        <select
          value={props.activeSearch}
          onChange={(e) => props.setSearch(e.target.value)}
        >
          <option
            value=''
            key='default-option'
            disabled
            selected
          >
            See past searches
          </option>
          {
            props.searches.map((search) => {
              return <option value={search} key={search}>{search}</option>
            })
          }
        </select>
      </label>
      {/* <Select
        options={
          this.state.searches.map((search) => {
            return {
              label: search,
              value: search
            }
          })
        }
        onChange={(option) => {
          this.setState({activeSearch: option.value}, () => this.getComments(this.state.activeSearch));
        }}
        className='custom-select'
      /> */}
    </form>
  </div>
  );

};
