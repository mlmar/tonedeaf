import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

/*  creates a user profiel component
 *  just shows display name, image, follows and type
 */
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      display_name : "",
      followers : 0,
      uri: "",
      country : "",
      type : "",
      product : "",
      id : ""
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.getProfile = this.getProfile.bind(this);
  }

  // get current user profile profile from spotify web api
  getProfile() {
    this.spotifyWebApi.getMe()
      .then((response) => {
        this.setState({
          image: response.images[0].url,
          display_name : response.display_name,
          followers : response.followers.total,
          uri: response.uri,
          country: response.country,
          type: response.type,
          product: response.product,
          id: response.id
        });

        // sendd id back to parent for use in other components
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
    this.getProfile()
  }
  
  
  render() {    
    return (
      <div className="panel animate-drop div-profile">
        <a href={this.state.uri}>
          <label className="label-subtitle"> {this.state.display_name} </label>
          <img className="img" src={this.state.image} width="70" alt="Profile not found"/>
        </a>
        <div className="div-profile--info">
          <label className="label-small label-bold"> {this.state.product} {this.state.type} </label>
          <label className="label-small label-bold label-right"> {this.state.followers} followers </label>
        </div>
      </div>
    )
  }
}

export default Profile;