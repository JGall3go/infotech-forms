from flask import Flask, request, render_template, session, url_for, redirect, send_file
from pymongo import MongoClient
import pymongo
import random
import os
import time
import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')

# Database
client = MongoClient('mongodb://localhost:27017/')
collection = client['InfoTechForms']

# Session vars
app.secret_key = "super secret key"


@app.route('/')
def principal():

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

    user = collection["Users"].find_one(
        {"username": username, "password": str(password)})

    if user:
        session["username"] = username
        return redirect(url_for("dashboard"))
    else:
        return redirect(url_for("login"))


@app.route("/dashboard/forms")
def forms():

    if "username" in session:

        return redirect(url_for("dashboard"))

    else:
        return redirect(url_for("login"))


@app.route('/dashboard')
def dashboard():

    if "username" in session:

        username = session["username"]
        user = collection["Users"].find_one({"username": username})
        forms_list = user["forms-list"]

        # Reports Vars
        forms_registered_today = 0
        forms_registered_all = 0
        forms_qty = 0
        form_logs = [0] * len(forms_list)

        all_months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'Octuber', 'November', 'December']
        current_months = []
        current_forms_by_months = []

        count = 0
        for month in all_months:

            count += 1
            if count <= datetime.date.today().month:
                current_months.append(month)
                current_forms_by_months.append(0)

        # current_months = [month for count, month in enumerate(all_months, 1) if count <= datetime.date.today().month]
        # Compression Lists

        # Find forms registered today
        all_form_titles = []
        for count, form in enumerate(forms_list):

            all_form_titles.append(forms_list[form]["title"])

            for log in forms_list[form]["logs"]:

                forms_qty += 1  # Qty of items found in search bar (in process)
                forms_registered_all += 1
                form_logs[count] += 1

                # Counter for every form registered today
                if log["date"].date().day == datetime.date.today().day:
                    forms_registered_today += 1

                # Counter for all forms registered every month
                if log["date"].date().month - 1 <= len(current_forms_by_months):
                    current_forms_by_months[log["date"].date().month-1] += 1

        # Get most used form
        most_used_form = 0
        past_item = 0
        for count, item in enumerate(form_logs):

            if item > past_item:
                most_used_form = count

        data = {
            "forms-list": forms_list,
            "forms-registered-today": forms_registered_today,
            "forms-registered-all": forms_registered_all,
            "most-used-form-title": all_form_titles[most_used_form],
            "most-used-form-reports": form_logs[most_used_form],
            "forms-qty": forms_qty,
            "current-months": current_months,
            "current-forms": current_forms_by_months
        }

        return render_template("dashboard.html", username=username, data=data)

    else:
        return redirect(url_for("login"))


@app.route('/dashboard/forms/<form>')
def dashboard_form(form):

    if "username" in session:

        username = session["username"]
        user = collection["Users"].find_one({"username": username})
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
        user = collection["Users"].find_one({"username": username})
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
            hora_inicial = request.form.get("hinicio")
            hora_final = request.form.get("hfinal")
            email = request.form.get("email")

            # Se extraen todas las imagenes, se guardan localmente y se almacenan en una variable de tipo lista
            evidencia = request.files.getlist("evidencia")
            imgs = []

            if len(evidencia) > 0:
                count = 0
                for file in evidencia:
                    if count < 9:
                        random_bits = random.getrandbits(128)
                        img_hash = "%032x" % random_bits
                        file.save(os.path.join(
                            "static/evidences/", f"{str(img_hash)}.png"))
                        imgs.append(img_hash)
                        count += 1

            satisfaccion = request.form.get("satisfaccion")
            tiempo_respuesta = request.form.get("tiempo_respuesta")
            calidad_tecnica = request.form.get("calidad_tecnica")
            calidad_humana = request.form.get("calidad_humana")

            # Updating DB
            new_log = {
                "date": datetime.datetime.now(),
                "author": nombre_ing,
                "email": email
            }

            current_log_list = forms_list[form]["logs"]
            current_log_list.append(new_log)

            log = { "$set": {f"forms-list.{form}.logs": current_log_list} }

            collection["Users"].update_one({"username": username}, log)

            return render_template('user_templates/Soporteti/acta-servicios.html', data=[fecha_servicio, nombre_ing, nombre_client, sede, nombre_user, tel, ticket, mservice, diagnostico, imgs, satisfaccion, tiempo_respuesta, calidad_tecnica, calidad_humana, hora_inicial, hora_final], username=username, form=form_name, form_download=True)

        else:

            return render_template(f"user_templates/{session['username']}/{form}=form.html", form=form_name)
    else:
        return redirect(url_for("login"))


@app.route('/documents/<path:filename>', methods=['GET', 'POST'])
def download(filename):
    path = f"documents\\{session['username']}\\{filename}.pdf"
    return send_file(path, as_attachment=True)

# Form Logs


@app.route("/dashboard/forms/<form>/logs")
def form_logs(form):

    username = session["username"]
    user = collection["Users"].find_one({"username": username})
    forms_list = user["forms-list"]
    form_title = forms_list[form]["title"]
    form_logs = forms_list[form]["logs"]

    log_list = []

    count = 0
    for log in form_logs:

        count += 1

        form_date = log["date"]
        form_author = log["author"]
        form_email = log["email"]
        hour = form_date.strftime("%H:%M:%S")

        log = {
            "num": count,
            "date": form_date.date(),
            "hour": hour,
            "author": form_author,
            "email": form_email
        }

        log_list.append(log)

    data = {
        "form-title": form_title,
        "logs": log_list,
        "total-logs": count
    }

    return render_template(f"form-logs.html", form="Acta de Servicios", data=data)


if __name__ == '__main__':

    app.run(debug=True, host="0.0.0.0")
