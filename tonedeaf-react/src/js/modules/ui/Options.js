/*
  Option select panel

  title       : title string
  description : description string
  options     : array of option strings
  onClick     : passes back array index of option as an arugment
  col         : displays the options vertically if true
  index       : currently selected option
*/
const Options = ({ title, description, options, onClick, col, index, children, className, ...props}) => {
  const handleClick = (event) => {
    if(onClick) onClick(parseInt(event.target.id));
  }

  return (
    <div className={"options-panel flex-col " + (className || "")} {...props}>
      { title ? <label className={"medium bold flex"} title={"Toggle Menu"}> {title} </label> : null }
      { description && <p className="small"> {description} </p> }
      {children}
      <div className={"options " + (col ? "flex-col" : "")}>
        { options?.map((option, i) => <button className={"gray-btn bold flex option" + (index === i ? "selected" : "")} onClick={handleClick} id={i} key={option+i}> {option} </button>)}
      </div>
    </div>
  )
}

export default Options;