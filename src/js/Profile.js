import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        image: "",
        display_name : "",
        followers : 0,
        uri: "",
        country : "",
        type : "",
        product : "",
        id : ""
      }
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.getProfile = this.getProfile.bind(this);
  }

  getProfile() {
    this.spotifyWebApi.getMe()
      .then((response) => {
        this.setState({
          info: {
            image: response.images[0].url,
            display_name : response.display_name,
            followers : response.followers.total,
            uri: response.uri,
            country: response.country,
            type: response.type,
            product: response.product,
            id: response.id
          }
        });

        this.props.callback(response.id);
        console.log("Retrieved profile information @");
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not retrieve profile information @");
        console.error(error);
      });
  }

  // get profile on component load
  componentDidMount() {
    if(this.props.type === "artist" ) {
      
    } else {
      this.getProfile()
    }
  }
  
  
  render() {
    var profileInfo;
    if(this.props.type === "artist") {
      profileInfo = (
        <React.Fragment>
          {/* TODO */}
        </React.Fragment>
      )
    } else {
      profileInfo = (
        <div className="div-profile--info">
          <label className="label-small label-bold"> {this.state.info.product} {this.state.info.type} </label>
          <label className="label-small label-bold label-right"> {this.state.info.followers} followers </label>
        </div>
      )
    }
    
    return (
      <div className="panel animate-drop">
        <a href={this.state.info.uri}>
          <label className="label-subtitle"> {this.state.info.display_name} </label>
          <img className="img" src={this.state.info.image} width="70" alt="Profile not found"/>
        </a>
        {profileInfo}
      </div>
    )
  }
}

export default Profile;