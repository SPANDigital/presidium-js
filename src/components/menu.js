import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Menu extends Component {

    path(target) {
        return this.props.baseurl + target;
    }

    isActive(path) {
        return this.props.pageurl == path ? "active" : "";
    }
    render() {
        return (
            //TODO Break up into components and generate dynamically
            <nav className="navbar navbar-default navbar-fixed-side">

                <div className="container">
                    <div className="navbar-header">
                        <a href="./" className="navbar-brand">
                            <img src={this.path("/media/images/logo.png")} alt="" />
                        </a>

                        <button className="navbar-toggle" data-target=".navbar-collapse" data-toggle="collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>

                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className={this.isActive("/")}>
                                <a href={ this.path("/") }>Overview</a>
                            </li>
                            <li className={this.isActive("/key-concepts/")}>
                                <a href={ this.path("/key-concepts/") }>Key Concepts</a>
                            </li>
                            <li className={this.isActive("/prerequisites/")}>
                                <a href={ this.path("/prerequisites/")}>Prerequisites</a>
                            </li>
                            <li className={this.isActive("/getting-started/")}>
                                <a href={ this.path("/getting-started/")}>Getting started</a>
                            </li>
                            <li>
                                <a href={ this.path("/references")}>Reference</a>
                            </li>
                            <li>
                                <a href={ this.path("/cookbook")}>Cookbook</a>
                            </li>
                            <li>
                                <a href={ this.path("/tools")}>Tools</a>
                            </li>
                            <li>
                                <a href={ this.path("/testing")}>Testing & Debugging</a>
                            </li>
                            <li>
                                <a href={ this.path("/updates")}>Updates</a>
                            </li>

                            <li className="dropdown">
                                <a className="dropdown-toggle" data-toggle="dropdown" href="#">References <b className="caret" /></a>
                                <ul className="dropdown-menu"><li><a href="#">Sub-page 1</a></li>
                                    <li><a href="#">Sub-page 2</a></li>
                                    <li className="divider" />
                                    <li className="dropdown-header">Sub Header</li>
                                    <li><a href="#">Sub-page 3</a></li>
                                </ul>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
        )
    }

}

function loadMenu(baseurl = "/", pageurl = "/", element = 'nav-container') {
    ReactDOM.render(<Menu baseurl={ baseurl } pageurl = { pageurl }/>, document.getElementById(element));
}

export {Menu, loadMenu};