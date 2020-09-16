import React from 'react';

/*  Info.js
 *  
 *  an faq page
 */
class Info extends React.Component {
  render() {
    return (
      <>
        <div className="div-sidebar">
          {this.props.children}
        </div>

        <div className="div-panels">
          <div>
            <div className="panel animate-fade">
              <label className="label-medium">
                How did you get my data?
              </label>  <br/>
              <label className="label-small">  
                I just used the
                <a href="https://developer.spotify.com/documentation/web-api/">
                  &nbsp;Spotify API&nbsp;
                </a>
                and then you gave me permission to access your account when you logged in.
              </label>
            </div>

            <div className="panel animate-fade">
              <label className="label-medium">
                Where are my stats?
              </label>  <br/>
              <label className="label-small">  
                Spotify API doesn't give access to numbers &mdash; only tracks, artists and recommendations.
              </label>
            </div>

            <div className="panel animate-fade">
              <label className="label-medium">
                Is the website lagging?
              </label>  <br/>
              <label className="label-small">  
                The music player only updates every 5 seconds.
                If you're on a phone, the website is slower.
              </label>
            </div>



            <div className="panel animate-fade">
              <label className="label-medium">
                Why aren't things showing up?
              </label>
              <br/>
              <label className="label-small">  
                If you've had this page open for over an hour, for some reason, 
                your Spotify access token expired. Just log back in. 
                If that doesn't work, the server broke or I haven't fixed a mobile bug.
              </label>
            </div>
          </div>

        </div>
      </>
    )
  }
}

export default Info;