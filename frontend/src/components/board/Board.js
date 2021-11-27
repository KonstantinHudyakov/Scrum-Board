import React from "react";
import './board.css'
import {BoardColumn} from "./BoardColumn";

export class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskTitle: ""
        }
    }

    render() {
        return (
            <div className={"board-wrapper"}>
                {this.renderHeader()}
                <div className={"board-columns-container"}>
                    <BoardColumn/>
                </div>
            </div>
        )
    }

    renderHeader() {
        return (
            <div className="board-header" id="board-header">
                <label className="form-label board-header-label">Scrum Board</label>
                <div className="board-header-add-input">
                    <input className="form-control add-task" value={this.state.taskTitle} placeholder="Title..."
                           type={"title"}
                           onChange={(event) => this.setState({taskTitle: event.target.value})}/>
                    <button className={"btn btn-primary add-task"}>Add Task</button>
                </div>
            </div>
        )
    }
}