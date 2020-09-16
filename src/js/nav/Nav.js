import React from 'react';

/*  navbar component
 *  changes depending on portrait mode
 *  required props:
 *    {this.props.onClick} : function to call when nav button is clicked
 *    {returnPage}          : page to return to when log out is clicked
 *    {loginButton}         : login/logout button text
 *    {selectedIndex}       : currently selected nav index
 */
class Nav extends React.Component {

  constructor(props) {
    super(props);

    this.portraitNav = React.createRef();
    this.unselect = React.createRef();
    this.controlMenu = this.controlMenu.bind(this);
    this.selectMenu = this.selectMenu.bind(this);
  }

  // menu animations
  controlMenu(event) {
    this.portraitNav.current.classList.toggle("top-open");
    this.portraitNav.current.classList.toggle("top-closed");
    this.unselect.current.classList.toggle("top-open");
  }

  // close the menu automatically then go to new page
  selectMenu(event) {
    this.controlMenu(); // for mobile menu animations

    // since onClick is called from, confirm a button was clicked
    if(event.target.tagName === "BUTTON") {
      this.props.onClick(parseFloat(event.target.id));
    }
  }

  render() {
    return (
      <div>
        <div className="landscape">
          <div className="top">
            <label className="label-title text-white"> tonedeaf </label>
            <div className="nav">
              <div className="nav-buttons" onClick={this.selectMenu}>
                {
                  this.props.nav.map((item, i) => {
                      if (i === this.props.selectedIndex) {
                          return <button className="selected" key={i} id={i}>{item}</button>
                      } else {
                          return <button key={i} id={i}>{item}</button>
                      }
                  })
                }
              </div>
              <button className="log-btn" onClick={this.props.logout}> Logout </button>
            </div>
          </div>
        </div>

        <div className="portrait">
          <div className="top-unselect" ref={this.unselect} onClick={this.controlMenu}></div>
          <div className="top top-closed" ref={this.portraitNav}>

            <div className="top-title-bar">
              <label className="label-title text-white title"> tonedeaf </label>
              <div className="menu-btn--col">
                <button className="align-right menu-btn" onClick={this.controlMenu}> &#9776; </button>
              </div>
            </div>

            <div className="nav-buttons" onClick={this.selectMenu}>
                {
                  this.props.nav.map((item, i) => {
                      if (i === this.props.selectedIndex) {
                          return <button className="selected" key={i} id={i}>{item}</button>
                      } else {
                          return <button key={i} id={i}>{item}</button>
                      }
                  })
                }
              <button className="nav-btn log-btn" onClick={this.props.logout}> Logout </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Nav;