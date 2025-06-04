"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Header from '../../../components/headerLogIn';
import Sidebar from '@/components/sidebar';

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

  const [getDataSidebar, setGetDataSidebar] = useState("");
  const [setDataSidebar, setSetDataSidebar] = useState("");

  const getData = (data) => {
    setGetDataSidebar(data);
    // console.log(getDataSidebar)
  }

  const parentToChild = () => {
    setSetDataSidebar("OLA")
  }

  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    let sidebarButton = document.getElementById('sidebar-button');
    const body = document.getElementById('body');

    body.addEventListener('click', (event) => {
      if (sidebar.classList.contains('w-64') && event.target.id != "sidebar") {
        // setSetDataSidebar(getDataSidebar)
        parentToChild()
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-12');
        sidebarButton.classList.remove("rotate-180");
      }
    });
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar getData={getData} setData={setDataSidebar}/>
      
      {/* Corpo principal */}
      <main id='main' className="flex flex-1 p-6 ml-16">
        {/* Conteúdo do calendário */}
        <div className="flex-1 flex flex-col min-h-full">
          {/* Cabeçalho do calendário */}
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-[#1F2B3E] cursor-pointer rounded flex items-center justify-center mr-4">
              <Calendar size={20} />
            </div>
            
            <div className="flex items-center mr-8">
              <button onClick={goToPreviousMonth} className="p-1 cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <span className="w-fit px-6 text-center">{months[currentMonth]}</span>
              <button onClick={goToNextMonth} className="p-1 cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="flex items-center">
              <button onClick={goToPreviousYear} className="p-1 cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <span className="w-fit px-6 text-center">{currentYear}</span>
              <button onClick={goToNextYear} className="p-1 cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Grid do calendário */}
          <div className="grid grid-cols-7 gap-[6px]">
            {/* Dias da semana */}
            {weekdays.map((day, index) => (
              <div key={index} className="text-center py-2 text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className='h-full min-h-[530px] max-h-[700px] p-6 my-auto rounded-xl bg-[#0E1621]'>
            <div className='grid grid-cols-7 h-full gap-[6px] rounded-md overflow-hidden'>
              
              {/* Dias do mês */}
              {weeks.flat().map((day, index) => (
                <div className='h-full'>
                  <div 
                      key={index} 
                      className={`
                      h-full p-1 relative
                      ${day ? 'bg-gray-800 duration-400 hover:bg-gray-600' : 'bg-[#121E2E]'} 
                      `}
                  >
                      {day ? (
                        <>
                          <Link year={currentYear} month={currentMonth} day={day} href={day ? `/pages/frame/` : ""} className="text-center w-full h-full block">
                            <span className="text-sm">{day}</span>
                            {events[day] && (
                            <div 
                                className={`absolute top-2 right-2 w-4 h-4 rounded-full bg-${events[day]}-500`}
                                style={{ 
                                backgroundColor: 
                                    events[day] === 'green' ? '#10B981' : 
                                    events[day] === 'red' ? '#EF4444' : 
                                    events[day] === 'yellow' ? '#F59E0B' : 
                                    events[day] === 'blue' ? '#3B82F6' : 'transparent' 
                                }}
                            />
                            )}
                          </Link>
                        </>
                      ) : (
                        <>
                            <span className="text-sm">{day}</span>
                            {events[day] && (
                            <div 
                                className={`absolute top-2 right-2 w-4 h-4 rounded-full bg-${events[day]}-500`}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}