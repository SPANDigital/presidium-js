import React, { Component } from 'react';
import {MENU_TYPE} from './menu_structure';

/**
 * Menu item that may have one or more articles or groups of articles
 */
export default class MenuItem extends Component {

    constructor(props) {
        super(props);

        const path = props.item.path;
        const isActive = this.isActive();
        const hasChildren = props.item.children.length > 0;

        this.state = {
            path: path,
            isActive: isActive,
            hasChildren: hasChildren,
            isExpanded: isActive && hasChildren
        };
    }

    isActive() {
        var item = this.props.item;
        switch(item.type) {
            case MENU_TYPE.SECTION:
            case MENU_TYPE.ARTICLE:
                return item.path == window.location.pathname;
            case MENU_TYPE.CATEGORY:
                // return item.children.findIndex(child => child.path == (window.location.pathname + window.location.hash)) > -1
            default:
                return false;
        }
    }

    render() {
        return (
            <li key={ this.state.path } className={ this.liClass(this.state.isActive, this.state.isExpanded) }>
                <a onClick={(e) => this.clickParent(e) } className={ this.levelClass(this.props.item.level) + " dropdown-toggle" }>
                    {this.expander()}
                    <span>{ this.props.item.title }</span>
                </a>
                <ul className="dropdown-menu">
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
                    return  <MenuItem key={ item.title } item={ item } onNavigate={ this.props.onNavigate }/>;

                case MENU_TYPE.ARTICLE:
                    return  <li key={ item.id } className={ this.state.isActive? "active" : "" }>
                                <a onClick={ () => this.clickChild(item.path) } href={ item.path } className={ this.levelClass(item.level) }>{item.title }</a>
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
        return  (this.state.isActive? "active" : "") + " " + (this.state.isExpanded? "open" : "")
    }

    clickParent(e) {
        if (this.state.isActive && this.props.item.type == MENU_TYPE.SECTION) {
            this.toggleExpand(e)
        } else {
            window.location = this.state.path;
        }
    }

    clickChild(path, e) {
        // this.setState({isActive : this.isActive()});
        window.location = path;
        this.props.onNavigate(e);
    }

    toggleExpand(e) {
        e.stopPropagation();
        if (this.state.hasChildren) {
            this.setState({isExpanded : !this.state.isExpanded})
        }
    }
}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onNavigate: React.PropTypes.func
};