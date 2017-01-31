import React, { Component } from 'react';
import { concat_path } from '../util/path';

export default class MenuItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: concat_path(props.baseUrl, props.item.path),
            isActive: props.isActive,
            expand: false,
            hasChildren: this.props.item[1] != null
        };
    }

    render() {
        return (
            <li className={
                (this.state.isActive? "active" : "") + " " +
                (this.state.expand? "open" : "")}>
                <a
                    className="dropdown-toggle"
                    onClick={() => this.click()}>
                    { this.props.item.title }
                    { this.state.hasChildren && <b className="caret"/> }
                </a>
                { this.state.expand && (
                    <ul className="dropdown-menu">
                        { this.children(this.props.item) }
                    </ul>
                )}
            </li>
        )
    }

    click() {
        if (this.state.hasChildren) {
            this.setState({expand : !this.state.expand})
        } else {
            window.location = this.state.path;
        }
    }

    children(parent) {
        return Object.keys(parent)
            .filter(k => k >= 1)
            .map(k => {
                const child = parent[k];
                const path = concat_path(this.props.baseUrl, child.path);
                return (
                    <li key={ k } >
                        <a href={ path }>{ child.title }</a>
                    </li>
                )
        })
    }

}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    baseUrl: React.PropTypes.string.isRequired
};