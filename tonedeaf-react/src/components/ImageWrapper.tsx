type ImageWrapperProps = {
    src?: string | null | undefined;
    alt?: string | null | undefined;
    title?: string | null | undefined;
    width?: number;
    url?: string | null | undefined;
    className?: string | null | undefined;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    nohover?: boolean;
    id?: string | null | undefined;
    style?: React.CSSProperties;
};
/*
  Image wrapper component to allow for easier image resizing within divs
  - image scales with width of the wrapper, any excess overflow height will be hidden -- Spotify never provides wide images

  {url}     : if a url is provided then the wrapper will be an anchor tag
  {nohover} : disables hover zoom css
*/
export const ImageWrapper = ({
    src,
    alt,
    title,
    width,
    url,
    className = '',
    onClick,
    nohover = false,
    id,
    style,
}: ImageWrapperProps) => {
    const classNames = 'image-wrapper ' + (nohover ? '' : 'hover pointer ') + className;
    const img = src && (
        <img
            width={width || '100'}
            src={src}
            alt={alt || ''}
            title={title || ''}
            id={id || ''}
            crossOrigin='anonymous'
        />
    );

    if (url) {
        return (
            <a className={classNames} href={url} onClick={onClick} style={style}>
                {img}
            </a>
        );
    }
    return (
        <div className={classNames} onClick={onClick} style={style}>
            {img}
        </div>
    );
};
