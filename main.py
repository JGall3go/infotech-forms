from flask import Flask, request, render_template, session, url_for, redirect
from pymongo import MongoClient
import random
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

# Database
client = MongoClient('mongodb://localhost:27017/') 
db = client['InfoTechForms']

# Session vars
app.secret_key = "super secret key"

@app.route('/')
def hello():
    return render_template('forms.html')

@app.post('/acta-servicios')
def acta_servicios():

    fecha_servicio = request.form.get("fservicio")
    nombre_ing = request.form.get("ning")
    nombre_client = request.form.get("nclient")
    sede = request.form.get("sede")
    nombre_user = request.form.get("nuser")
    tel = request.form.get("tel")
    ticket = request.form.get("ticket")
    mservice = request.form.get("mservice")
    diagnostico = request.form.get("diagnostico")
    
    # Se extraen todas las imagenes, se guardan localmente y se almacenan en una variable de tipo lista
    evidencia = request.files.getlist("evidencia")
    imgs = []

    if len(evidencia) > 0:
        count = 0
        for file in evidencia:
            if count < 9:
                random_bits = random.getrandbits(128)
                img_hash = "%032x" % random_bits
                file.save(os.path.join("static/evidences/", f"{str(img_hash)}.png"))
                imgs.append(img_hash)
                count+=1

    satisfaccion = request.form.get("satisfaccion")
    tiempo_respuesta = request.form.get("tiempo_respuesta")
    calidad_tecnica = request.form.get("calidad_tecnica")
    calidad_humana = request.form.get("calidad_humana")

    return render_template('acta-servicios.html', data=[fecha_servicio, nombre_ing, nombre_client, sede, nombre_user, tel, ticket, mservice, diagnostico, imgs, satisfaccion, tiempo_respuesta, calidad_tecnica, calidad_humana])

@app.route('/login')
def login():

    return render_template('login.html')

@app.post('/login')
def login_post():

    username = request.form.get("username")
    password = request.form.get("password")

    user = db["Users"].find_one({"username": username, "password": str(password)})

    if user:
        session["username"] = username
        return redirect(url_for("control_panel"))
    else:
        return redirect(url_for("login"))

@app.route('/control-panel')
def control_panel():

    if "username" in session:

        username = session["username"]
        return render_template("control-panel.html", username=username)
    
    else:
        return redirect(url_for("login"))

if __name__ == '__main__':

    app.run(debug = True, host="0.0.0.0")