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
    user: 'root',
    password: '',
    database: 'gerenciador_tarefas'
};

// Conectar e buscar dados do MySQL
const fetchTasks = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM tasks');
        await connection.end();
        app.get('/', (req, res) => res.send(rows));
        console.log(rows);
    } catch (error) {
        console.log('Erro ao buscar as tasks:', error);
    }
};

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
    fetchTasks(); // Executar a função de busca ao iniciar o servidor
});