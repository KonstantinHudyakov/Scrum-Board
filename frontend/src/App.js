import React from "react";
import {LoginForm} from "./components/login/LoginForm";
import {Board} from "./components/board/Board";

export const SERVER_URL = process.env.REACT_APP_SERVER_URL

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKey: null,
            userId: null
        }
    }

    render() {
        if (this.state.apiKey == null || this.state.userId == null) {
            return <LoginForm setApiKey={key => this.setState({apiKey: key})}
                              setUserId={id => this.setState({userId: id})}
                              getDefaultHeaders={() => this.getDefaultHeaders()}/>
        } else {
            return <Board onLogout={() => this.handleLogout()}
                          getDefaultHeaders={() => this.getDefaultHeaders()}/>
        }
    }

    handleLogout() {
        this.setState({
            apiKey: null,
            userId: null
        })
    }

    getDefaultHeaders() {
        return new Headers({
            "Content-Type": "application/json",
            "X-Auth": this.state.apiKey
        })
    }
}
