import React from "react";
import {LoginForm} from "./components/login/LoginForm";
import {Board} from "./components/board/Board";

export const SERVER_URL = process.env.REACT_APP_SERVER_URL

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                apiKey: null,
                id: null,
                login: null
            }
        }
    }

    render() {
        if (this.state.user.apiKey == null) {
            return <LoginForm setUser={user => this.setState({user: user})}
                              getDefaultHeaders={() => this.getDefaultHeaders()}/>
        } else {
            return <Board userId={this.state.user.id} userName={this.state.user.login}
                          onLogout={() => this.handleLogout()}
                          getDefaultHeaders={() => this.getDefaultHeaders()}/>
        }
    }

    handleLogout() {
        this.setState({user: null})
    }

    getDefaultHeaders() {
        return new Headers({
            "Content-Type": "application/json",
            "X-Auth": this.state.user.apiKey
        })
    }
}
