import React from 'react'
import './list-element.css'
import { useState } from 'react'
function ListElement(props) {
  const [text, setText] = useState(props.data.text);
  const [inputText, setInputText] = useState(props.data.text);
  const [editMode, setEditMode] = useState(false);
  const [highlightColor, setHighlightColor] = useState(props.highlightColor);

  const handleToggleEdit = () => {
    setEditMode(prevState => !prevState);
  };
  const handleUpdateText = async (e) => {
    e.preventDefault();
    setText(inputText);
    console.log("Sending id:", props.data.id);
    const response = await fetch(`http://localhost:3000/api/todos/${props.data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ text: inputText }),
    });
  }

  const handleAddHighlight = (color) => {
    setHighlightColor(color);
    const stored = localStorage.getItem("highlights");
    let colorMap = stored ? JSON.parse(stored) : {};
    colorMap[props.data.id] = color;
    localStorage.setItem('highlights', JSON.stringify(colorMap));
    setEditMode(false);
  }

  /*const handleDeleteHighlight = (e) => {

    props.onDelete(e,props.data.id);
  }*/

  return (
    <>
      <div className='list-element'>
        <div className="todo-content-container">
          <button className='check-btn' onClick={(e) => props.onDelete(e, props.data.id)}></button>
          <p style={{ 'backgroundColor': `${highlightColor}` }}>{text}</p>
          <button className="edit-btn" onClick={handleToggleEdit}><i className="fa-solid fa-pencil"></i></button>
        </div>
        <div className={`edit-form-container ${editMode ? 'active' : ''}`}>
          <div>
            <h3>Edit task</h3>
            <form action="" style={{ 'display': 'flex' }} onSubmit={handleUpdateText}>
              <input type="text" id="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
              <button className='edit-submit-btn'><i class="fa-solid fa-check fa-xs"></i></button>
            </form>
          </div>
          <div className='color-pick'>
            <h3>Highlight Color</h3>
            <div className="colors-container">
              <button className='highlight-color yellow' onClick={() => handleAddHighlight('yellow')}></button>
              <button className='highlight-color red' onClick={() => handleAddHighlight('red')}></button>
              <button className='highlight-color green' onClick={() => handleAddHighlight('#44e200')}></button>
              <button className='highlight-color transparent' onClick={() => handleAddHighlight('transparent')}></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListElement