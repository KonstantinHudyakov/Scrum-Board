import React from "react";
import "./boardColumn.css"
import {Task} from "./Task";

export class BoardColumn extends React.Component {
    render() {
        return (
            <div className={"board-column"}>
                <label className={"form-label board-column-name"}>{this.props.boardName}</label>
                <div className={"board-column-content"}>
                    {this.renderTasks()}
                </div>
            </div>
        )
    }

    renderTasks() {
        const tasksComponents = []
        for (let task of this.props.tasks) {
            tasksComponents.push(<Task key={task.id} taskId={task.id} title={task.title} creator={task.creator}
                                       otherBoards={this.props.otherBoards}
                                       onTaskDelete={() => this.props.onTaskDelete(task.id)}
                                       onTaskMove={(newBoardId => this.props.onTaskMove(task.id, newBoardId))}/>)
        }
        return tasksComponents
    }
}