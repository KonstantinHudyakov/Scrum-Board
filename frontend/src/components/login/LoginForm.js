import React from "react";
import './loginForm.css';
import {SERVER_URL} from "../../App.js"
import {createError} from "../../util";

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: ""
        }
    }

    handleCreateNewAccount() {
        if (!this.checkCredentials()) return
        const request = this.createAuthRequest("PUT")
        const login = this.state.login
        fetch(request).then(response => {
            if (response.status === 400) {
                throw createError(request, response, "Bad request")
            } else if (response.status === 409) {
                response.text().then(errorText => alert(errorText))
            } else if (response.ok) {
                this.handleAuthSuccess(request, response, login)
            }
        }).catch(error => console.log(error))
    }

    handleSignIn() {
        if (!this.checkCredentials()) return
        const request = this.createAuthRequest("POST")
        const login = this.state.login
        fetch(request).then(response => {
            if (response.status === 400) {
                throw createError(request, response, "Bad request")
            } else if (response.status === 404) {
                alert("Not found user with provided login")
            } else if (response.status === 409) {
                alert("Password do not match")
            } else if (response.ok) {
                this.handleAuthSuccess(request, response, login)
            }
        })
    }

    handleAuthSuccess(request, response, login) {
        const apiKey = response.headers.get("X-Auth")
        if (!apiKey) throw createError(request, response, "Not found api key in response")
        response.json().then(data => {
            const userId = data.id
            if (!userId || userId !== parseInt(userId, 10)) {
                throw createError(request, response, "Invalid created user id")
            }
            this.props.setUser({
                apiKey: apiKey,
                id: userId,
                login: login
            })
        }).catch(error => console.log(error))
    }

    createAuthRequest(method) {
        return new Request(`${SERVER_URL}/login`, {
            method: method,
            headers: this.props.getDefaultHeaders(),
            body: JSON.stringify({
                "login": this.state.login,
                "password": this.state.password
            })
        })
    }

    checkCredentials() {
        const {login, password} = this.state
        return this.checkStringField(login, "login") && this.checkStringField(password, "password")
    }

    checkStringField(fieldValue, fieldName) {
        let everythingOk = true
        if (fieldValue.length === 0) {
            alert(`Please specify your ${fieldName}`)
            everythingOk = false
        } else if (fieldValue.length > 50) {
            alert(`Your ${fieldName} is too long`)
            everythingOk = false
        }
        return everythingOk
    }

    render() {
        return (
            <div className={"wrapper text-center"}>
                <main className={"form-signin"}>
                    <h1 className={"h3 mb-3 fw-normal"}>
                        Please sign in with existing credentials or create new account
                    </h1>

                    <div className={"form-floating"}>
                        <input value={this.state.login} onChange={event => this.setState({login: event.target.value})}
                               type={"login"} className={"form-control"} id={"floatingLogin"}/>
                        <label>Login</label>
                    </div>
                    <div className={"form-floating"}>
                        <input value={this.state.password}
                               onChange={event => this.setState({password: event.target.value})}
                               type={"password"} className={"form-control"} id={"floatingPassword"}/>
                        <label>Password</label>
                    </div>

                    <button onClick={() => this.handleSignIn()}
                            className={"w-100 btn btn-lg btn-primary sign-in"}>Sign in
                    </button>
                    <button onClick={() => this.handleCreateNewAccount()}
                            className={"w-100 btn btn-lg btn-secondary create-new"}>Create new account
                    </button>
                </main>
            </div>
        )
    }
}