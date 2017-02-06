import React, { Component } from 'react';
import paths from '../util/paths';

export default class MenuItem extends Component {

    constructor(props) {
        super(props);
        const path = paths.concat(props.baseUrl, props.item.path);
        const isActive = this.isActive(path, this.props.currentPage);
        const hasChildren = Object.prototype.hasOwnProperty.call(props.item, 'articles');
        this.state = {
            path: path,
            isActive: isActive,
            hasChildren: hasChildren,
            expand: isActive && hasChildren
        };
    }

    render() {
        return (
            <li
                key={ this.state.path }
                className={
                (this.state.isActive? "active" : "") + " " +
                (this.state.expand? "open" : "")}>
                <a className="dropdown-toggle">
                    <span onClick={() => this.navigate()}>{ this.props.item.title }</span>
                    {this.state.hasChildren &&
                        <span onClick={() => this.toggleExpand()}
                              className={this.state.expand ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-right"} />}
                </a>
                { this.state.expand && this.state.hasChildren && (
                    <ul className="dropdown-menu">
                        { this.children(this.props.item) }
                    </ul>
                )}
            </li>
        )
    }

    isActive(path, currentPage) {
        if (currentPage == "/") {
            return path == currentPage
        } else {
            return path.startsWith(currentPage);
        }
    }

    navigate() {
        if (!this.state.isActive) {
            window.location = this.state.path;
        }
    }

    toggleExpand() {
        if (this.state.hasChildren) {
            this.setState({expand : !this.state.expand})
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
        });
    }

}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    baseUrl: React.PropTypes.string.isRequired,
    currentPage: React.PropTypes.string.isRequired
};