import React from 'react';

import Options from '../helper/Options.js';
import UserSearch from './UserSearch.js';
import ArtistList from '../artist/components/ArtistList.js';
import TrackList from '../track/components/TrackList.js';

import TonedeafService from '../util/TonedeafService.js';

class UserSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data : null,
      allResults : null,
      searchResults : null,
      user : null
    }

    this.category = "artists"
    this.timeRange = "long_term";

    this.tonedeafService = new TonedeafService();

    this.setCategory = this.setCategory.bind(this);
    this.setTimeRange = this.setTimeRange.bind(this);
    this.search = this.search.bind(this);
    this.userSelect = this.userSelect.bind(this);
    this.renderUserFilter = this.renderUserFilter.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  setCategory(index) {
    var categories = ["artists", "tracks"];
    this.category = categories[index];
    var entry = this.category + "_" + this.timeRange;
    this.setState({ data : this.state.user[entry]})
  }

  setTimeRange(index) {
    var ranges = ["long_term", "medium_term", "short_term"];
    this.timeRange = ranges[index];
    var entry = this.category + "_" + this.timeRange;
    this.setState({ data : this.state.user[entry]})
  }

  // callback for user search component
  //    filters through loaded data
  search(query) {
    if(query.length) {
      var cleanQuery = query.replace(".","").replace("_","").replace("-","");
      var filtered = [];
      this.state.allResults.forEach((r) => {
        var cleanResult = r.display_name.replace(".","").replace("_","").replace("-","")
        if(cleanResult.includes(cleanQuery)) {
          filtered.push(r);
        }
      });
      this.setState({ searchResults : filtered, data : null });
    } else {
      this.setState({ searchResults : this.state.allResults, data : null });
    }
  }

  userSelect(e) {
    this.tonedeafService.load((response) => {
      this.setState({ user : response.data, searchResults : null }, () => this.setCategory(0));
    }, e.target.id)
  }

  componentDidMount() {
    this.tonedeafService.search((response) => { // load all data on mount
      this.setState({ allResults : response.data, searchResults : response.data });
    }, "");
  }

  renderUserFilter() {
    return (
      <div className="panel">
        <label className="label-subtitle"> Viewing {this.state.user.display_name}'s top listens </label>

        <Options horizontal nopanel text="" options={["Artists", "Tracks"]} callback={this.setCategory} key={this.state.user.id}> </Options>
        <Options horizontal nopanel text="" options={["Long Term", "6 Months", "4 Weeks"]} callback={this.setTimeRange} key={this.state.user.id + "1"}> </Options>
      </div>
    )
  }

  renderData() {
    if(this.state.user) {
      if(this.state.data) {
        if(this.category === "artists") {
          return <ArtistList data={this.state.data}/>
        } else {
          return <TrackList data={this.state.data}/>
        }
      } else if(!this.state.searchResults) {
        return <label className="label-medium label-bold animate-fade nolist"> This user hasn't loaded in this list yet. </label>
      }
    } 
  }

  render() {
    return (
      <>
        <div className="div-sidebar">

          { this.state.user &&
            this.renderUserFilter()
          }

          { this.state.data &&
            <Options
              text="Like these tracks?"
              options={["Create Spotify Playlist"]}
              callback={() => {}}
            />
          }

          {this.props.children}
        </div>

        <div className="div-panels">
          { this.state.allResults &&
            <UserSearch
              results={this.state.searchResults}
              search={this.search}
              userSelect={this.userSelect}
            />
          }
          { !this.state.allResults &&
            <>
              <br/>
              <label className="label-medium label-bold animate-fade"> Connecting... </label>
              <div className="animate-load"></div>
            </>
          }
          {this.renderData()}
        </div>
        
      </>
    )
  }
}

export default UserSearchPage;