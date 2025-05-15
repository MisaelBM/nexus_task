"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutGrid, GanttChart, Calendar, Layout, Clock, User, Edit, Home } from 'lucide-react';

export default function CalendarPage() {
  // Estado para controlar o mês e ano atuais
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Lista de meses em português
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Dias da semana em português
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  
  // Eventos simulados (dia do mês => cor)
  const events = {
    1: 'green',
    4: 'red',
    5: 'yellow',
    13: 'blue',
    16: 'blue'
  };
  
  // Função para gerar os dias do mês atual
  const getDaysInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    // Dias do mês anterior para completar a primeira semana
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // Navegação para o mês anterior
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navegação para o próximo mês
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Navegação para o ano anterior
  const goToPreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };
  
  // Navegação para o próximo ano
  const goToNextYear = () => {
    setCurrentYear(currentYear + 1);
  };
  
  // Obter dias do mês atual
  const days = getDaysInMonth(currentMonth, currentYear);
  
  // Dividir os dias em semanas
  const weeks = [];
  let week = [];
  
  days.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0 || index === days.length - 1) {
      // Completar a última semana se necessário
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push([...week]);
      week = [];
    }
  });
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center border-b border-gray-800 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-gray-800 rounded-full mr-4">
            <User size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-fuchsia-200">Nexus Task</h1>
        </div>
      </div>
      
      {/* Corpo principal */}
      <main className="flex flex-1 p-4">
        {/* Conteúdo do calendário */}
        <div className="flex-1 pl-4">
          {/* Cabeçalho do calendário */}
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-4">
              <Calendar size={16} />
            </div>
            
            <div className="flex items-center mr-8">
              <button onClick={goToPreviousMonth} className="p-1">
                <ChevronLeft size={20} />
              </button>
              <span className="w-24 text-center">{months[currentMonth]}</span>
              <button onClick={goToNextMonth} className="p-1">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="flex items-center">
              <button onClick={goToPreviousYear} className="p-1">
                <ChevronLeft size={20} />
              </button>
              <span className="w-16 text-center">{currentYear}</span>
              <button onClick={goToNextYear} className="p-1">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Grid do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {/* Dias da semana */}
            {weekdays.map((day, index) => (
              <div key={index} className="text-center py-2 text-gray-400">
                {day}
              </div>
            ))}
            
            {/* Dias do mês */}
            {weeks.flat().map((day, index) => (
              <Link year={currentYear} month={currentMonth} day={day} href={day ? `/pages/frame/` : ""} className="text-center py-2">
                <div 
                    key={index} 
                    className={`
                    h-24 p-1 relative
                    ${day ? 'border border-gray-700 bg-gray-800 duration-400 hover:bg-gray-600' : ''} 
                    `}
                >
                    {day && (
                    <>
                        <span className="text-sm">{day}</span>
                        {events[day] && (
                        <div 
                            className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-${events[day]}-500`}
                            style={{ 
                            backgroundColor: 
                                events[day] === 'green' ? '#10B981' : 
                                events[day] === 'red' ? '#EF4444' : 
                                events[day] === 'yellow' ? '#F59E0B' : 
                                events[day] === 'blue' ? '#3B82F6' : 'transparent' 
                            }}
                        />
                        )}
                    </>
                    )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}