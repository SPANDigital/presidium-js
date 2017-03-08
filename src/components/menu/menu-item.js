import React, { Component } from 'react';
import { MENU_TYPE } from './menu-structure';
import gumshoe from './scroll-spy';

/**
 * Menu item that may have one or more articles or nested groups of articles.
 */
export default class MenuItem extends Component {

    constructor(props) {
        super(props);

        const isRootSection = this.props.item.type == MENU_TYPE.SECTION && this.props.item.path == window.location.pathname;
        const hasChildren = props.item.children.length > 0;

        this.state = {
            isRootSection: isRootSection,
            inSection: isRootSection || this.props.inSection,
            isExpandable: this.props.item.expandable,
            hasChildren: hasChildren,
            activeArticle: this.props.activeArticle,
            isExpanded: isRootSection && hasChildren,
            selectedFilter: this.props.filter.selected
        };
    }

    componentDidMount() {
        if (this.state.isRootSection) {
            this.initializeScrollSpy()
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            activeArticle : props.activeArticle, //Sub menu scroll spy
            selectedFilter: props.filter.selected
        });
    }

    componentDidUpdate(prevProps, prevState){
        if (this.state.isRootSection && prevState.selectedFilter != this.state.selectedFilter) {
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
                        this.setState({activeArticle: activeArticle})
                    }
                }
            }
        });
    }

    render() {
        const item = this.props.item;
        return (
            <li key={ item.id } className={ this.parentStyle(item) }>
                <div className={"menu-row " + this.levelStyle(item.level) }>
                    <div className="menu-expander">
                        {this.expander()}
                    </div>
                    <div className="menu-title">
                        <a onClick={ (e) => this.clickParent(e) }>
                            { item.title }
                        </a>
                    </div>
                </div>
                { this.state.isExpandable &&
                <ul data-spy className={ this.state.isExpanded ? "dropdown expanded" : "dropdown" }>
                    { this.children() }
                </ul>
                }
            </li>
        )
    }

    children() {
        return this.props.item.children.map(item => {
            switch(item.type) {
                case MENU_TYPE.CATEGORY:
                    return  <MenuItem key={ item.title } item={ item } filter = { this.props.filter } inSection={ this.state.inSection } activeArticle={ this.state.activeArticle } onNavigate={ this.props.onNavigate } />;
                case MENU_TYPE.ARTICLE:
                    return <li key={ item.id } className={ this.articleStyle(item) }>
                                <div className={"menu-row " + this.levelStyle(item.level) }>
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
        if (this.state.isExpandable && this.state.hasChildren) {
            return <span onClick={(e) => this.toggleExpand(e)} className={this.state.isExpanded ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-right"}/>
        } else {
            return ""
        }
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

    inFilter(item) {
        return this.props.filter.selected == this.props.filter.all ||
            item.filter.has(this.props.filter.all) ||
            item.filter.has(this.props.filter.selected);
    }

    parentStyle(item) {
        var style = "";
        if (this.isActive()) {
            style += "in-section";
        }
        if (!this.inFilter(item)) {
            style += " hidden";
        }
        return style;
    }

    articleStyle(item) {
        return this.inFilter((item)) ? "" : "hidden";
    }


    levelStyle(level) {
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