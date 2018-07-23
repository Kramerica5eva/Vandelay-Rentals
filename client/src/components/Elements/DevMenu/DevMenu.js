import React, { Component } from "react";
import DropdownMenu from 'react-dd-menu';
import { Link } from "react-router-dom";
import "./DevMenu.css"

class DevMenu extends Component {
  constructor() {
    super();
    this.state = {
      isMenuOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
  }

  toggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  close() {
    this.setState({ isMenuOpen: false });
  }

  render() {
    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close,
      toggle: <span type="button" onClick={this.toggle}>&lt; dev &gt;</span>,
      align: 'right',
      animAlign: 'right',
      textAlign: 'left'
    };
    return (
      <DropdownMenu {...menuOptions}>

        <li><Link className="btn-link" to="/test" role="button">TestKeith</Link></li>
        <li><Link className="btn-link" to="/testnick" role="button">TestNick</Link></li>
        <li><Link className="btn-link" to="/testben" role="button">TestBen</Link></li>
        <li><Link className="btn-link" to="/testbrandon" role="button">TestBrandon</Link></li>
        <li><Link className="btn-link" to="/testcorb" role="button">TestCorb</Link></li>
        <li><Link className="btn-link" to="/waiver" role="button">Waiver</Link></li>
        {this.props.admin ? <li><Link className="btn-link" to="/adminkeith" role="button">AdminKeith</Link></li> : null}
        {this.props.admin ? <li><Link className="btn-link" to="/adminbrandon" role="button">AdminBrandon</Link></li> : null}

      </DropdownMenu>
    );
  }
}

export default DevMenu;





//   <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
//   <Link className="btn-link" to="/sales" role="button">Sales</Link>
//   <Link className="btn-link" to="/courses" role="button">Courses</Link>
//           {
//   props.loggedIn ? (
//     <Fragment>
//       <Link className="btn-link" to="/cart" role="button">Cart</Link>
//       <button className="btn-link" onClick={props.logout}>logout</button>
//     </Fragment>
//   ) : (
//     <Fragment>
//       <Link className="btn-link" to={{ pathname: "/signup", state: { from: props.location.pathname } }} role="button">Signup</Link>
//       <Link className="btn-link" to="/login" role="button">Login</Link>
//     </Fragment>
//   )
// }
