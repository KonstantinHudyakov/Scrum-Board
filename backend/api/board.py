from flask import Blueprint, abort, Response, request
import json

from backend.db import get_cursor
from backend.util import conflict_response, check_authenticated, created_id_response


class Board:
    def __init__(self, id: int, name: str) -> None:
        self.id = id
        self.name = name


board_blueprint = Blueprint("board", __name__)


@board_blueprint.route("/board", methods=["GET"])
def get_all():
    check_authenticated()
    with get_cursor() as cursor:
        cursor.execute("select id, name from boards")
        res = cursor.fetchall()
    if res is not None:
        json_str = json.dumps([Board(id=row[0], name=row[1]).__dict__ for row in res])
        return Response(json_str, status=200, mimetype="application/json")
    else:
        abort(500)


@board_blueprint.route("/board/<id>", methods=["GET"])
def get(id):
    check_authenticated()
    try:
        id = int(id)
    except ValueError:
        abort(400)
    with get_cursor() as cursor:
        cursor.execute("select name from boards where id=%s", [id])
        res = cursor.fetchone()
    if res is not None:
        json_str = json.dumps(Board(id=id, name=res[0]).__dict__)
        return Response(json_str, status=200, mimetype="application/json")
    else:
        abort(404)


@board_blueprint.route("/board", methods=["PUT"])
def create():
    check_authenticated()
    name = request.json["name"]
    if not (0 < len(name) <= 50):
        return conflict_response("Name too long or empty")
    with get_cursor() as cursor:
        cursor.execute("insert into boards(name) values (%s) returning id", [name])
        id = cursor.fetchone()[0]
    return created_id_response(id)


@board_blueprint.route("/board/<id>", methods=["DELETE"])
def delete(id):
    check_authenticated()
    try:
        id = int(id)
    except ValueError:
        abort(400)
    with get_cursor() as cursor:
        cursor.execute("delete from boards where id=%s", [id])
    return Response(status=200)
