import React from "react";
import "./boardColumn.css"
import {Task} from "./Task";

export class BoardColumn extends React.Component {
    render() {
        return (
            <div className={"board-column"}>
                <label className={"form-label board-column-name"}>Column name</label>
                <div className={"board-column-content"}>
                    <Task/>
                </div>
            </div>
        )
    }
}