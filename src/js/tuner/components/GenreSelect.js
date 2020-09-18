import React from 'react';
const glassIcon = require("../../../icon/glass.svg");

/*  Genre selection panel
 *    {this.props.data} : genre list from Spotify
 */
class GenreSelect extends React.Component {
  constructor(props) {
    super(props);

    this.renderSelected = this.renderSelected.bind(this);
    this.renderGenre = this.renderGenre.bind(this);
  }

  renderGenre(genre, i) {
    return <button className="gray-btn animate-fade label-bold" id={i} key={i}> {genre} </button>
  }

  /* Only show panel for selected genres if they have been selected */
  renderSelected() {
    if(this.props.selected.length) {
      return (
        <div className="panel animate-fade">
          <label className="label-small label-bold"> Currently selected genres, press to remove: </label>
          <br/>
          <div className="selected" onClick={this.props.remove}>
            {
              this.props.selected.map((genre, i) => {
                return this.renderGenre(genre, i);
              })
            }
          </div>
          <button className="gray-btn glass-btn tuner-btn" onClick={this.props.get}> <img src={glassIcon} className="glass-icon" alt="glass-icon"/> </button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="div-genre-select">
        {this.renderSelected()}

        { this.props.data && this.props.show && // genre button selection
          <div className="genres" onClick={this.props.add}>
            {
              this.props.data.map((genre, i) => {
                return this.renderGenre(genre, i);
              })
            }
          </div>
        }
    
      </div>
    )
  }
}

export default GenreSelect;