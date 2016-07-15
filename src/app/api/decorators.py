from functools import wraps

from flask import request, redirect

def make_ajax(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_xhr: return redirect('/#{}'.format(request.path))
        return f(*args, **kwargs)
    return decorated_function


"""
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function
"""