from flask import Blueprint, abort, Response, request
import hashlib
import uuid
import json
from datetime import datetime, timedelta
from psycopg2.errorcodes import UNIQUE_VIOLATION
from psycopg2 import errors

from backend.db import get_cursor
from backend.util import conflict_response

user_blueprint = Blueprint("user", __name__)


@user_blueprint.route("/login", methods=["PUT"])
def try_register():
    login = request.json["login"]
    password = request.json["password"]
    if not (0 < len(login) <= 50):
        return conflict_response("Login too long or empty")
    if not (0 < len(password) <= 50):
        return conflict_response("Password too long or empty")
    salt, pass_hash = hash_password(password)
    api_key, expired = create_api_key()
    try:
        with get_cursor() as cursor:
            cursor.execute("insert into users(login, password, salt) VALUES (%s, %s, %s) returning id",
                           [login, pass_hash, salt])
            user_id = cursor.fetchone()[0]
            cursor.execute("insert into sessions(id, api_key, expired) VALUES (%s, %s, %s)",
                           [user_id, api_key, expired])
    except errors.lookup(UNIQUE_VIOLATION):
        return conflict_response("User already registered")
    return logged_in_response(user_id, api_key)


@user_blueprint.route("/login", methods=["POST"])
def try_login():
    login = request.json["login"]
    password = request.json["password"]
    with get_cursor() as cursor:
        cursor.execute("select password, salt, id from users where login = %s", [login])
        res = cursor.fetchone()
    if res is None:
        abort(404)
    if not check_password(password, hash=res[0], salt=res[1]):
        return conflict_response("Password do not match")
    user_id = res[2]
    api_key, expired = create_api_key()
    with get_cursor() as cursor:
        cursor.execute("update sessions set api_key = %s, expired = %s where id = %s", [api_key, expired, user_id])
    return logged_in_response(user_id, api_key)


def hash_password(password: str) -> (str, str):
    salt = uuid.uuid4().hex
    salted_pass = (password + salt).encode("utf-8")
    pass_hash = hashlib.sha256(salted_pass).hexdigest()
    return salt, pass_hash


def check_password(password, hash, salt) -> bool:
    cur_salted_pass = (password + salt).encode("utf-8")
    cur_hash = hashlib.sha256(cur_salted_pass).hexdigest()
    return cur_hash == hash


def create_api_key() -> (str, datetime):
    api_key = uuid.uuid4().hex
    expired = datetime.now() + timedelta(days=1)
    return api_key, expired


def logged_in_response(user_id: int, api_key: str) -> Response:
    response = Response(json.dumps({"id": user_id}), status=200, mimetype="application/json")
    response.headers["X-Auth"] = api_key
    return response