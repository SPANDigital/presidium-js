import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuItem from './menu-item';
import paths from '../../util/paths';
import {groupByCategory} from './menu-structure';
import { Router, Route, Link } from 'react-router';

const FILTER_SELECTED_RECORD = "filter.selected";

/**
 * A two level boostrap menu. Doesn't rely on bootstrap.js or jquery js.
 */
class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            structure: this.menuStructure(),
            filter: this.menuFilter(),
            expanded: false,
        };
        this.toggleArticles(this.state.filter.selected);
    }

    menuStructure() {
        var all = this.props.menu.filter.all;
        return this.props.menu.structure.map(section => groupByCategory(section, all));
    }

    menuFilter() {
        var selected;
        var filter = this.props.menu.filter;
        if (filter.options.length > 0) {
            selected = sessionStorage.getItem(FILTER_SELECTED_RECORD);
            if (!selected) {
                selected = filter.all;
                sessionStorage.setItem(FILTER_SELECTED_RECORD, selected);
            }
        }
        return {
            label: filter.label,
            all: filter.all,
            selected: selected,
            options: [filter.all, ...filter.options]
        }
    }

    render() {
        const menu = this.props.menu;
        return (
            <nav>
                <div className="navbar-header">
                    <a href={ this.props.menu.baseUrl != null ? this.props.menu.baseUrl : "#"} className="brand">
                        <img src={paths.concat(menu.baseUrl, menu.logo)} alt="" />
                    </a>
                    { this.props.menu.brandName &&
                    <p className="brand-name">{ this.props.menu.brandName }</p>
                    }
                    <button className="toggle" onClick={() => this.toggleExpand()}>
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
                            this.state.structure.map(item => {
                                return <MenuItem key={ item.id } item={ item } filter = { this.state.filter } onNavigate={ () => this.toggleExpand() } />
                            })
                        }
                    </ul>
                </div>
            </nav>
        )
    }

    toggleExpand() {
        this.setState({expanded: !this.state.expanded})
    }

    renderFilter() {
        return this.state.filter.selected && (
            <div className="filter form-group">
                {this.state.filter.label && <label className="control-label" htmlFor="filter-select">{this.state.filter.label}:</label>}
                <select id="filter-select" className="form-control" value={ this.state.filter.selected } onChange={(e) => this.onFilter(e)}>
                    {this.state.filter.options.map(filter => {
                        return <option key={ filter } value={ filter }>{ filter }</option>
                    })}
                </select>
            </div>)
    }

    onFilter(e) {
        var selected = e.target.value;
        const filter = Object.assign({}, this.state.filter, {selected : selected});
        this.toggleArticles(selected);
        this.setState({ filter : filter});
        sessionStorage.setItem('filter.selected', selected);
    }

    toggleArticles(selected) {
        document.querySelectorAll('#presidium-content .article').forEach(article => {
            if (selected == this.state.filter.all) {
                article.style.display = "block";
                return;
            }
            const filter = article.getAttribute('data-filter').split(",");
            if (filter.includes(selected) || filter.includes(this.state.filter.all)) {
                article.style.display = "block";
            } else {
                article.style.display = "none";
            }
        });
    }
}

Menu.propTypes = {
    menu: React.PropTypes.shape({
        brandName: React.PropTypes.string,
        structure: React.PropTypes.array,
    }).isRequired,
};

function loadMenu(menu = {}, element = 'presidium-navigation') {
    ReactDOM.render(<Menu menu = { menu } />, document.getElementById(element));
}

export {Menu, loadMenu};