import React from "react";
import "./task.css"

export class Task extends React.Component {
    render() {
        return (
            <div className={"task"}>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <h5 className={"card-title"}>{this.props.title}</h5>
                        <h3 className={"card-subtitle mb-2 text-muted"}>{this.props.creator}</h3>
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
                        id={`moveButton${this.props.taskId}`} data-bs-toggle={"dropdown"} aria-expanded={"false"}>Move
                </button>
                <ul className={"dropdown-menu"} aria-labelledby={`moveButton${this.props.taskId}`}>
                    {this.renderBoardItems()}
                </ul>
            </div>
        )
    }

    renderBoardItems() {
        const items = []
        for (let board of this.props.otherBoards) {
            items.push(<li key={board.id}><a className={"dropdown-item"}>{board.name}</a></li>)
        }
        return items
    }
}