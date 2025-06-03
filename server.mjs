import cors from 'cors';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = 8080;

// Configurar CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'UPDATE'],
    allowedHeaders: ['Content-Type']
}));

// Middleware para JSON
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'appuser',
    password: 'appus3rMysql',
    database: 'gerenciador_tarefas'
};

// Exibir as tasks
app.get("/viewTask", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM tasks');
        await connection.end();
        res.send(rows);
        console.log(rows);
    } catch (error) {
        console.log('Erro ao buscar as tasks:', error);
    }
});

// Exibir as tags
app.get("/viewTags", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM tags');
        await connection.end();
        res.send(rows);
        console.log(rows);
    } catch (error) {
        console.log('Erro ao buscar as tags:', error);
    }
});

// Adicionar uma nova task
app.post("/addTask", async (req, res) => {
    const { title, date, assignee, tags, completed } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result1] = await connection.execute(
        'INSERT INTO tasks (title, date, assignee, completed) VALUES (?, ?, ?, ?)',
        [title, date, assignee, completed]
    );
    await connection.end();
    res.send(result1);
    console.log(result1);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});