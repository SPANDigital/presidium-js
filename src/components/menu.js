import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuItem from './menu_item';
import paths from '../util/paths';

/**
 * A two level boostrap menu. Doesn't rely on bootstrap or jquery js.
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
                            <img src={paths.concat(menu.baseUrl, "media/images/logo.png")} alt="" />
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
                                    return <MenuItem
                                        key = { item.path }
                                        item = { item }
                                        baseUrl = { menu.baseUrl }
                                        isActive = { this.isActive(item.path) }
                                    />
                                })
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

    isActive(path) {
        if (this.props.menu.currentPage == "/") {
            return path == this.props.menu.currentPage
        } else {
            return path.startsWith(this.props.menu.currentPage);
        }

    }

    toggleExpand() {
        this.setState({expand: !this.state.expand})
    }
}

Menu.propTypes = {
    menu: React.PropTypes.shape({
        brandName: React.PropTypes.string,
        structure: React.PropTypes.array,
        baseUrl: React.PropTypes.string,
        currentPage: React.PropTypes.string
    }).isRequired,
};

function loadMenu(menu = {}, element = 'nav-container') {
    ReactDOM.render(<Menu menu = { menu } />, document.getElementById(element));
}

export {Menu, loadMenu};