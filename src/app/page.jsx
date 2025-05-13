"use client";

import Link from 'next/link';
import { User, Calendar, CheckCircle, Clock, SquareCheckBig, ArrowRight } from 'lucide-react';

export default function WelcomePage() {

  return (
    <div id="welcomePage" className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center">
          <div className="p-2 bg-blue-600 rounded-full mr-3">
            <SquareCheckBig size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-fuchsia-200">Nexus Task</h1>
        </div>
        
        <button className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
          Entrar
        </button>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center max-w-3xl flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-6">Bem-vindo ao seu sistema de gestão de tarefas</h2>
          <p className="text-xl text-gray-300 mb-8">
            Organize seu fluxo de trabalho, acompanhe o progresso da equipe e aumente a produtividade com nossa solução completa.
          </p>
            <Link href="/pages/frame" className="flex items-center">
                <button className="px-8 py-3 bg-blue-600 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-800 disabled:cursor-not-allowed">
                    Começar Agora <ArrowRight className="ml-2" size={20} />
                </button>
            </Link>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quadro Kanban</h3>
            <p className="text-gray-300">
              Visualize tarefas pendentes, em andamento e concluídas em um quadro intuitivo e personalizável.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <User size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Gestão de Trabalho</h3>
            <p className="text-gray-300">
              Atribua suas tarefas em conjunto com os membros da sua equipe e acompanhe o progresso em tempo real.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Prioridades</h3>
            <p className="text-gray-300">
              Defina níveis de prioridade e categorias para organizar melhor o fluxo de trabalho da empresa.
            </p>
          </div>
        </div>
        
        {/* Testimonial/Stats */}
        <div className="mt-20 bg-gray-800 p-8 rounded-lg max-w-4xl">
          <div className="flex justify-between flex-wrap gap-8">
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-blue-500 mb-2">94%</div>
              <p className="text-gray-300">Aumento em produtividade</p>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-green-500 mb-2">78%</div>
              <p className="text-gray-300">Redução de prazos perdidos</p>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-purple-500 mb-2">25+</div>
              <p className="text-gray-300">Integrações disponíveis</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 Nexus Task. Todos os direitos reservados.</p>
        </div>
      </footer>
      
      {/* Aqui simulamos o quadro Kanban que seria carregado após clicar em "Começar Agora" */}
      <div id="kanbanBoard" className="hidden"></div>
    </div>
  );
}