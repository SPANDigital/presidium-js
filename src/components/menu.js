import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuItem from './menu_item';
import paths from '../util/paths';
import {groupByCategory} from './menu_structure';
import gumshoe from 'gumshoe';

/**
 * A two level boostrap menu. Doesn't rely on bootstrap.js or jquery js.
 */
class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expand: false
        }
    }

    render() {
        const menu = this.props.menu;
        return (
            <nav className="navbar navbar-default navbar-fixed-side">
                <div className="container">

                    <div className="navbar-header">
                        <a href={ this.props.menu.baseUrl != null ? this.props.menu.baseUrl : "#"} className="navbar-brand">
                            <img src={paths.concat(menu.baseUrl, menu.logo)} alt="" />
                        </a>
                        {this.props.menu.brandName ? <p className="navbar-brand-name">{ this.props.menu.brandName }</p> : ""}
                        <button className="navbar-toggle" onClick={() => this.toggleExpand()}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>
                    <div className={"collapse navbar-collapse " + (this.state.expand == true ? "in" : "")}>
                        <ul className="nav navbar-nav">
                            {
                                menu.structure.map(item => {
                                    return <MenuItem key = { item.id } item = { item } onNavigate = {() => this.toggleExpand()} />
                                })
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

    toggleExpand() {
        this.setState({expand: !this.state.expand})
    }
}

Menu.propTypes = {
    menu: React.PropTypes.shape({
        brandName: React.PropTypes.string,
        structure: React.PropTypes.array,
    }).isRequired,
};

function spy() {
    gumshoe.init({
        selector: '[data-gumshoe] a', // Default link selector (must use a valid CSS selector)
        selectorHeader: '[data-gumshoe-header]', // Fixed header selector (must use a valid CSS selector)
        container: window, // The element to spy on scrolling in (must be a valid DOM Node)
        offset: 100, // Distance in pixels to offset calculations
        activeClass: 'on-article', // Class to apply to active navigation link and it's parent list item
        callback: function (nav) {} // Callback to run after setting active link
    });
}

function loadMenu(menu = {}, element = 'nav-container') {

    menu.structure = menu.structure.map(section => groupByCategory(section));

    ReactDOM.render(<Menu menu = { menu } />, document.getElementById(element));

    spy();

}

export {Menu, loadMenu};