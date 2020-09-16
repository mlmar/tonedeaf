import React from 'react';

/*  Search panel to render user results
 */
class UserSearch extends React.Component {
  constructor(props) {
    super(props);
    
    this.search = this.search.bind(this);
    this.renderUser = this.renderUser.bind(this);
  }

  search(e) {
    var query = e.target.value
    if(this.props.search) 
      this.props.search(query)
    else
      console.log(query);
  }

  renderUser(user, i) {
    return (
      <button className="animate-fade" id={user.id} key={i} onClick={this.props.userSelect}>
        {user.display_name}
      </button>
    )
  }

  render() {
    var display;
    if(this.props.results) {
      display = (
        <div className="results">
          {
            this.props.results.map((user, i) => {
              return this.renderUser(user, i);
            })
          }
        </div>
      )

    }

    return (
      <div className="div-user-search">
        <div className="panel animate-fade">
          <input type="text" className="input input-search" onChange={this.search} placeholder="Search for a user"/>
        </div>
        {display}
      </div>
    )
  }
}

export default UserSearch;