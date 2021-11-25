import React from "react";
import './loginForm.css';

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"wrapper text-center"}>
                <main className={"form-signin"}>
                    <h1 className={"h3 mb-3 fw-normal"}>
                        Please sign in with existing credentials or create new account
                    </h1>
                    <div className={"form-floating"}>
                        <input type={"login"} className={"form-control"} id={"floatingLogin"}
                               placeholder={"name@example.com"}/>
                        <label>Login</label>
                    </div>
                    <div className={"form-floating"}>
                        <input type={"password"} className={"form-control"} id={"floatingPassword"}
                               placeholder={"Password"}/>
                        <label>Password</label>
                    </div>
                    <button className={"w-100 btn btn-lg btn-primary"}>Sign in</button>
                </main>
            </div>
        )
    }
}