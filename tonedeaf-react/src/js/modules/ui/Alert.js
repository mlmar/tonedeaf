const Alert = ({ children, visible, onClick }) => {
  if(visible) {
    return (
      <div className="alert flex">
        <div className="message flex-col">
          <label className="large bold"> {children} </label>
          <button className="small bold" onClick={onClick}> Ok </button>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

export default Alert;