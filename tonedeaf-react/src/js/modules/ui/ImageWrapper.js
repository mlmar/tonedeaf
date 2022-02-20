/*
  Image wrapper component to allow for easier image resizing within divs
  - image scales with width of the wrapper, any excess overflow height will be hidden -- Spotify never provides wide images

  {url}     : if a url is provided then the wrapper will be an anchor tag
  {nohover} : disables hover zoom css
*/
const ImageWrapper = ({ src, alt, title, width, url, className, onClick, nohover, id, style}) => {
  const handleClick = (event) => {
    if(onClick) onClick(event);
  }

  const css = "image-wrapper " + (nohover ? "" : "hover pointer ") + (className || "");
  const img = <img width={width || "100"} src={src} alt={alt} title={title} id={id}/>

  return (
    url ? (
      <a className={css} href={url} onClick={handleClick} style={style}>
        {img}
      </a>
    )
    : (
      <div className={css} onClick={handleClick} style={style}>
        {img}
      </div>
    )
  )
}

export default ImageWrapper;