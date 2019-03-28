import React, { Component, Fragment } from 'react'
import Search from './search/search';
import Dashboard from './dashboard/dashbord';
import { Typography as Text } from 'antd'


class Home extends Component {


  render() {
    return (
      <Fragment>

        <div className="jumbotron">
          <div className="container2">
            <h1 style={{ fontSize: '3rem' }}>UK Petitions Dashboard</h1>
            <Search />
          </div>
        </div>
        <div className="container">
          <Dashboard />

        </div>

      </Fragment>
    )
  }
}

export default Home
