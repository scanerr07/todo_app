const divCompleted = document.getElementById("completedTodos");
const API_URL = "http://127.0.0.1:5000/todos/completed";

let completedTodos = [];

//Listeyi Ekrana Basma

function listCompleted(){
    divCompleted.innerHTML ="";

    if (completedTodos.length === 0){
        divCompleted.innerHTML = "<p> Henüz Tamamlanan Görev Yok. Hadi Bir Şeyler Tamamla!</p>";
        return;
    }

    for (const todo of completedTodos){
        let div = document.createElement("div");

        //yazı
        let span = document.createElement("span");
        span.textContent = todo.title;
        span.classList.add("completed");
        div.append(span);

        // Geri AL Butonu
        let undoBtn = document.createElement("button");
        undoBtn.textContent ="↩ Geri Al";
        undoBtn.onclick = () => undoTodo(todo);
        div.append(undoBtn);


        //Sil butonu
        let delBtn = document.createElement("button");
        delBtn.textContent = "🗑 Sil";
        delBtn.onclick = () => deleteTodo(todo);
        div.append(delBtn);

        divCompleted.append(div);
    }

    //İstatistik Ekle
    let stats = document.createElement("p");
    stats.textContent =` Toplam ${completedTodos.length} görev tamamlanmış!`;
    divCompleted.append(stats);
}

//backendden tamamlananaları çek

async function loadCompleted(){
    let res = await fetch(API_URL);
    if (!res.ok){
        console.error("Tamamlanan Görevler Alınamadı!");
        return;
    }

    let data = await res.json();
    completedTodos = data.todos;
    listCompleted();
}

//Görevleri Geri Alma
async function undoTodo(todo){
    await fetch(`http://127.0.0.1:5000/todos/${todo.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({completed: false})
    });
    completedTodos = completedTodos.filter(t => t.id !== todo.id);
    listCompleted();
}

//Görev Silme
async function deleteTodo(todo){
    await fetch(`http://127.0.0.1:5000/todos/${todo.id}`, {method: "DELETE"});
    completedTodos = completedTodos.filter(t => t.id !== todo.id);
    listCompleted();
}

//sayfa açılınca veri yğkleme
loadCompleted();