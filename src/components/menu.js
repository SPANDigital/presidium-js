import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Menu extends Component {

    render() {
        return (
            <nav id="sidenav">
                <h2>DOCUMENTATION</h2>
                <ul className="nav">
                    <li>
                        <a href="/#overview">Overview</a>
                    </li>
                    <li>
                        <a href="/key-concepts#key-concepts">Key Concepts</a>
                    </li>
                    <li>
                        <a href="/prerequisites#prerequisites">Prerequisites</a>
                    </li>
                    <li>
                        <a href="/getting-started#getting-started">Getting started</a>
                    </li>
                    <li>
                        <a href="/references#reference">Reference</a>
                    </li>
                    <li>
                        <a href="/cookbook#cookbook">Cookbook</a>
                    </li>
                    <li>
                        <a href="/tools#tools">Tools</a>
                    </li>
                    <li>
                        <a href="/testing#testing-debugging">Testing & Debugging</a>
                    </li>
                    <li>
                        <a href="/updates#updates">Updates</a>
                    </li>
                </ul>
            </nav>
        )
    }
}

function loadMenu(element = 'nav-container') {
    ReactDOM.render(<Menu/>, document.getElementById(element));
}

export {Menu, loadMenu};