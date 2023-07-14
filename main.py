from flask import Flask, request, render_template
import random
import os

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

    return render_template('acta-servicios.html', data=[fecha_servicio, nombre_ing, nombre_client, sede, nombre_user, tel, ticket, mservice, diagnostico, imgs])

if __name__ == '__main__':
    app.run(debug = True)