import { useState, useEffect } from 'react';

/*
  Displays minimum and maximum input range sliders and its appropriate labels

   - each attribute is an object consisting of  { attribute, id, min, max, step, defaultMin, defaultMax }
   - {attribute.onChange} : when an attribute min/max is changed, call this function with arguments (id, min, max)
*/
const AttributeInput = (attribute) => {
  // set the default values for each slider to defaultMin and defaultMax respectively
  const [min, setMin] = useState(attribute?.defaultMin);
  const [max, setMax] = useState(attribute?.defaultMax);

  /*
    Change handlers for input sliders -- convert string values to floats before setting respective state
  */
  const handleMinChange = (event) => {
    const value = parseFloat(event.target.value);
    setMin(value);
  }
  
  const handleMaxChange = (event) => {
    const value = parseFloat(event.target.value);
    setMax(value);
  }
  
  /* prevent minimum value from ever being greater than maximum value */
  useEffect(() => {
    if(min > max) {
      setMin(max);
    }

    /*
      - call onChange function when a slider is changed
      - since this useEffect is fired upon rendering then all attributes in the parent will be set to default values provided by props
    */
    if(attribute?.onChange) attribute.onChange(attribute?.id, min, max);
  }, [min, max, attribute])

  // prevent errors for when <input/> does not recognize a certain property
  const cleaned = { ...attribute };
  delete cleaned.defaultMin;
  delete cleaned.defaultMax;
  
  const minLabel = <label className="slider-label small"> {attribute?.min} </label>
  const maxLabel = <label className="slider-label small"> {attribute?.max} </label>

  return (
    <div className="flex-col attribute">
      <div className="description flex-col">
        <label className="bold"> {attribute?.name} </label>
        <label className="small descrioption"> <span className="italic"> Current Range: </span> {min} &mdash; {max} </label>
      </div>

      <div className="flex">
        <label className="minmax-label italic"> Min </label>
        <span className="slider flex">
          {minLabel}
          <input type="range" {...cleaned} value={min} onChange={handleMinChange}/>
          {maxLabel}
        </span>
      </div>

      <div className="flex">
        <label className="minmax-label italic"> Max </label>
        <span className="slider flex">
          {minLabel}
          <input type="range" {...cleaned} value={max} onChange={handleMaxChange}/>
          {maxLabel}
        </span>
      </div>
    </div>
  )
}

export default AttributeInput;