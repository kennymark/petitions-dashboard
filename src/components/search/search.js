import React, { Component, Fragment } from 'react'
import { Input } from 'antd';
import { withGlobalState } from 'react-globally'
class Search extends Component {

  getSearchInpux = (value) => {
    console.log(value)
    this.props.setGlobalState({ url: value })
  }
  // handle
  render() {
    const Search = Input.Search;

    return (
      <Fragment>
        <Search
          placeholder="Paste petition url"
          enterButton="Enter"
          size="large"
          onSearch={this.getSearchInpux}
          onChange={this.handleSearch}
        />
      </Fragment>
    )
  }
}

export default withGlobalState(Search) 
