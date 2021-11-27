import React from "react";
import './board.css'
import {BoardColumn} from "./BoardColumn";
import {SERVER_URL} from "../../App";
import {createError} from "../../util";

export class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskTitle: "",
            boards: [],
            tasks: []
        }
    }

    componentDidMount() {
        this.fetchAndSetState("boards", "board")
        this.fetchAndSetState("tasks", "task")
    }

    fetchAndSetState(stateVariable, endpoint) {
        const request = new Request(`${SERVER_URL}/${endpoint}`, {
            method: "GET",
            headers: this.props.getDefaultHeaders()
        })
        fetch(request).then(response => {
            if (response.status === 403) {
                this.props.onLogout()
            } else if (!response.ok) {
                throw createError(request, response, "Unexpected error")
            } else {
                response.json().then(data => {
                    this.setState({[stateVariable]: data})
                }).catch(error => console.log(error))
            }
        }).catch(error => console.log(error))
    }

    render() {
        return (
            <div className={"board-wrapper"}>
                {this.renderHeader()}
                <div className={"board-columns-container"}>
                    {this.renderColumns()}
                </div>
            </div>
        )
    }

    renderColumns() {
        const boardComponents = []
        for (let board of this.state.boards) {
            const tasks = this.state.tasks.filter(task => task.board_id === board.id)
            const otherBoards = this.state.boards.filter(b => b.id !== board.id)
            boardComponents.push(<BoardColumn key={board.id} boardId={board.id} boardName={board.name} tasks={tasks}
                                              otherBoards={otherBoards}/>)
        }
        return boardComponents
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