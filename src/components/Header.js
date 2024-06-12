import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Navbar, Alignment, Menu, Popover, Button } from '@blueprintjs/core'

import SkipLinks from 'components/Skiplinks'

import 'styles/Header.css'

class Header extends React.Component {
  render() {
    return (
      <header>
        <SkipLinks contentId="#main-content" />
        <Navbar
          className="eq-header"
          fixedToTop
        >
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading className="eq-logo">
              Spiral Notebook
            </Navbar.Heading>

            {this.renderPrivateNav()}
          </Navbar.Group>

          <Navbar.Group align={Alignment.RIGHT} className="eq-dd-menu">
            {this.renderPublicNav()}
            {this.renderMenu()}
          </Navbar.Group>
        </Navbar>
      </header>
    )
  }

  renderPrivateNav() {
    if (!this.props.user) {
      return null
    }

    let nav = [{
      path: '/dashboard',
      text: 'PORTFOLIO DASHBOARD',
    }, {
      path: '/my-portfolios',
      text: 'MY PORTFOLIOS',
    },
    {
      path: '/shared-portfolios',
      text: 'SHARED PORTFOLIOS',
    }]

    if (this.props.user.role.type === 'researcher') {
      nav[1] = {
        path: '/teacher-portfolios',
        text: 'TEACHER PORTFOLIOS',
      }
    }

    const links = nav.map(item => (
      <Link
        key={item.path}
        to={item.path}
        className={item.path === this.props.path ? 'nav-item active' : 'nav-item'}
      >
        {item.text}
      </Link>
    ))

    return (
      <nav id="main-nav">
        {links}
      </nav>
    )
  }

  renderPublicNav() {
    if (this.props.user) {
      return null
    }

    return (
      <nav id="main-nav">
        <Link
          to="/home"
          className={this.props.path === '/home' ? 'nav-item active' : 'nav-item'}
        >
          HOME
        </Link>
        <a href="https://spiral-notebook-afb65c.webflow.io/" className="nav-item">
          ABOUT
        </a>
      </nav>
    )
  }

  renderMenu() {
    const menu = (
      <Menu>
        {this.renderManageUsersLink()}
        <Menu.Item
          text="Help"
          href="https://github.com/ucla/Spiral-Notebook/wiki/Spiral-Notebook-Web-App-User-Guide"
          target="_blank"
        />
        <Menu.Item text="Log Out" onClick={this.props.onLogout} />
      </Menu>
    )

    if (this.props.user) {
      return (
        <Popover content={menu} className="menu-desktop">
          <Button className="bp3-minimal" rightIcon="chevron-down">
            {this.props.user.username}
          </Button>
        </Popover>
      )
    }

    else {
      return (
        <Link to="/login" className="eq-button link-button" style={{ marginLeft: '20px' }}>
          LOGIN
        </Link>
      )
    }
  }

  renderManageUsersLink() {
    if (!this.props.user || this.props.user.role.type !== 'researcher') {
      return null
    }

    return (
      <li key="users" className="bp3-popover-dismiss">
        <Link
          to="/users"
          className="bp3-menu-item"
          onClick={this.closeMenu}
        >
          Manage Users
        </Link>
      </li>
    )
  }

  closeMenu = (event) => {
    // Hackily close the menu when a menu item is clicked
    // (needed because React Router interferes with normal menu operation)
    event.target.parentElement.click()
  }

  ddIconStyle = {
    backgroundImage: "url('/images/small-down@2x.png')",
  }
}

Header.propTypes = {
  user: PropTypes.object,
  path: PropTypes.string,
  onLogout: PropTypes.func
}

export default Header
