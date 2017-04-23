import React, { Component } from 'react';
import { MENU_TYPE } from './menu-structure';
import gumshoe from './scroll-spy';

/**
 * Menu item that may have one or more articles or nested groups of articles.
 */
export default class MenuItem extends Component {

    constructor(props) {
        super(props);

        const onPage = this.props.item.url == window.location.pathname;
        const inSection = this.inSection();

        const hasChildren = props.item.children.length > 0;

        this.state = {
            onPage: onPage,
            inSection: onPage || inSection,
            isCollapsed: this.props.item.collapsed,
            hasChildren: hasChildren,
            activeArticle: this.props.activeArticle,
            isExpanded: inSection && hasChildren,
            selectedRole: this.props.roles.selected
        };
    }

    inSection() {
        const base = this.props.item.url;
        const reference = window.location.pathname;
        if (base == this.props.baseUrl) {
            return base == reference;
        }
        return reference.startsWith(base);
    }

    componentDidMount() {
        if (this.state.onPage) {
            this.initializeScrollSpy()
        }
    }

    componentWillReceiveProps(props) {
        //Propagate active article and roles down the menu chain
        const activeArticle = this.state.onPage? this.state.activeArticle : props.activeArticle;
        this.setState({
            activeArticle : activeArticle,
            selectedRole: props.roles.selected
        });
    }

    componentDidUpdate(prevProps, prevState){
        if (this.state.onPage && prevState.selectedRole != this.state.selectedRole) {
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
                //Update active article on scroll. Ignore hidden articles (with distance = 0)
                const activeArticle = active && active.distance > 0 ? active.nav.getAttribute("data-id") : undefined;
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
                        <a data-id={ item.id }  href={ item.url }>{ item.title }</a>
                    </div>
                </div>
                { !this.state.isCollapsed &&
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
                    return  <MenuItem key={ item.title } item={ item } activeArticle={ this.state.activeArticle } roles = { this.props.roles } baseUrl={ this.props.baseUrl }
                                      onNavigate={ this.props.onNavigate } />;
                case MENU_TYPE.ARTICLE:
                    return <li key={ item.id } className={ this.childStyle(item) }>
                                <div onClick={ () => this.clickChild(item.url) } className={ "menu-row " + this.articleStyle(item) }>
                                    <div className="menu-expander"></div>
                                    <div className="menu-title">
                                        <a data-id={ item.id } href={ `#${item.slug}` }>{item.title }</a>
                                    </div>
                                </div>
                            </li>;
            }
        });
    }

    expander() {
        if (!this.state.isCollapsed && this.state.hasChildren) {
            return <span onClick={ (e) => this.toggleExpand(e) } className={ this.state.isExpanded ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-right" }/>
        } else {
            return ""
        }
    }

    spyOnMe() {
        return this.state.onPage ? {"data-spy" : ""} : {};
    }

    parentStyle(item) {
        var style = "";
        if (this.state.inSection || this.containsArticle()) {
            style += (this.state.isExpanded) ? " in-section expanded" : " in-section";
        }
        if (this.state.onPage) {
            style += " on-page";
        }
        if (this.state.activeArticle == item.id) {
            style += " on-article";
        }
        if (!this.hasRole(item)) {
            style += " hidden";
        }
        return style;
    }

    containsArticle() {
        if (!this.state.activeArticle || !this.state.hasChildren) {
            return false;
        }
        return this.containsNested(this.state.activeArticle, this.props.item.children);
    }

    containsNested(activeArticle, children) {
        return children.find(child => {
            if (child.type == MENU_TYPE.ARTICLE && child.id == activeArticle) {
                return true;
            } else if (child.children) {
                return this.containsNested(activeArticle, child.children);
            }
        })
    }

    childStyle(item) {
        var style = "";
        if (this.state.activeArticle == item.id) {
            style += " on-article";
        }
        if (!this.hasRole(item)) {
            style += " hidden";
        }
        return style;
    }

    articleStyle(item) {
        return this.levelClass(item.level);
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

    hasRole(item) {
        return this.props.roles.selected == this.props.roles.all ||
            item.roles.indexOf(this.props.roles.all) >= 0||
            item.roles.indexOf(this.props.roles.selected) >= 0;
    }

    toggleExpand(e) {
        e.stopPropagation();
        if (this.state.hasChildren) {
            this.setState({isExpanded : !this.state.isExpanded})
        }
    }

    clickParent(e) {
        if (this.state.onPage) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            this.props.onNavigate();
            window.location = this.props.item.url;
        }
    }

    clickChild(path) {
        this.props.onNavigate();
        window.location = path;
    }
}

MenuItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    baseUrl: React.PropTypes.string.isRequired,
    activeArticle: React.PropTypes.string,
    onNavigate: React.PropTypes.func,
    roles: React.PropTypes.object
};