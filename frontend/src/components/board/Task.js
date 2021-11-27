import React from "react";
import "./task.css"

export class Task extends React.Component {
    render() {
        return (
            <div className={"task"}>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <h5 className={"card-title"}>Task title</h5>
                        <h3 className={"card-subtitle mb-2 text-muted"}>CreatorName</h3>
                        {this.renderMoveButton()}
                        <button className={"btn btn-danger"}>Delete</button>
                    </div>
                </div>
            </div>
        )
    }

    renderMoveButton() {
        return (
            <div className={"dropdown"}>
                <button className={"btn btn-primary dropdown-toggle"} type={"button"}
                        id={"dropdownMenuButton1"} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Move
                </button>
                <ul className={"dropdown-menu"} aria-labelledby={"dropdownMenuButton1"}>
                    <li><a className={"dropdown-item"}>Action</a></li>
                    <li><a className={"dropdown-item"}>Another action</a></li>
                    <li><a className={"dropdown-item"}>Something else here</a></li>
                </ul>
            </div>
        )
    }
}