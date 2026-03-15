from flask import Flask, request, render_template_string, session, redirect, url_for, abort
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = 'ikarus_secret_key_change_this'

ADMIN_USER = os.getenv('ADMIN_USER')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

LOGIN_FORM = '''
<!DOCTYPE html>
<html>
<head><title>IkarusIA Login</title></head>
<body>
  <h2>Acceso IkarusIA</h2>
  <form method="POST">
    Usuario: <input name="user" type="text"><br>
    Password: <input name="pass" type="password"><br>
    <button>Entrar</button>
  </form>
</body>
</html>
'''

@app.route('/', methods=['GET', 'POST'])
def login():
    if 'user' in session and session['user'] == ADMIN_USER:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        if request.form['user'] == ADMIN_USER and request.form['pass'] == ADMIN_PASSWORD:
            session['user'] = ADMIN_USER
            return redirect(url_for('dashboard'))
        return '<h2>Error de login</h2><a href="/">Volver</a>'
    
    return render_template_string(LOGIN_FORM)

@app.route('/dashboard')
def dashboard():
    if 'user' not in session or session['user'] != ADMIN_USER:
        abort(401)
    return '''
    <h1>Bienvenido a IkarusIA</h1>
    <p>Dashboard protegido.</p>
    <a href="/logout">Salir</a>
    <iframe src="/index.html" width="100%" height="600px"></iframe>
    '''

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
