/*
  Displays minimum and maximum input range sliders and its appropriate labels

   - each attribute is an object consisting of  { attribute, id, min, max, step, userMin, userMax }
*/
const AttributeInput = (attribute) => {
    /*
    Change handlers for input sliders -- convert string values to floats before setting respective state
  */
    const handleMinChange = (event) => {
        const value = parseFloat(event.target.value);
        if (attribute?.onChange)
            attribute.onChange(attribute?.id, value, "min");
    };

    const handleMaxChange = (event) => {
        const value = parseFloat(event.target.value);
        if (attribute?.onChange)
            attribute.onChange(attribute?.id, value, "max");
    };

    // prevent errors for when <input/> does not recognize a certain property
    const cleaned = { ...attribute };
    delete cleaned.defaultMin;
    delete cleaned.defaultMax;
    delete cleaned.userMin;
    delete cleaned.userMax;

    const minLabel = (
        <label className="slider-label small"> {attribute?.min} </label>
    );
    const maxLabel = (
        <label className="slider-label small"> {attribute?.max} </label>
    );

    return (
        <div className="flex-col attribute">
            <div className="description flex-col">
                <label className="bold"> {attribute?.name} </label>
                <label className="small descrioption">
                    {" "}
                    <span className="italic"> Current Range: </span>{" "}
                    {attribute?.userMin} &mdash; {attribute?.userMax}{" "}
                </label>
            </div>

            <div className="flex">
                <label className="minmax-label italic"> Min </label>
                <span className="slider flex">
                    {minLabel}
                    <input
                        type="range"
                        {...cleaned}
                        value={attribute.userMin}
                        onChange={handleMinChange}
                    />
                    {maxLabel}
                </span>
            </div>

            <div className="flex">
                <label className="minmax-label italic"> Max </label>
                <span className="slider flex">
                    {minLabel}
                    <input
                        type="range"
                        {...cleaned}
                        value={attribute.userMax}
                        onChange={handleMaxChange}
                    />
                    {maxLabel}
                </span>
            </div>
        </div>
    );
};

export default AttributeInput;
