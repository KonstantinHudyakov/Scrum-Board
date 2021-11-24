import json

from flask import Response, request, abort
from datetime import datetime

from backend.db import get_cursor


def check_authenticated():
    api_key = request.headers.get("X-Auth")
    if api_key is None:
        abort(403)
    with get_cursor() as cursor:
        cursor.execute("select expired from sessions where api_key = %s", [api_key])
    res = cursor.fetchone()
    if res is None or datetime.now() > res[0]:
        abort(403)


def conflict_response(text: str) -> Response:
    return Response(text, status=409, mimetype="text/plain")


def created_id_response(id):
    return Response(json.dumps({"id": id}), status=200, mimetype="application/json")
