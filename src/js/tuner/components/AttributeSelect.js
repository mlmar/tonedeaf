import React from 'react';
import Attributes from './sub/Attributes.js';

const DESCRIPTIONS = [
  '1 = high chance to acoustic',
  'Based on "tempo, rhythm stability, beat strength, and overall regularity"',
  '0 is a "Bach prelude" and 1 is "death metal"',
  'Values above .5 are more likely to be instrumental',
  '0 = C, 1 = C#, etc.',
  'Values above .8 are more likely to be live',
  'Loudness in decibels, typically between -60 and 0',
  'Major = 1, Minor = 0',
  'Based on total number of plays and recency',
  'Values between .33-.66 may contain both speech and music',
  'Beats per minute',
  'Beats per bar',
  '0 = Sad, 1 = Happy'
]

class AttributeSelect extends React.Component {
  render() {
    return (
      <div className="div-attributes-select" onClick={this.props.onClick}>
        { this.props.data &&
          this.props.data.map((attribute, i) => {
            return (
              <Attributes
                attribute={attribute[0]}
                min={attribute[1]}
                max={attribute[2]}
                step={attribute[3]}
                defaultMin={attribute[4]}
                defaultMax={attribute[5]}
                desc={DESCRIPTIONS[i]}
                key={i}
                id={i}
              />
            )
          })
        }
      </div>
    )
  }
}

export default AttributeSelect;