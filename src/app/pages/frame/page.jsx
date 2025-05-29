"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Clock, Calendar, LayoutGrid, GanttChart, User, Plus, Check, Feather } from 'lucide-react';

export default function KanbanBoard() {
  const [viewTasks, setViewTasks] = useState(<></>);
  const [columns, setColumns] = useState([
    {
      id: 'pendentes',
      title: 'Pendentes',
      cards: []
    },
    {
      id: 'andamento',
      title: 'Em Andamento',
      cards: []
    },
    {
      id: 'concluidos',
      title: 'Concluídos',
      cards: []
    }
  ]);

  // Função para renderizar o chip de tag com a cor apropriada
  const renderTag = (tag) => {
    const getTagColorClass = (color) => {
      const colorMap = {
        gray: 'bg-gray-200 text-gray-800',
        yellow: 'bg-yellow-400 text-yellow-900',
        green: 'bg-green-500 text-white',
        blue: 'bg-blue-500 text-white',
        orange: 'bg-orange-500 text-white',
        red: 'bg-red-600 text-white',
        pink: 'bg-pink-400 text-white',
        purple: 'bg-purple-600 text-white',
        darkgray: 'bg-gray-700 text-white'
      };
      return colorMap[color] || 'bg-gray-200 text-gray-800';
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTagColorClass(tag.color)} mr-1`}>
        {tag.text}
      </span>
    );
  };

  // Cria a conexão
  const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
  });

  // Realiza as chamadas
  const connGetTasks = async () => {
    await api.get("/viewTask")
    .then(response => {
      columns.forEach(column => {
        column.cards = [];
      });
      // Preenche os cards com os dados do banco
      const array = response.data;
      
      array.forEach(e => {
        columns[e.completed == "c" ? 2 : e.completed == "a" ? 1 : 0].cards.push({
          id: e.id,
          title: e.title,
          date: `${e.date}`.split('T')[0],
          assignee: e.assignee,
          tags: [
            { text: 'Prioridade Baixa', color: 'blue' },
            { text: 'Fluxo', color: 'pink' },
            { text: 'Cronograma', color: 'pink' }
          ],
          completed: e.completed
        });
      });  
    })
    .catch(error => console.error(error));
  };
  useEffect(() => {
    renderTasks();
    console.log(columns);
  }, [columns]);
  const renderTasks = async() => {
    await connGetTasks();
    setViewTasks(columns.map(column => (
    <div key={column.id} className="flex flex-col w-80 flex-shrink-0">
      <div className="bg-gray-800 p-3 rounded-md mb-4">
        <h2 className="font-medium text-lg">{column.title}</h2>
      </div>
      <div className="flex flex-col space-y-3 flex-1 overflow-y-auto">
        {column.cards.map(card => (
          <div key={card.id} className="bg-gray-800 p-3 rounded-md">
            <div className="flex flex-wrap gap-1 mb-2">
              {card.tags.map((tag, idx) => (
                <div key={idx}>
                  {renderTag(tag)}
                </div>
              ))}
            </div>
            
            <div className="flex items-start">
              {card.completed == "c" && (
                <div className="mr-2 mt-1">
                  <div className="p-1 bg-green-600 rounded-full">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
              )}
              <h3 className="font-medium mb-1">{card.title}</h3>
            </div>
            <div className="text-sm text-gray-400 mb-2">{card.date}</div>
            
            <div className="flex justify-end">
              <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                <User size={14} className="mr-1" />
                <span className="text-sm">{card.assignee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )))}

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center border-b border-gray-800 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-gray-800 rounded-full mr-4">
            <User size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-fuchsia-200">Nexus Task</h1>
        </div>
        <div className="flex ml-6 space-x-2">
          <Link href="/pages/calendar" className='flex items-center cursor-'>
            <button className="flex items-center px-4 py-2 bg-gray-800 rounded-md">
              <Calendar size={16} className="mr-2" />
              <span>Calendario</span>
            </button>
          </Link>
          <button className="flex items-center px-4 py-2 bg-gray-800 rounded-md">
            <GanttChart size={16} className="mr-2" />
            <span>Cronograma</span>
          </button>
        </div>
      </header>
      
      {/* Board */}
      <div className="flex flex-1 p-4 space-x-4 overflow-x-auto">
        {viewTasks}
      </div>
      <Link href={`/pages/newTask/`} className='flex items-center justify-center p-3 bg-gray-800 rounded-md text-gray-400 hover:bg-gray-700'>
          <button className="flex items-center justify-center p-3 bg-gray-800 rounded-md text-gray-400 hover:bg-gray-700">
            <Plus size={16} className="mr-2" />
            <span>Adicionar Cartão</span>
          </button>
        </Link>
    </div>
  );
}