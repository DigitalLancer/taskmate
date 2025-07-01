import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import cors from 'cors';


const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = __dirname + "/data/todos.json"

let index;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get('/api/todos', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read todos.' });
        const todos = JSON.parse(data);
        if (todos.length > 0) {
            index = todos[todos.length - 1].id + 1;;
        }
        else {
            index = 1;
        }
        index = todos.length;
        res.json(todos);
    });
});

app.post('/api/todos', (req, res) => {
    //read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read todos.' });
        const todos = JSON.parse(data);
        if (todos.length > 0) {
            index = todos[todos.length - 1].id + 1;
        }
        else {
            index = 1;
        }
        //create new element and push to the array
        const newTodo = {
            id: index,
            text: req.body.text
        };
        todos.push(newTodo);

        //write the new array to file
        fs.writeFile(filePath, JSON.stringify(todos), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write todos.' });
            }
            res.status(201).json({ message: 'New to-do added', todo: newTodo });
        })
    });
})

app.delete('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read todos.' });
        const todos = JSON.parse(data);
        const deletIndex = todos.findIndex(element => element.id === id);
        todos.splice(deletIndex, 1);

        //write the new array to file
        fs.writeFile(filePath, JSON.stringify(todos), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write todos.' });
            }
            res.status(200).json(todos);
        })
    });
});

app.patch('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read todos.' });
        const todos = JSON.parse(data);
        const updateIndex = todos.findIndex(element => element.id === id);
        console.log("Element to be updated:", todos[updateIndex], ", Update value:", req.body.text);
        todos[updateIndex].text = req.body.text;
        console.log("todos list after modification:", todos[updateIndex]);
        //write the new array to file
        fs.writeFile(filePath, JSON.stringify(todos), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write todos.' });
            }
            res.status(200).json({ message: 'Update success' });
        })
    });
})
