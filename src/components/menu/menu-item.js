import React, { Component } from 'react';
import { MENU_TYPE } from './menu-structure';
import gumshoe from './scroll-spy';

/**
 * Menu item that may have one or more articles or nested groups of articles.
 */
export default class MenuItem extends Component {

    constructor(props) {
        super(props);

        const isRootSection = this.isRootSection();
        const hasChildren = props.item.children.length > 0;

        this.state = {
            isRootSection: isRootSection,
            inSection: isRootSection || this.props.inSection,
            hasChildren: hasChildren,
            activeArticle: this.props.activeArticle,
            isExpanded: isRootSection && hasChildren
        };
    }

    isRootSection() {
        return this.props.item.type == MENU_TYPE.SECTION && this.props.item.path == window.location.pathname;
    }

    componentDidMount() {
        if (this.state.isRootSection) {
            this.initializeScrollSpy()
        }
    }

    initializeScrollSpy() {
        gumshoe.init({
            selector: '[data-spy] a',
            selectorHeader: '[data-gumshoe-header]',
            container: window,
            offset: 100,
            activeClass: 'on-article',
            callback: (active) => {
                if (active) {
                    const activeArticle = active.nav.getAttribute("href");
                    if (this.state.activeArticle !== activeArticle) {
                        this.setState({activeArticle : activeArticle})
                    }
                }
            }
        });
    }

    componentWillReceiveProps(props) {
        this.setState({activeArticle : props.activeArticle})
    }

    render() {
        const item = this.props.item;
        return (
            <li key={ item.id } className={ this.isActive()? "in-section" : "" }>
                <div className={"menu-row " + this.levelClass(item.level) }>
                    <div className="menu-expander">
                        {this.expander()}
                    </div>
                    <div className="menu-title">
                        <a onClick={ (e) => this.clickParent(e) }>
                            { item.title }
                        </a>
                    </div>
                </div>
                <ul data-spy className={ this.state.isExpanded? "dropdown expanded" : "dropdown" } >
                    { this.children() }
                </ul>
            </li>
        )
    }

    isActive() {
        if (this.state.isRootSection)
            return true;
        else {
            if (this.state.inSection && this.props.item.type == MENU_TYPE.CATEGORY) {
                return this.props.item.children.findIndex(child => child.slug == this.state.activeArticle) > -1;
            }
        }
    }

    children() {
        return this.props.item.children.map(item => {
            switch(item.type) {
                case MENU_TYPE.CATEGORY:
                    return  <MenuItem key={ item.title } item={ item } inSection={ this.state.inSection } activeArticle={ this.state.activeArticle } onNavigate={ this.props.onNavigate } />;
                case MENU_TYPE.ARTICLE:
                    return  <li key={ item.id }>
                                <div className={"menu-row " + this.levelClass(item.level) }>
                                    <div className="menu-expander"></div>
                                    <div className="menu-title">
                                        <a onClick={ () => this.clickChild(item.path) } href={ item.slug }>{item.title }</a>
                                    </div>
                                </div>
                            </li>;
            }
        });
    }

    expander() {
        if (this.state.hasChildren) {
            return <span onClick={(e) => this.toggleExpand(e)} className={this.state.isExpanded ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-right"}/>
        } else {
            return ""
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

    toggleExpand() {
        if (this.state.hasChildren) {
            this.setState({isExpanded : !this.state.isExpanded})
        }
    }

    clickParent(e) {
        if (this.state.isRootSection) {
            e.stopPropagation();
        } else {
            this.props.onNavigate();
            window.location = this.props.item.path;
        }
    }

    clickChild(path) {
        this.props.onNavigate();
        window.location = path;
    }

}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    inSection: React.PropTypes.bool,
    activeArticle: React.PropTypes.string,
    onNavigate: React.PropTypes.func,

};