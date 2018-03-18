import React from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './../components/main'
import About from './../components/about'
import NotFound from './../components/notfound'
import Nav from './../components/nav'



const Routes = () => (

  <Router>
    <div>
      <Nav />
      <Switch>

        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact component={NotFound} />
      </Switch>
    </div>


  </Router>

)
export default Routes;