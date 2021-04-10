const convert = require('html-to-image').toPng;
const download = require('downloadjs');


const options = {
  style : {
    background: "#131313",
  }
}

const saveImage = async (listRef, name) => {
  if(!listRef?.current) return;

  try {
    var dataURL = await convert(listRef.current, options);
    download(dataURL, name + ".png");

  } catch(error) {
    console.warn("Error exporting image from Artists", error)
  }
}

export default saveImage;