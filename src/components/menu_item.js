import React, { Component } from 'react';
import paths from '../util/paths';
/**
 * Menu item that may have one or more articles or groups of articles
 */
export default class MenuItem extends Component {

    constructor(props) {
        super(props);
        const path = paths.concat(props.baseUrl, props.item.path);
        const current = paths.concat(props.baseUrl, props.currentPage);
        const isActive = this.isActive(path, current);
        const hasArticles = this.hasItems(props.item, 'articles');
        const hasGroups = this.hasItems(props.item, 'groups');

        this.state = {
            path: path,
            isActive: isActive,
            hasArticles: hasArticles,
            hasGroups: hasGroups,
            isExpanded: this.props.expanded && isActive && (hasArticles || hasGroups)
        };
    }

    hasItems(item, property) {
        return Object.prototype.hasOwnProperty.call(item, property) && item[property].length > 0;
    }

    render() {
        return (
            <li key={ this.state.path } className={ this.liClass(this.state.isActive, this.state.isExpanded) }>
                <a onClick={(e) => this.navigate(e) } className={ this.levelClass(this.props.item.level) + " dropdown-toggle" }>
                    {this.expander()}
                    <span>{ this.props.item.title }</span>
                </a>
                <ul className="dropdown-menu">
                    { this.state.isExpanded && this.state.hasArticles && (
                        this.articles()
                    )}
                    { this.state.isExpanded && this.state.hasGroups && (
                        this.groups()
                    )}
                </ul>
            </li>
        )
    }

    levelClass(level) {
        switch(level) {
            case 1:
                return 'level-one';
            case 2:
                return 'level-two';
            case 3:
                return 'level-three';
        }
        return "";
    }

    liClass() {
        return  (this.state.isActive? "active" : "") + " " +
                (this.state.isExpanded? "open" : "")
    }

    expander() {
        return (this.state.hasGroups || this.state.hasArticles) ?
            <span onClick={(e) => this.toggleExpand(e)} className={this.state.isExpanded ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-right"}/>
            :
            <span className="expand-placeholder"/>
    }

    isActive(path, currentPage) {
        if (currentPage == this.props.baseUrl) {
            return path == currentPage
        } else {
            return path.startsWith(currentPage);
        }
    }

    navigate(e) {
        if (!this.state.isActive) {
            window.location = this.state.path;
        }
    }

    toggleExpand(e) {
        e.stopPropagation();
        if (this.state.hasArticles || this.state.hasGroups) {
            this.setState({isExpanded : !this.state.isExpanded})
        }
    }

    groups() {
        return this.props.item.groups.map(item => {
            return <MenuItem key = { item.path } item= { item } baseUrl={ this.props.baseUrl } currentPage={ this.props.currentPage } expanded={ false }/>
        });
    }

    articles() {
        const active = this.state.isActive? "active" : "";
        return this.props.item.articles.map(article => {

            const path = paths.concat(this.props.baseUrl, article.path);
            return (
                <li key={ path } className={ active }>
                    <a href={ path } className={ this.levelClass(article.level) }>{ article.title }</a>
                </li>
            )
        });
    }

}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    baseUrl: React.PropTypes.string.isRequired,
    currentPage: React.PropTypes.string.isRequired,
    expanded: React.PropTypes.bool
};

MenuItem.defaultProps = {
    expanded: false
};