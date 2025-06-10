"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Clock, Calendar, LayoutGrid, GanttChart, User, Plus, Check, Feather } from 'lucide-react';
import Header from '../../../components/headerLogIn';
import Sidebar from '@/components/sidebar';

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
        gray: 'bg-gray-200 rounded-[4px] text-gray-800',
        yellow: 'bg-yellow-400 rounded-[4px] text-yellow-900',
        green: 'bg-green-500 rounded-[4px] text-white',
        blue: 'bg-blue-500 rounded-[4px] text-white',
        orange: 'bg-orange-500 rounded-[4px] text-white',
        red: 'bg-red-600 rounded-[4px] text-white',
        pink: 'bg-pink-400 rounded-[4px] text-white',
        purple: 'bg-purple-600 rounded-[4px] text-white',
        darkgray: 'bg-gray-700 rounded-[4px] text-white'
      };
      return colorMap[color] || 'bg-gray-200 rounded-[4px] text-gray-800';
    };

    return (
      <div className={`px-3 py-2 rounded-[4px] text-xs font-medium ${getTagColorClass(tag.color)}`}>
        {tag.text}
      </div>
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

      <div key={column.id} className="flex flex-col min-w-88 p-2 bg-[#1F2B3E] rounded-2xl flex-shrink-0">
        <div className="px-4 py-3 rounded-sm mb-4">
          <h2 className="font-medium text-lg">{column.title}</h2>
        </div>

        <div className="flex flex-col space-y-2 flex-1 overflow-y-auto">

          {column.cards.map(card => (

            <div key={card.id} className="flex flex-col gap-2 bg-[#0F1C2E] p-3 min-w-full rounded-md">
              <div className="flex gap-2">

                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag, idx) => (
                    <div key={idx} className='min-h-fit'>
                      {renderTag(tag)}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end h-fit w-full max-w-[75px]">
                  <div className="flex items-center bg-gray-700 px-3 py-2 rounded-[4px]">
                    <User size={14} className="" />
                    <span className="text-sm">{card.assignee}</span>
                  </div>
                </div>

              </div>
              
              <div className="flex items-start">
                {card.completed == "c" && (

                  <div className="mr-2 mt-1">
                    <div className="p-1 bg-green-600 rounded-full">
                      <Check size={14} className="text-white" />
                    </div>
                  </div>

                )}

                <h3 className="font-medium">{card.title}</h3>
              </div>

              <div className="text-sm text-gray-400 mb-2">{card.date}</div>
            </div>

          ))}
        </div>
      </div>
  )))}

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        event.target.id !== 'sidebar' &&
        event.target.id !== 'sidebar-icon' &&
        !event.target.closest('.sidebar-button')
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header isActive={[false, true, false]} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />
      
      {/* Board */}
      <div className="ml-16 h-full">  
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
    </div>
  );
}