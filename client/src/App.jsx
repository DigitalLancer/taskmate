import { useEffect, useState } from 'react'
import './App.css'
import ListElement from './components/ListElement'

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [highlights, setHighlights] = useState();

  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
      .then(resp =>
        resp.json()
      ).then(data => {
        setTodos(data);
      });
    const savedHighlights = loadHighlights();
    setHighlights(savedHighlights);
  }, [])

  const loadHighlights = () => {
    const stored = localStorage.getItem('highlights');
    return stored ? JSON.parse(stored) : {};
  }

  const deleteHighlight = (id) => {
    const colorMap = loadHighlights();
    console.log("Element to be deleted from local storage with id", id);
    delete colorMap[id];
    setHighlights(colorMap);

    if (Object.keys(colorMap).length === 0) {
      localStorage.removeItem('highlights');
    } else {
      // Güncel halini kaydet
      localStorage.setItem('highlights', JSON.stringify(colorMap));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ text }),
    });
    const data = await response.json();
    console.log("Server response: \n", response, '\n', "Body: \n", data);
    setText('');
    if (todos.length > 0) {
      setTodos(prev => [...prev, { id: todos[todos.length - 1].id + 1, text: text }])
    }
    else {
      setTodos(prev => [...prev, { id: 1, text: text }])
    }
  }

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ text }),
    });
    const data = await response.json();
    setTodos(data);
    console.log("Server response: \n", response, '\n', "Body: \n", data);
    deleteHighlight(id);
  }

  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <div className="todo-container">

            <h2 className="title">To Do List</h2>
            <ul id="todo-list">
              {todos.map((element) => (
                <li key={element.id}>
                  <ListElement data={element} onDelete={handleDelete} highlightColor={highlights[element.id]} />
                </li>
              ))}
            </ul>

            <form className="input-container" onSubmit={handleSubmit}>
              <input type="text" name="description" placeholder="Enter a new task" className="todo-input" onChange={(e) => setText(e.target.value)} value={text} required />
              <button type="submit" id="list-submit-btn" className="submit-btn"><i
                className="fa-solid fa-plus fa-sm" style={{ 'color': 'white' }}></i></button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
