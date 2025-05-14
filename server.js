// Ferramentas necessárias
import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
const port = 8080;

// Configurações da conexão com o banco de dados MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',    
    password: '030119983',  
    database: 'gerenciador_tarefas'
};

// Middleware para lidar com JSON no corpo das requisições
app.use(express.json());

// Conexão com banco de dados
try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM tasks');
    await connection.end();
    console.log(rows);
} catch (error) {
    console.log('Erro ao buscar as tasks');
};

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});