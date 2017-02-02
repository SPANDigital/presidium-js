import React, { Component } from 'react';
import paths from '../util/paths';

export default class MenuItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: paths.concat(props.baseUrl, props.item.path),
            isActive: props.isActive,
            expand: false,
            hasChildren: Object.prototype.hasOwnProperty.call(props.item, 'articles')
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
        return parent.articles.map(article => {
                const path = paths.concat(this.props.baseUrl, article.path);
                return (
                    <li key={ path } >
                        <a href={ path }>{ article.title }</a>
                    </li>
                )
        })
    }

}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    baseUrl: React.PropTypes.string.isRequired
};