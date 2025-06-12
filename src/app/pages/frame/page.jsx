"use client";

import { useState, useEffect } from 'react';
// import Link from 'next/link';
import axios from 'axios';
import { User, Plus, Check } from 'lucide-react';
import Header from '../../../components/headerLogIn';
import Sidebar from '@/components/sidebar';
import ModalCreateTask from '@/components/modalCreateTask';

export default function KanbanBoard() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [tasks, setTasks] = useState({});
  const [tagsTasks, setTagsTasks] = useState({});
  const [tags, setTags] = useState({});
  const [viewTasks, setViewTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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
    // Função para verificar se a cor é clara
    const isLightColor = (hex) => {
      if (!hex || typeof hex !== "string") return false;
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      if (c.length !== 6) return false;
      const r = parseInt(c.substr(0,2),16);
      const g = parseInt(c.substr(2,2),16);
      const b = parseInt(c.substr(4,2),16);
      // Percepção de luminosidade
      const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
      return luminance > 0.7;
    };

    const textColor = isLightColor(tag.color) ? 'text-black' : 'text-white';

    return (
      <div className={`px-3 py-1 rounded-[4px] text-xs font-medium bg-[${tag.color}] ${textColor}`}>
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
  const getTasks = async () => {

    await api.get("/viewTask").then(response => {

      setTasks(response.data);

    }).catch(error => console.error(error));

  };

  const getTagsTasks = async () => {

    await api.get("/viewTagsTasks").then(response => {

      setTagsTasks(response.data);

    }).catch(error => console.error(error));

  };

  const getTags = async () => {

    await api.get("/viewTags").then(response => {

      setTags(response.data);

    }).catch(error => console.error(error));

  };

  useEffect(() => {
    const headerElement = document.querySelectorAll(".header")[0];
    if (headerElement) {
      setHeaderHeight(headerElement.offsetHeight);
    }
    const bodyElement = document.getElementById("body");
    if (body) {
      setBodyHeight(bodyElement.offsetHeight);
    }
  }, [headerHeight, bodyHeight])

  useEffect(() => {
    getTasks();
    getTagsTasks();
    getTags();
  }, []);

  const handleTasks = () => {
    if (!Array.isArray(tasks) || !Array.isArray(tagsTasks) || !Array.isArray(tags)) {
      console.log('Aguardando dados necessários...');
      return;
    }

    // Primeiro, limpa todas as colunas
    const newColumns = columns.map(column => ({
      ...column,
      cards: []
    }));

    // Processa as tarefas
    tasks.forEach(task => {
      // Determina o índice da coluna baseado na lista e status
      let columnIndex;
      
      // Prioriza o campo lista, mas usa completed como fallback
      if (task.lista) {
        switch (task.lista) {
          case 'Concluídos':
            columnIndex = 2;
            break;
          case 'Em Andamento':
            columnIndex = 1;
            break;
          case 'Pendentes':
          default:
            columnIndex = 0;
            break;
        }
      } else {
        // Se não tem lista definida, usa o status completed
        columnIndex = task.completed === 'c' ? 2 : task.completed === 'a' ? 1 : 0;
        
        // Atualiza o campo lista baseado no status
        task.lista = columnIndex === 2 ? 'Concluídos' : 
                    columnIndex === 1 ? 'Em Andamento' : 
                    'Pendentes';
      }

        // Adiciona o cartão à coluna apropriada
        newColumns[columnIndex].cards.push({
          id: task.id,
          title: task.title,
          date: `${task.date}`.split('T')[0],
          assignee: task.assignee,
          tags: [
            ...tagsTasks.filter(tag => tag.task_id === task.id).map(tag => ({
              text: tags.find(t => t.id === tag.tag_id)?.name || 'Sem Tag',
              color: tags.find(t => t.id === tag.tag_id)?.color || 'Sem Tag'
            }))
          ],
          completed: task.completed,
          lista: task.lista
        });
    });
      setColumns(newColumns);
  }

  useEffect(() => {
    if (tasks && tags && tagsTasks) {
      handleTasks();
    }
  }, [tasks, tagsTasks, tags])

  // Atualiza a visualização quando as colunas ou dados mudam
  useEffect(() => {
    if (columns && tasks && tagsTasks) {
      renderTasks();
    }
  }, [columns, tasks, tagsTasks]);

  const completeSet = async (event, cardId) => {
    if (!event.target) return;

    let el = event.target;
    while (el && !el.classList.contains('buttonCheck')) {
      el = el.parentElement;
    }

    if (!el || !el.classList.contains('buttonCheck')) return;

    const currentCard = columns.find(col => col.cards.some(c => c.id === cardId))
      ?.cards.find(c => c.id === cardId);
    
    if (!currentCard) {
      console.error('Card não encontrado:', cardId);
      return;
    }

    const isCurrentlyCompleted = currentCard.completed === 'c';
    const newStatus = isCurrentlyCompleted ? 'p' : 'c';
    const newLista = isCurrentlyCompleted ? 'Pendentes' : 'Concluídos';
    
    try {
      // Atualiza o estado local primeiro para feedback imediato
      el.style.backgroundColor = isCurrentlyCompleted ? 'transparent' : '#14AE5C';
      
      // Atualiza no banco de dados
      const response = await api.post('/updateTaskStatus', {
        id: cardId,
        completed: newStatus,
        lista: newLista
      });

      if (response.data.affectedRows > 0) {
        // Atualiza o estado local com os dados do servidor
        const newTasks = await api.get("/viewTask");
        setTasks(newTasks.data);
      } else {
        // Reverte a mudança visual se a atualização falhar
        el.style.backgroundColor = isCurrentlyCompleted ? '#14AE5C' : 'transparent';
        console.error('Falha ao atualizar tarefa no servidor');
      }
    } catch (error) {
      // Reverte a mudança visual em caso de erro
      el.style.backgroundColor = isCurrentlyCompleted ? '#14AE5C' : 'transparent';
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  }

  const renderTasks = async() => {    
    setViewTasks(columns.map(column => (
      <div key={column.id} className="flex flex-col min-w-84 max-w-84 p-2 h-full bg-[#1F2B3E] rounded-2xl flex-shrink-0">
        <div className="px-4 py-1.5 rounded-sm mb-2">
          <h2 className="font-medium text-lg">{column.title}</h2>
        </div>

        <div
          className="
            lista flex flex-col h-full overflow-y-auto space-y-2 flex-1
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-track]:bg-[#1F2B3E]
            dark:[&::-webkit-scrollbar-thumb]:bg-[#374357]
          "
        >
          {column.cards.map(card => (
            <div key={card.id} className="flex flex-col gap-2 bg-[#0F1C2E] p-3 min-w-full rounded-md">
              <div className="flex justify-between gap-2">
                <div className='flex gap-1'>
                  <div className={`buttonCheck flex justify-center items-center w-6 max-w-6 min-w-6 h-6 max-h-6 min-h-6 ${card.completed === 'c' ? 'bg-[#14AE5C]' : 'bg-transparent'} border border-[#14AE5C] rounded-lg cursor-pointer hover:bg-[#14AE5C] duration-100`} onClick={(event) => {completeSet(event, card.id)}}>
                    <Check strokeWidth={3} size={19} className='checkIcon -translate-x-[1px]'/>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, idx) => (
                      <div key={idx} className='min-h-fit'>
                        {renderTag(tag)}
                      </div>
                    ))}
                    {console.log(card.tags, tagsTasks)}
                  </div>
                </div>
                <div className="flex flex-col h-fit justify-end h-fit">
                  <div className="flex items-center gap-1 bg-white px-3 py-[6px] rounded-[4px]">
                    <User size={20} strokeWidth={1.5} color='#000000' className="" />
                    {card.assignee ? <span className="text-sm text-black">{card.assignee}</span> : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-start">
                  {card.completed == "c" && (
                    <div className="mr-2 mt-1">
                      <div className="p-1 bg-green-600 rounded-full">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                  <h3 className="font-medium text-lg">{card.title}</h3>
                </div>
                <div className="text-sm text-gray-400">{card.date}</div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className='flex items-center justify-center cursor-pointer w-full h-fit py-2 bg-[#374357] hover:bg-[#4E5B71] mt-2 rounded-md text-gray-400 hover:bg-gray-700'
          onClick={() => setOpenModal(prev => !prev)}
        >
          <Plus size={16} className="mr-2" />
          <span className='text-white'>Adicionar Cartão</span>
        </button>
      </div>
    )))
  }

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

  const isOpenModal = () => {
    setOpenModal(prev => !prev)
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header isActive={[false, true, false]} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />
      <ModalCreateTask openModal={openModal} isOpen={isOpenModal} />
      {/* Board */}
      <div className={`flex flex-auto h-[${bodyHeight - headerHeight}px] max-h-[${bodyHeight - headerHeight}px] ml-16`}>
        <div className="flex p-4 space-x-4 overflow-x-auto">
          {viewTasks}
        </div>
      </div>
    </div>
  );
}