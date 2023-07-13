from flask import Flask, request, render_template
import random


app = Flask(__name__, template_folder='templates', static_folder='static')

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
    
    evidencia = request.files['evidencia']
    if evidencia.filename != '':

        random_bits = random.getrandbits(128)
        img_hash = "%032x" % random_bits
        evidencia.save(str(img_hash) + ".png")

    return render_template('acta-servicios.html', data=[fecha_servicio, nombre_ing, nombre_client, sede, nombre_user, tel, ticket, mservice, diagnostico, img_hash])