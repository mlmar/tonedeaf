import React from 'react';

/*  navbar component
 *  changes depending on portrait mode
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
    this.controlMenu();
    this.props.callback(event);
  }

  render() {
    return (
      <div>
        <div className="landscape">
          <div className="top">
            <label className="label-title text-white"> tonedeaf </label>
            <div className="nav">
              <div className="nav-buttons" onClick={this.props.callback}>
                {
                  this.props.nav.map(function(item, i) {
                      if (i === 0) {
                          return <button className="nav-btn selected" key={i}>{item}</button>
                      } else {
                          return <button className="nav-btn" key={i}>{item}</button>
                      }
                  })
                }
              </div>
              <div className="div-log-btn">
                <a href={this.props.returnPage}>
                  <button className="nav-btn log-btn"> {this.props.loginButton} </button>
                </a>
              </div>
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
                  this.props.nav.map(function(item, i) {
                      if (i === 0) {
                          return <button className="nav-btn selected" key={i}>{item}</button>
                      } else {
                          return <button className="nav-btn" key={i}>{item}</button>
                      }
                  })
                }
              <a href={this.props.returnPage} className="log-btn-container">
                <button className="nav-btn log-btn"> {this.props.loginButton} </button>
              </a>
            </div>
          </div>
          <div className="top top-border"></div>
        </div>
      </div>
    )
  }
}

export default Nav;