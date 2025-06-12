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

// Exibir as tags
app.get("/viewTagsTasks", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM task_tags');
        await connection.end();
        res.send(rows);
        console.log(rows);
    } catch (error) {
        console.log('Erro ao buscar as tags:', error);
    }
});

// Adicionar uma nova task
app.post("/addTask", async (req, res) => {
    const { title, date, assignee, completed } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result1] = await connection.execute(
        'INSERT INTO tasks (title, date, assignee, completed) VALUES (?, ?, ?, ?)',
        [title, date, assignee, completed]
    );
    await connection.end();
    res.send(result1);
    console.log(result1);
});

app.post("/updateTaskStatus", async (req, res) => {
    try {
        const { id, completed, lista } = req.body;
        
        // Validação dos dados de entrada
        if (!id || !completed || !lista) {
            return res.status(400).json({
                error: 'Dados incompletos',
                message: 'ID, status e lista são obrigatórios'
            });
        }

        // Validação do status
        if (!['p', 'a', 'c'].includes(completed)) {
            return res.status(400).json({
                error: 'Status inválido',
                message: 'O status deve ser p, a ou c'
            });
        }

        // Validação da lista
        const validLists = ['Pendentes', 'Em Andamento', 'Concluídos'];
        if (!validLists.includes(lista)) {
            return res.status(400).json({
                error: 'Lista inválida',
                message: `A lista deve ser uma das seguintes: ${validLists.join(', ')}`
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // Verifica se a task existe
        const [existing] = await connection.execute(
            'SELECT id FROM tasks WHERE id = ?',
            [id]
        );

        if (!existing.length) {
            await connection.end();
            return res.status(404).json({
                error: 'Task não encontrada',
                message: `Não existe task com o ID ${id}`
            });
        }

        // Atualiza a task
        const [result] = await connection.execute(
            'UPDATE tasks SET completed = ?, lista = ? WHERE id = ?',
            [completed, lista, id]
        );

        await connection.end();

        if (result.affectedRows > 0) {
            res.json({
                success: true,
                message: 'Task atualizada com sucesso',
                data: result
            });
            console.log('Task atualizada:', { id, completed, lista });
        } else {
            res.status(500).json({
                error: 'Falha na atualização',
                message: 'A task não foi atualizada'
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar task:', error);
        res.status(500).json({
            error: 'Erro interno',
            message: 'Ocorreu um erro ao atualizar a task'
        });
    }
});

app.post("/addTagsTasks", async (req, res) => {
    const { tag_id, task_id } = req.body;

    let i = 0;
    let valores = "";
    tag_id.forEach(tag => {
        if (i === 0) {
            valores += `(${tag}, ${task_id})`;
        } else {
            valores += `, (${tag}, ${task_id})`;
        }
        i++;
    });
    // console.log(valores);
    const connection = await mysql.createConnection(dbConfig);
    const [result1] = await connection.execute(
        `INSERT INTO task_tags (tag_id, task_id) VALUES ${valores}`,
        []
    );
    await connection.end();
    res.send(result1);
    console.log(result1);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});