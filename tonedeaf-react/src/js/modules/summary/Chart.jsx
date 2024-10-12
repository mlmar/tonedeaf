const Chart = (props) => {
  const { display, averages, className } = props;

  return (
    <div className={"chart flex-col " + (className || "")}>
      { 
        Object.keys(averages).sort().map(key => {
          const attr = averages[key];
          if(display.includes(key)) {
            return (
              <div className="flex row flex-fill medium " key={key}>
                <label className="flex bold"> {attr.name?.toLowerCase()} </label>
                <span className="flex bar flex-fill">
                  <span className="flex color" style={{ width: attr.total / 1 * 100 + "%" }}></span>
                  <span className="flex inactive"> {attr.total} </span>
                </span>
              </div>
            )
          } else {
            return null;
          }
        }
      )}
    </div>
  )
}

export default Chart;