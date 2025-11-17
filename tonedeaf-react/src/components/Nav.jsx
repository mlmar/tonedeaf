import { useState } from 'react';

/*
  Navigation bar ui element
  - displays the currently selected navigation element based on provided index

  text      :   title string
  index     :   index of currently selected nav option
  setIndex  :   callback to parent to set currently selected index

*/
const Nav = ({ index, setIndex, options, text, onLogout }) => {
  const [mobileButtonsVisible, setMobileButtonsVisible] = useState(false);

  const setNavIndex = (event) => {
    if(setIndex) setIndex(parseInt(event.target.id));
    setMobileButtonsVisible(false);
  }

  const handleBurgerButton = () => {
    setMobileButtonsVisible(!mobileButtonsVisible);
  }

  const getButtons = () => {
    return (
      <>
        <span className="options">
          { options?.map((option, i) => <button className={index === i ? "selected desktop" : "desktop"} onClick={setNavIndex} id={i} key={i}> {option} </button>) }
        </span>
        <button className="desktop" onClick={onLogout}> Logout </button>
      </>
    )
  }

  const getMobileButtons = () => {
    return (
      <>
        <div className="mobile mobile-options">
          { options?.map((option, i) => <button className={index === i ? "selected" : ""} onClick={setNavIndex} id={i} key={i}> {option} </button>) }
          <button onClick={onLogout}> Logout </button>
        </div>
        <div className="back" onClick={() => { setMobileButtonsVisible(false) }}></div>
      </>
    )
  }

  return (
    <nav className="nav">
      <span className="title">
        <label> {text} </label>
        {getButtons()}
        <button className="burger-btn mobile" onClick={handleBurgerButton}> &#9776; </button>
        { mobileButtonsVisible && getMobileButtons()}
      </span>
    </nav>
  )
}

export default Nav;