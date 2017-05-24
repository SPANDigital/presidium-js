import React, { Component } from 'react';
import { getVersions } from '../../actions/versions';
import { bindActionCreators } from 'redux';
import reducers from '../../reducers';
import { connect } from 'react-redux';

/**
 * Version Navigation Component.
 */
class Versions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            versions: {}
            //label:  "Some label"
        };
    }

    onChangeVersion(version) {
        // Do Something -- redirect the entire page.
    }

    componentWillReceiveProps(props) {
        this.setState(props.versions);
    }

    componentWillMount(){
        this.props.getVersions('url');
    }

    render() {
        // OK SO THE CURRENT VALUE NEEDS TO BE THE VERSION WE ARE CURRENTLY ON
        // EASIEST WAY IS TO GET THAT FROM THE URL
        return this.state.selected && (
            <div className="filter form-group">
                {this.state.label && <label className="control-label" htmlFor="versions-select">{this.state.label}:</label>}
                <select id="versions-select" className="form-control" value={ this.state.selected } onChange={(e) => this.onChangeVersion(e)}>
                    {this.state.versions.map(version => {
                        return <option key={ version } value={ version }>{ version }</option>
                    })}
                </select>
            </div>)
    }
}

function mapStateToProps(state) {
    return { selected: state.selected, versions: state.versions };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ getVersions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Versions);