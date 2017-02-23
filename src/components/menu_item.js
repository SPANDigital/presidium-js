import React, { Component } from 'react';
import { MENU_TYPE } from './menu_structure';

/**
 * Menu item that may have one or more articles or groups of articles
 */
export default class MenuItem extends Component {

    constructor(props) {
        super(props);

        const onPage = this.onPage();
        const hasChildren = props.item.children.length > 0;

        this.state = {
            onPage: onPage,
            hasChildren: hasChildren,
            isExpanded: onPage && hasChildren
        };
    }

    onPage() {
        switch(this.props.item.type) {
            case MENU_TYPE.SECTION:
            case MENU_TYPE.ARTICLE:
                return this.props.item.path == window.location.pathname;
            case MENU_TYPE.CATEGORY:
                // return item.children.findIndex(child => child.path == (window.location.pathname + window.location.hash)) > -1
            default:
                return false;
        }
    }

    render() {
        const item = this.props.item;
        return (
            <li key={ item.id } className={ this.liClass() }>
                <a onClick={ (e) => this.clickParent(e) } href={ item.path } className={ this.levelClass(item.level) + "" }>
                    {this.expander()}
                    <span>{ item.title }</span>
                </a>
                <ul className="dropdown-menu" data-gumshoe>
                    { this.state.isExpanded && this.state.hasChildren && (
                        this.children()
                    )}
                </ul>
            </li>
        )
    }

    children() {
        return this.props.item.children.map(item => {
            switch(item.type) {
                case MENU_TYPE.CATEGORY:
                    return  <MenuItem key={ item.title } item={ item } onNavigate={ this.props.onNavigate } />;

                case MENU_TYPE.ARTICLE:
                    return  <li key={ item.id }>
                                <a onClick={ () => this.clickChild(item.path) } href={ item.slug } className={ this.levelClass(item.level) }>{item.title }</a>
                            </li>;
            }
        });
    }

    expander() {
        if (this.state.hasChildren) {
            return <span onClick={(e) => this.toggleExpand(e)} className={this.state.isExpanded ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-right"}/>
        } else {
            return <span className="expand-placeholder"/>
        }
    }

    levelClass(level) {
        switch(level) {
            case 1: return 'level-one';
            case 2: return 'level-two';
            case 3: return 'level-three';
        }
        return "";
    }

    liClass() {
        return  (this.state.onPage? "on-page" : "") + " " +
                (this.state.isExpanded? "open" : "")
    }

    clickParent(e) {
         e.preventDefault();
        if (!this.isOnSection()) {
            window.location = this.props.item.path;
        }
    }

    clickChild(path, e) {
        window.location = path;
        this.props.onNavigate(e);
    }

    toggleExpand(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.state.hasChildren && !this.isOnSection()) {
            this.setState({isExpanded : !this.state.isExpanded})
        }
    }

    isOnSection() {
        return this.state.onPage && this.props.item.type == MENU_TYPE.SECTION;
    }
}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onNavigate: React.PropTypes.func
};