from flask import Blueprint, abort, Response, request
import json
from psycopg2.errorcodes import FOREIGN_KEY_VIOLATION
from psycopg2 import errors

from backend.db import get_cursor
from backend.util import conflict_response, check_authenticated, created_id_response


class Task:
    def __init__(self, id: int, title: str, creator_id: int, creator: str, board_id: int) -> None:
        self.id = id
        self.title = title
        self.creator_id = creator_id
        self.creator = creator
        self.board_id = board_id


task_blueprint = Blueprint("task", __name__)


@task_blueprint.route("/task", methods=["GET"])
def get_all():
    check_authenticated()
    with get_cursor() as cursor:
        cursor.execute("select tasks.id, tasks.title, users.id, users.login, tasks.board_id from tasks "
                       "inner join boards on boards.id = tasks.board_id "
                       "inner join users on users.id = tasks.creator_id")
        res = cursor.fetchall()
    if res is not None:
        json_str = json.dumps([Task(id=row[0], title=row[1], creator_id=row[2],
                                    creator=row[3], board_id=row[4]).__dict__ for row in res])
        return Response(json_str, status=200, mimetype="application/json")
    else:
        abort(500)


@task_blueprint.route("/task/<id>", methods=["GET"])
def get(id):
    check_authenticated()
    try:
        id = int(id)
    except ValueError:
        abort(400)
    with get_cursor() as cursor:
        cursor.execute("select tasks.id, tasks.title, users.id, users.login, tasks.board_id from tasks "
                       "inner join boards on boards.id = tasks.board_id "
                       "inner join users on users.id = tasks.creator_id "
                       "where tasks.id=%s", [id])
        res = cursor.fetchone()
    if res is not None:
        json_str = json.dumps(Task(id=id, title=res[1], creator_id=res[2], creator=res[3], board_id=res[4]).__dict__)
        return Response(json_str, status=200, mimetype="application/json")
    else:
        abort(404)


@task_blueprint.route("/task", methods=["PUT"])
def create():
    check_authenticated()
    title = request.json["title"]
    creator_id = request.json["creator_id"]
    board_id = request.json["board_id"]
    try:
        creator_id = int(creator_id)
        board_id = int(board_id)
    except ValueError:
        abort(400)
    if not (0 < len(title) <= 150):
        return conflict_response("Title too long or empty")
    try:
        with get_cursor() as cursor:
            cursor.execute("insert into tasks(title, creator_id, board_id) VALUES (%s, %s, %s) returning id",
                           [title, creator_id, board_id])
            id = cursor.fetchone()[0]
    except errors.lookup(FOREIGN_KEY_VIOLATION):
        return conflict_response("Unknown creator_id or board_id")
    return created_id_response(id)


@task_blueprint.route("/task/<id>", methods=["DELETE"])
def delete(id):
    check_authenticated()
    try:
        id = int(id)
    except ValueError:
        abort(400)
    with get_cursor() as cursor:
        cursor.execute("delete from tasks where id=%s", [id])
    return Response(status=200)
