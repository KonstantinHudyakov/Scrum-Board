import React from "react";
import './board.css'
import {BoardColumn} from "./BoardColumn";
import {SERVER_URL} from "../../App";
import {createError} from "../../util";

export class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newTaskTitle: "",
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

    handleTaskAdd() {
        if (!this.checkTitle()) return
        const task = {
            title: this.state.newTaskTitle,
            creator_id: this.props.userId,
            board_id: this.state.boards[0].id
        }
        this.createTask(task)
    }

    createTask(task) {
        const request = new Request(`${SERVER_URL}/task`, {
            method: "PUT",
            headers: this.props.getDefaultHeaders(),
            body: JSON.stringify(task)
        })
        fetch(request).then(response => {
            this.setState({newTaskTitle: ""})
            if (response.status === 400) {
                throw createError(request, response, "Bad request")
            } else if (response.status === 403) {
                this.props.onLogout()
            } else if (response.status === 409) {
                response.text().then(errorText => {
                    if (errorText === "Title too long or empty") {
                        alert(errorText)
                    } else {
                        throw createError(request, response, errorText)
                    }
                })
            } else if (!response.ok) {
                throw createError(request, response)
            } else {
                response.json().then(data => {
                    task.id = data.id
                    task.creator = this.props.userName
                    const tasks = this.state.tasks
                    tasks.push(task)
                    this.setState({tasks: tasks})
                })
            }
        }).catch(error => console.log(error))
    }

    checkTitle() {
        const title = this.state.newTaskTitle
        let everythingOk = true
        if (title.length === 0) {
            alert("Please specify your title for new task")
            everythingOk = false
        } else if (title.length > 150) {
            alert("Title is too long")
            everythingOk = false
        }
        return everythingOk
    }

    handleTaskDelete(id) {
        const request = new Request(`${SERVER_URL}/task/${id}`, {
            method: "DELETE",
            headers: this.props.getDefaultHeaders()
        })
        fetch(request).then(response => {
            if (response.status === 400) {
                throw createError(request, response, "Bad request")
            } else if (response.status === 403) {
                this.props.onLogout()
            } else if (!response.ok) {
                throw createError(request, response)
            } else {
                const tasks = this.state.tasks.filter(task => task.id !== id)
                this.setState({tasks: tasks})
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
                                              otherBoards={otherBoards}
                                              onTaskDelete={taskId => this.handleTaskDelete(taskId)}/>)
        }
        return boardComponents
    }

    renderHeader() {
        return (
            <div className="board-header" id="board-header">
                <label className="form-label board-header-label">Scrum Board</label>
                <div className="board-header-add-input">
                    <input className="form-control add-task" value={this.state.newTaskTitle} placeholder="Title..."
                           type={"title"}
                           onChange={(event) => this.setState({newTaskTitle: event.target.value})}/>
                    <button className={"btn btn-primary add-task"}
                            onClick={() => this.handleTaskAdd()}>Add Task
                    </button>
                </div>
            </div>
        )
    }
}