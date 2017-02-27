import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuItem from './menu_item';
import paths from '../util/paths';
import {groupByCategory} from './menu_structure';


/**
 * A two level boostrap menu. Doesn't rely on bootstrap.js or jquery js.
 */
class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    render() {
        const menu = this.props.menu;
        return (
            <nav className="navbar">
                <div className="container">

                    <div className="navbar-header">
                        <a href={ this.props.menu.baseUrl != null ? this.props.menu.baseUrl : "#"} className="brand">
                            <img src={paths.concat(menu.baseUrl, menu.logo)} alt="" />
                        </a>
                        {this.props.menu.brandName ? <p className="brand-name">{ this.props.menu.brandName }</p> : ""}
                        <button className="navbar-toggle" onClick={() => this.toggleExpand()}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>
                    <div className={"navbar-items" + (this.state.expanded == true ? " in" : "")}>
                        <ul>
                            {
                                menu.structure.map(item => {
                                    return <MenuItem key={ item.id } item={ item } onNavigate={ () => this.toggleExpand() } />
                                })
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

    toggleExpand() {
        this.setState({expanded: !this.state.expanded})
    }

}

Menu.propTypes = {
    menu: React.PropTypes.shape({
        brandName: React.PropTypes.string,
        structure: React.PropTypes.array,
    }).isRequired,
};

function loadMenu(menu = {}, element = 'nav-container') {

    menu.structure = menu.structure.map(section => groupByCategory(section));

    ReactDOM.render(<Menu menu = { menu } />, document.getElementById(element));
}

export {Menu, loadMenu};