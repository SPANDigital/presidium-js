import React, { Component } from 'react';
import { getVersions } from '../../actions/versions';
import { bindActionCreators } from 'redux';
import reducers from '../../reducers';
import { connect } from 'react-redux';

/**
 * Locale storage key
 */
const SELECTED_VERSION = "version.selected";

/**
 * Version Navigation Component.
 */
class Versions extends Component {

    constructor(props) {
        super(props);

        let current_version = window.location.pathname.replace(window.presidium.versions.gitbase, '').replace(/^\/([^\/]*).*$/, '$1');

        if (!current_version) {
            current_version = 'latest';
        }

        this.state = {
            selected: false,
            versions: {},
            baseurl: window.presidium.versions.gitbase,
            version: current_version
        };
    }

    onChangeVersion(e) {
        let version = e.target.value;
        if (e.target.value === 'latest') {
            version = '';
        }
        window.location.href = `${this.state.baseurl}${version}`;
    }

    componentWillReceiveProps(props) {
        this.setState(props.versions);
    }

    componentWillMount(){
        this.props.getVersions(`${this.state.baseurl}/versions.json`);
    }

    render() {
        return this.state.selected && (
            <div className="filter form-group">
                {this.state.label && <label className="control-label" htmlFor="versions-select">{this.state.label}:</label>}
                <select id="versions-select" className="form-control" value={this.state.version} onChange={(e) => this.onChangeVersion(e)}>
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