import React, { Fragment } from 'react'
import Search from './search/search';
import Dashboard from './dashboard/dashbord';
import Footer from '../shared/footer';


function Home() {
  return (
    <Fragment>
      {/* <Header /> */}
      <div className="jumbotron">
        <div className="container2">
          <h1 style={{ fontSize: '3rem', color: '#efefef', textAlign: 'center' }}>
            UK Petitions Dashboard
          </h1>
          <Search />
        </div>
      </div>
      <div className="container">
        <Dashboard />
      </div>
      <Footer />
    </Fragment>
  )
}

export default Home
