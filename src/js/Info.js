import React from 'react';

/*  FAQ.js
 *  
 *  an faq page
 */
class Info extends React.Component {
  constructor(props) {
    super(props);

    // hide text by default to fade it in
    this.state = {
      classes : "div-frontpage hide"
    };
    
    this.page = React.createRef();
  }
  
  render() {
    return (
      <div ref={this.page}>

        <div className="panel animate-drop">
          <label className="label-medium">
            Where are my stats?
          </label>  <br/>
          <label className="label-small">  
            Spotify doesn't give me numbers, just tracks and artists.
          </label>
        </div>

        <div className="panel animate-drop">
          <label className="label-medium">
            Is the website lagging?
          </label>  <br/>
          <label className="label-small">  
            If you're talking about the music player, it only updates every 5 seconds.
            If you're on mobile, the website is slower.
          </label>
        </div>

        <div className="panel animate-drop">
          <label className="label-medium">
            Why am I seeing this page?
          </label>  <br/>
          <label className="label-small">  
            If you're here and didn't click on this page, something broke. 
          </label>
        </div>

        <div className="panel animate-drop">
          <label className="label-medium">
            How did you get my data?
          </label>  <br/>
          <label className="label-small">  
            I just used the
            <a href="https://developer.spotify.com/documentation/web-api/">
              &nbsp; Spotify API &nbsp;
            </a>
            and then you gave me permission to access your account when you logged in.
          </label>
        </div>

        <div className="panel animate-drop">
          <label className="label-medium">
            Why aren't things showing up?
          </label>
          <br/>
          <label className="label-small">  
            If you've had this page open for over an hour, for some reason, 
            your Spotify access token expired. Just log back in. 
            If that doesn't work, the server broke.
          </label>
        </div>

      </div>
    )
  }
}

export default Info;