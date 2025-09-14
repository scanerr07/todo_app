from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Veritabanı bağlantı ayarları
# 'mssql+pyodbc://kullanici_adi:sifre@sunucu_adi/veritabani_adi?driver=ODBC+Driver+17+for+SQL+Server'
# Şifre '12345' olarak güncellendi.
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)


@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    output = [{'id': todo.id, 'title': todo.task, 'completed': todo.completed} for todo in todos]
    return jsonify({'todos': output})


from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Veritabanı bağlantı ayarları
# 'mssql+pyodbc://kullanici_adi:sifre@sunucu_adi/veritabani_adi?driver=ODBC+Driver+17+for+SQL+Server'
# Şifre '12345' olarak güncellendi.
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Todo(db.Model):
    _tablename_ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)


@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    output = [{'id': todo.id, 'task': todo.task, 'completed': todo.completed} for todo in todos]
    return jsonify({'todos': output})


@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()

    if not data or 'task' not in data or not data['task'].strip():
        return jsonify({'error': 'Task bilgisi eksik'}), 400
    task_text = data['task'].strip()
    new_todo = Todo(task=task_text, completed=data.get('completed', False))

    db.session.add(new_todo)
    db.session.commit()

    return jsonify({
        'task': new_todo.task,
        'id': new_todo.id,
        'completed': new_todo.completed

    }), 201


@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({'error': 'To-Do maddesi bulunamadı'}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'To-Do maddesi başarıyla silindi'})


@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({'error': 'To-Do maddesi bulunamadı'}), 404

    if 'task' in data:
        todo.task = data['task']

    if 'completed' in data:
        todo.completed = data["completed"]

    db.session.commit()

    return jsonify({
        'id': todo.id,
        'task': todo.task,
        'completed': todo.completed
    }), 200


with app.app_context():
    db.create_all()


if __name__ == '_main_':
    app.run(debug=True)
