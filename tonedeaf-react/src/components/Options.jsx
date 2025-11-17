/*
  Option select panel

  title       : title string
  description : description string
  options     : array of option strings
  onClick     : passes back array index of option as an arugment
  col         : displays the options vertically if true
  index       : currently selected option
*/
const Options = ({ title, subtitle, description, options, onClick, col, index, children, className, ...props }) => {
    const handleClick = (event) => {
        if (onClick && event.target.id) onClick(parseInt(event.target.id));
    }

    function renderOption(option) {
        if (option?.icon) {
            return <img src={option.icon} alt={option.text} />
        }
        return option
    }

    return (
        <div className={"options-panel flex-col " + (className || "")} {...props}>
            {title ? <label className={"medium bold flex"} title={"Toggle Menu"}> {title} </label> : null}
            {description && <p className="small"> {description} </p>}
            {subtitle}
            <div className={"options " + (col ? "flex-col" : "")} onClick={handleClick} >
                {options?.map((option, i) => <Option selected={index === i} id={i} key={option + i}> {renderOption(option)} </Option>)}
                {children}
            </div>
        </div>
    )
}

export const Option = ({ id, selected, children, href }) => {
    return <a id={id} className={"gray-btn bold flex option " + (selected ? "selected" : "")} href={href} target="_blank" rel="noreferrer"> {children} </a>
}

export default Options;