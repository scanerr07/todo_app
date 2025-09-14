const divTodos = document.getElementById("todos");
            const frmTodos = document.getElementById("frmTodos");
            const text = document.getElementById("text");
            const btn = document.getElementById("btn");
            const API_URL ="http://127.0.0.1:5000/todos";

            let todos = []; //görev listesi
            function listTodos(){
                divTodos.innerHTML="";
                todos.sort((a,b) => a.completed - b.completed);

                for(const todo of todos){
                    let div = document.createElement("div");

                    //görev tamamlama kutucuğu
                    let input = document.createElement("input");
                    input.type= "checkbox";
                    input.checked = todo.completed;
                    input.onchange = (e) => toggleTodo(todo);
                    div.append(input);

                    //yazı satırı
                    let span = document.createElement("span");
                    span.textContent = todo.task;
                    if(todo.completed) span.classList.add("completed");
                    div.append(span);

                    //silme kutucuğu
                    let button = document.createElement("button");
                    button.type="button";
                    button.onclick = (e) => deleteTodo(todo);
                    button.innerHTML = '<i class=\"fa-solid fa-xmark\"></i>';
                    div.append(button);

                    divTodos.append(div);
                }
            }

            async function saveData(task){
                let res = await fetch(API_URL, {
                    method: "POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({task:task})
                });
                let newTodo = await res.json();
                todos.push({
                    id: newTodo.id,
                    task:newTodo.task,
                    completed: newTodo.completed
                });
                listTodos();

            }

            async function loadData(){
                let res =await fetch(API_URL);
                if(!res) return;

                try {
                    let data = await res.json();
                    todos = data.todos;
                    listTodos();
                }
                catch{

                }
            }

            async function toggleTodo(todo){
                await fetch(${API_URL}/${todo.id}, {
                    method:"PUT",
                        headers:{ "Content-Type": "application/json" },
                        body: JSON.stringify({ completed: !todo.completed })
                });
                todo.completed = !todo.completed;
                listTodos();

            }

            async function deleteTodo(todo){
                await fetch(${API_URL}/${todo.id}, {method:"DELETE"});
                todos = todos.filter(t => t.id !== todo.id );
                listTodos();
            }

            frmTodos.onsubmit = async function(event){
                event.preventDefault();
                let task = text.value.trim();
                if (!task) return;
                await saveData(task);
                listTodos();
                text.value="";
            };

            //load data
       loadData();
