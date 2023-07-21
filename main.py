from flask import Flask, request, render_template, session, url_for, redirect, send_file
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

    if "username" in session:

        return redirect(url_for("dashboard"))
    
    else:
        return redirect(url_for("login"))

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
        return redirect(url_for("dashboard"))
    else:
        return redirect(url_for("login"))

@app.route('/dashboard')
def dashboard():

    if "username" in session:

        username = session["username"]
        user = db["Users"].find_one({"username": username})
        forms_list = user["forms-list"]

        return render_template("dashboard.html", username=username, forms_list=forms_list)
    
    else:
        return redirect(url_for("login"))

@app.route('/dashboard/forms/<form>')
def dashboard_form(form):

    if "username" in session:

        username = session["username"]
        user = db["Users"].find_one({"username": username})
        forms_list = user["forms-list"]
        form_name = forms_list[form]

        if form in forms_list:

            return render_template(f'user_templates/{username}/{form}.html', data="", username=username, form=form_name, form_download=False)
        
        else:

            return "No tienes permiso para ver este formulario!!"
    
    else:
        return redirect(url_for("login"))

@app.route('/log-out')
def log_out():

    session.pop("username", None)

    return redirect(url_for("login"))

# FORMS

@app.route("/dashboard/forms/<form>/post", methods=['GET', 'POST'])
def form_filling(form):

    if "username" in session:

        username = session["username"]
        user = db["Users"].find_one({"username": username})
        forms_list = user["forms-list"]
        form_name = forms_list[form]

        if request.method == 'POST':

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

            return render_template('user_templates/Soporteti/acta-servicios.html', data=[fecha_servicio, nombre_ing, nombre_client, sede, nombre_user, tel, ticket, mservice, diagnostico, imgs, satisfaccion, tiempo_respuesta, calidad_tecnica, calidad_humana], username=username, form=form_name, form_download=True)

        else:

            return render_template(f"user_templates/{session['username']}/{form}=form.html", form=form_name)
    else:
        return redirect(url_for("login"))

@app.route('/uploads/<path:filename>', methods=['GET', 'POST'])
def download(filename):
    path = "uploads/user.jpg"
    return send_file(path, as_attachment=True)

if __name__ == '__main__':

    app.run(debug = True, host="0.0.0.0")