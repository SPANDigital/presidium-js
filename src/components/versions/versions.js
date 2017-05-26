import React, { Component } from 'react';
import { getVersions } from '../../actions/versions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Version Navigation Component.
 */
class Versions extends Component {

    constructor(props) {
        super(props);

        const gitbase = window.presidium.versions.gitbase;
        const v = window.location.pathname.replace(gitbase, '').replace(/^\/([^\/]*).*$/, '$1');

        this.state = {
            enabled: false,
            versions: {},
            gitbase: gitbase,
            selected_version: v || 'latest'
        };
    }

    onChangeVersion(e) {
        const version =  e.target.value === 'latest' ?  '' : e.target.value;
        window.location.href = `${this.state.gitbase}/${version}`;
    }

    componentWillReceiveProps(props) {
        this.setState(props.versions);
    }

    componentWillMount(){
        this.props.getVersions(`${this.state.gitbase}/versions.json`);
    }

    render() {
        return this.state.enabled && (
            <div className="filter form-group">
                <select id="versions-select" className="form-control" value={this.state.selected_version}
                        onChange={(version) => this.onChangeVersion(version)}>
                    {
                        this.state.versions.map(version => {
                            return <option key={ version } value={ version }>{ version }</option>
                        })
                    }
                </select>
            </div>)
    }
}

function mapStateToProps(state) {
    return { enabled: state.enabled, versions: state.versions };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ getVersions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Versions);