import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import rootReducer from '../../reducers/index';
import MenuItem from './menu-item';
import paths from '../../util/paths';
import Versions from '../versions/versions';

/**
 * Locale storage key
 */
const SELECTED_ROLE = "role.selected";

const store = createStore(
    rootReducer,
    {},
    applyMiddleware(ReduxPromise)
);

/**
 * Root navigation menu.
 */
class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            children: this.props.menu.children,
            roles: this.roleFilter(),
            expanded: false,
        };
        this.filterByRole(this.state.roles.selected);
    }

    roleFilter() {
        var selected;
        var roles = this.props.menu.roles;
        if (roles.options.length > 0) {
            selected = sessionStorage.getItem(SELECTED_ROLE);
            if (!selected) {
                selected = roles.all;
                sessionStorage.setItem(SELECTED_ROLE, selected);
            }
        } else {
            selected = roles.all;
        }
        return {
            label: roles.label,
            all: roles.all,
            selected: selected,
            options: [roles.all, ...roles.options]
        }
    }

    render() {
        const menu = this.props.menu;
        return (
            <div className="scrollable-container">
                <nav>
                    <div className="navbar-header">
                        <a href={ this.props.menu.baseUrl != null ? this.props.menu.baseUrl : "#"} className="brand">
                            <img src={paths.concat(menu.baseUrl, menu.logo)} alt="" />
                        </a>
                        { this.props.menu.brandName &&
                        <div>
                            <p className="brand-name">{ this.props.menu.brandName }</p>
                            <Versions store={store} />
                        </div>
                        }
                        <button className="toggle" onClick={() => this.toggleMenu()}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>

                    </div>

                    <div className={"navbar-items" + (this.state.expanded == true ? " expanded" : "")}>
                        {this.renderFilter()}
                        <ul>
                            {
                                this.state.children.map(item => {
                                    return <MenuItem key={ item.id } baseUrl={ this.props.menu.baseUrl } item={ item } roles = { this.state.roles } onNavigate={ () => this.collapseMenu() } />
                                })
                            }
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }

    toggleMenu() {
        this.setState({expanded: !this.state.expanded})
    }

    collapseMenu() {
        this.setState({expanded: false})
    }

    renderFilter() {
        return this.state.roles.selected && (
            <div className="filter form-group">
                {this.state.roles.label && <label className="control-label" htmlFor="roles-select">{this.state.roles.label}:</label>}
                <select id="roles-select" className="form-control" value={ this.state.roles.selected } onChange={(e) => this.onFilterRole(e)}>
                    {this.state.roles.options.map(role => {
                        return <option key={ role } value={ role }>{ role }</option>
                    })}
                </select>
            </div>)
    }

    onFilterRole(e) {
        var selected = e.target.value;
        this.filterByRole(selected);
        const roles = Object.assign({}, this.state.roles, { selected : selected });
        this.setState({ roles : roles});
        sessionStorage.setItem(SELECTED_ROLE, selected);
    }

    filterByRole(selected) {
        const articles = document.querySelectorAll('#presidium-content .article');
        let articlesFound = false;
        articles.forEach(article => {
            if (selected == this.state.roles.all) {
                article.style.display = "block";
                articlesFound = true;
                return;
            }
            const roles = article.getAttribute('data-roles').split(",");
            if (roles.includes(selected) || roles.includes(this.state.roles.all)) {
                article.style.display = "block";
                articlesFound = true;
            } else {
                article.style.display = "none";
            }
        });

        if (articlesFound || articles.length === 0) {
            document.getElementById('no-content-warning').style.display = "none";
        } else {
            document.getElementById('no-content-warning').style.display = "block";
        }

    }
}

Menu.propTypes = {
    menu: React.PropTypes.shape({
        brandName: React.PropTypes.string,
        roles: React.PropTypes.object
    }).isRequired,
};

function loadMenu(menu = {}, element = 'presidium-navigation') {
    ReactDOM.render(<Menu menu = { menu } />, document.getElementById(element));
}

export {Menu, loadMenu};
