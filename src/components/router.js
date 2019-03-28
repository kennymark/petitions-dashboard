import React from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './../components/home'
import NotFound from './../components/notfound'



const Routes = () => (

  <Router>
    <div>
      {/* <Nav /> */}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact component={NotFound} />
      </Switch>
    </div>


  </Router>

)
export default Routes;