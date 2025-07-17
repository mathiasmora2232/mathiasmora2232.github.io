def cargar_usuarios():
    with open(USERS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Ajusta la ruta del archivo para que funcione desde cualquier ubicación
USERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'usuarios.json')

# Guardar datos de usuario en el servidor
@app.route('/guardar_datos_usuario', methods=['POST'])
def guardar_datos_usuario():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    datos = data.get('datos')
    if not username or not email or not datos:
        return jsonify({'success': False, 'message': 'Datos incompletos'}), 400
    datos_file = os.path.join(os.path.dirname(__file__), '..', 'datosusers.json')
    # Leer datos existentes
    if os.path.exists(datos_file):
        with open(datos_file, 'r', encoding='utf-8') as f:
            try:
                all_data = json.load(f)
            except Exception:
                all_data = {}
    else:
        all_data = {}
    # Guardar bajo clave única
    key = f'{username}_{email}'
    all_data[key] = datos
    with open(datos_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    return jsonify({'success': True})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    usuarios = cargar_usuarios()
    for usuario in usuarios:
        if usuario['email'] == email and usuario['password'] == password:
            return jsonify({
                'success': True,
                'rol': usuario.get('rol', 'user'),
                'username': usuario.get('username', ''),
                'email': usuario['email']
            })
    return jsonify({'success': False, 'message': 'Credenciales incorrectas'})

if __name__ == '__main__':
    app.run(debug=True)
