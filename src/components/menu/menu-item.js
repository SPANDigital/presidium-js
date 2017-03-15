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
        //Propagate active article and filter down the chain
        const activeArticle = this.state.isRootSection? this.state.activeArticle : props.activeArticle;
        this.setState({
            activeArticle : activeArticle,
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
            selectorTarget: "#presidium-content .article > .anchor",
            container: window,
            offset: 100,
            activeClass: 'on-article',
            callback: (active) => {
                const activeArticle = active ? active.nav.getAttribute("data-id") : undefined;
                if (this.state.activeArticle !== activeArticle) {
                    this.setState({activeArticle: activeArticle})
                }
            }
        });
    }

    render() {
        const item = this.props.item;
        return (
            <li key={ item.id } className={ this.parentStyle(item) }>
                <div onClick={ (e) => this.clickParent(e) } className={ "menu-row " + this.levelClass(item.level) }>
                    <div className="menu-expander">
                        { this.expander() }
                    </div>
                    <div className="menu-title">
                        <a>{ item.title }</a>
                    </div>
                </div>
                { this.state.isExpandable &&
                <ul {...this.spyOnMe()} className={ this.state.isExpanded ? "dropdown expanded" : "dropdown" }>
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
                    return <li key={ item.id } className={ this.childStyle(item) }>
                                <div onClick={ () => this.clickChild(item.path) } className={ "menu-row " + this.articleStyle(item) }>
                                    <div className="menu-expander"></div>
                                    <div className="menu-title">
                                        <a data-id={ item.id } href={ item.slug }>{item.title }</a>
                                    </div>
                                </div>
                            </li>;
            }
        });
    }

    expander() {
        if (this.state.isExpandable && this.state.hasChildren) {
            return <span onClick={ (e) => this.toggleExpand(e) } className={ this.state.isExpanded ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-right" }/>
        } else {
            return ""
        }
    }

    spyOnMe() {
        return this.state.isRootSection ? {"data-spy" : ""} : {};
    }

    parentStyle(item) {
        var style = "";
        if (this.inSection()) {
            style += (this.state.isExpanded) ? " in-section expanded" : " in-section";
        }
        if (!this.inFilter(item)) {
            style += " hidden";
        }
        return style;
    }

    childStyle(item) {
        var style = "";
        if (this.state.activeArticle == item.id) {
            style += " on-article";
        }
        if (!this.inFilter(item)) {
            style += " hidden";
        }
        return style;
    }

    articleStyle(item) {
        return this.levelClass(item.level) + this.activeClass(item);
    }

    activeClass(item) {
        return this.state.activeArticle == item.id ? ' on-article' : '';
    }

    levelClass(level) {
        switch(level) {
            case 1: return ' level-one';
            case 2: return ' level-two';
            case 3: return ' level-three';
            case 4: return ' level-four';
        }
        return "";
    }

    inSection() {
        if (!this.state.inSection) {
            return false; //most cases
        }
        return this.state.isRootSection || (this.state.hasChildren && this.containsArticle());
    }

    containsArticle() {
        if (!this.state.activeArticle) {
            return false;
        }
        return this.props.item.children.find(child => {
            if (child.type == MENU_TYPE.ARTICLE && child.id == this.state.activeArticle) {
                return true;
            } else if (child.children) {
                return child.children.find(article => {
                    if (article.id == this.state.activeArticle) {
                        return true;
                    }
                });
            }
        });
    }

    inFilter(item) {
        return this.props.filter.selected == this.props.filter.all ||
            item.filters.has(this.props.filter.all) ||
            item.filters.has(this.props.filter.selected);
    }

    toggleExpand(e) {
        e.stopPropagation();
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

            if (this.props.item.type == MENU_TYPE.CATEGORY && !this.state.isExpanded) {
                this.setState({ isExpanded : true });
            }
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
    filter: React.PropTypes.object
};

MenuItem.defaultProps = {
    inSection: false
};