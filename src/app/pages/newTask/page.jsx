"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function AdicionarTarefa(completed) {
  const [tarefa, setTarefa] = useState({
      title: '',
      date: '',
      assignee: '',
      tags: [{ text: 'Sem Prioridade', color: 'gray' }],
      completed: "p"
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria a lógica para salvar a tarefa
    console.log('Tarefa salva:', tarefa);
    router.push('/quadro');
  };
  
  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <Head>
        <title>Adicionar Tarefa | Nexus Task</title>
        <meta name="description" content="Sistema de gestão de tarefas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
         <div className="p-2 bg-gray-800 rounded-full mr-4">
            <User size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-fuchsia-200">Nexus Task</h1>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-[#1e293b] rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Adicionar Nova Tarefa</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium mb-1">
                  Título da Tarefa
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={tarefa.title}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dataVencimento" className="block text-sm font-medium mb-1">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    id="dataVencimento"
                    name="dataVencimento"
                    value={tarefa.date}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                
                <div>
                  <label htmlFor="responsavel" className="block text-sm font-medium mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    id="responsavel"
                    name="responsavel"
                    value={tarefa.assignee}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Link href="/pages/frame/" className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition">
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Adicionar Tarefa
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-6 bg-[#1e293b] rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-4">Visualização Prévia</h2>
          
          <div className="border border-gray-700 rounded-md p-3">
            <div className="mt-2">
              <div className="flex items-center">
                <span className="inline-block mr-2 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="font-medium">{tarefa.title || 'Título da Tarefa'}</span>
              </div>
            </div>
            
            {tarefa.date && (
              <div className="mt-2 text-sm text-gray-400">
                {new Date(tarefa.date).toLocaleDateString('pt-BR')}
              </div>
            )}
            
            {tarefa.assignee && (
              <div className="mt-3 flex justify-end">
                <div className="inline-flex items-center px-2 py-1 bg-gray-800 rounded-md text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {tarefa.assignee}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  );
}