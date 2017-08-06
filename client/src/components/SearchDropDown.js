import React from 'react';
import { connect } from 'react-redux';

import {
  updateSearchFilter,
} from '../actions/actions';

import {Grid, Dropdown, Label, Segment} from 'semantic-ui-react';

import PropTypes from 'prop-types';

class SearchDropDown extends React.Component {

  render() {
    return <Grid.Column mobile={8} tablet={5} computer={5}>
      <Segment>
        <Label attached='top'>{this.props.name}</Label>
        <Dropdown placeholder='All'
          multiple search fluid
          onChange={(e, data) =>
            this.props.dispatch(
              updateSearchFilter(this.props.filter, data.value))}
          selection
          options={this.props.options}/>
      </Segment>
    </Grid.Column>
  }
}

SearchDropDown.propTypes = {
  name: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    search: state.search
  }
}
SearchDropDown = connect(
  mapStateToProps
)(SearchDropDown)

export default SearchDropDown;
