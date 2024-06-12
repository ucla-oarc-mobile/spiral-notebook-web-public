import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import PrivateRoute from 'pages/PrivateRoute'
import Root from 'pages/Root'
import Home from 'pages/Home'
import Privacy from 'pages/Privacy'
import Login from 'pages/Login'
import ForgotPassword from 'pages/ForgotPassword'
import ResetPassword from 'pages/ResetPassword'
import ImageView from 'pages/ImageView'
import VideoView from 'pages/VideoView'
import Dashboard from 'pages/Dashboard'
import MyPortfolios from 'pages/MyPortfolios'
import EditPortfolio from 'pages/EditPortfolio'
import EditArtifact from 'pages/EditArtifact'
import CopyArtifact from 'pages/CopyArtifact'
import TeacherPortfolios from 'pages/TeacherPortfolios'
import SharedPortfolios from 'pages/SharedPortfolios'
import NewSharedPortfolio from 'pages/NewSharedPortfolio'
import EditSharedPortfolio from 'pages/EditSharedPortfolio'
import EditSharedArtifact from 'pages/EditSharedArtifact'
import Invitation from 'pages/Invitation'
import ManageUsers from 'pages/ManageUsers'

import 'normalize.css/normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'styles/typography.css'
import 'styles/Page.css'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Root} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password/:code" component={ResetPassword} />
            <Route exact path="/images/uploads/:fileName" component={ImageView} />
            <Route exact path="/videos/uploads/:fileName" component={VideoView} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/my-portfolios" component={MyPortfolios} />
            <PrivateRoute exact path="/my-portfolios/:id" component={MyPortfolios} />
            <PrivateRoute exact path="/my-portfolios/:id/edit" component={EditPortfolio} />
            <PrivateRoute exact path="/my-portfolios/:id/artifacts/:artifactId" component={MyPortfolios} />
            <PrivateRoute exact path="/my-portfolios/:id/artifacts/:artifactId/edit" component={EditArtifact} />
            <PrivateRoute exact path="/my-portfolios/:id/artifacts/:artifactId/copy" component={CopyArtifact} />
            <PrivateRoute exact path="/teacher-portfolios" component={TeacherPortfolios} />
            <PrivateRoute exact path="/shared-portfolios" component={SharedPortfolios} />
            <PrivateRoute exact path="/shared-portfolios/new" component={NewSharedPortfolio} />
            <PrivateRoute exact path="/shared-portfolios/:id" component={SharedPortfolios} />
            <PrivateRoute exact path="/shared-portfolios/:id/edit" component={EditSharedPortfolio} />
            <PrivateRoute exact path="/shared-portfolios/:id/artifacts/:artifactId" component={SharedPortfolios} />
            <PrivateRoute exact path="/shared-portfolios/:id/artifacts/:artifactId/edit" component={EditSharedArtifact} />
            <PrivateRoute exact path="/shared-portfolios/:id/artifacts/:artifactId/copy" component={CopyArtifact} />
            <PrivateRoute exact path="/invitation/:id" component={Invitation} />
            <PrivateRoute exact path="/users" component={ManageUsers} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
