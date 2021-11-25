import React from "react";
import {LoginForm} from "./components/login/LoginForm";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {apiKey: null}
    }

    render() {
        if (this.state.apiKey == null) {
            return <LoginForm setApiKey={key => this.setState({apiKey: key})}/>
        }
    }
}
