"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, LinearProgress } from '@mui/material';
import Header from '../../../components/headerLogIn';
import Sidebar from '@/components/sidebar';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsTasks, setTagsTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    tasksByDate: {},
    tagUsage: {},
    averageCompletionTime: 0,
    completionTrends: [],
    recentActivity: [],
    taskDistribution: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    performance: {
      tasksLastWeek: 0,
      tasksThisWeek: 0,
      completionRate: 0,
      weeklyGrowth: 0,
      dailyAverage: 0,
      efficiency: 0,
      weeklyCompletion: Array(7).fill(0)
    },
  });

  // Cria a conexão
  const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
  });

  // Busca os dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, tagsRes, tagsTasksRes] = await Promise.all([
          api.get("/viewTask"),
          api.get("/viewTags"),
          api.get("/viewTagsTasks")
        ]);

        const tasksData = tasksRes.data;
        const tagsData = tagsRes.data;
        const tagsTasksData = tagsTasksRes.data;

        setTasks(tasksData);
        setTags(tagsData);
        setTagsTasks(tagsTasksData);

        // Calcula as métricas básicas
        const completedTasks = tasksData.filter(task => task.completed === 'c').length;
        const inProgressTasks = tasksData.filter(task => task.completed === 'a').length;
        const pendingTasks = tasksData.filter(task => task.completed === 'p').length;

        // Agrupa tarefas por data
        const tasksByDate = {};
        tasksData.forEach(task => {
          const date = format(new Date(task.date), 'dd/MM/yyyy');
          tasksByDate[date] = (tasksByDate[date] || 0) + 1;
        });

        // Calcula uso de tags
        const tagUsage = {};
        tagsTasksData.forEach(tt => {
          const tag = tagsData.find(t => t.id === tt.tag_id);
          if (tag) {
            tagUsage[tag.name] = (tagUsage[tag.name] || 0) + 1;
          }
        });

        // Calcula métricas de performance
        const today = new Date();
        const oneWeekAgo = subDays(today, 7);
        const twoWeeksAgo = subDays(today, 14);

        const tasksThisWeek = tasksData.filter(task => 
          isWithinInterval(new Date(task.date), {
            start: startOfDay(oneWeekAgo),
            end: endOfDay(today)
          })
        ).length;

        const tasksLastWeek = tasksData.filter(task => 
          isWithinInterval(new Date(task.date), {
            start: startOfDay(twoWeeksAgo),
            end: endOfDay(oneWeekAgo)
          })
        ).length;

        const completionRate = tasksData.length > 0 
          ? (completedTasks / tasksData.length) * 100
          : 0;

        const weeklyGrowth = tasksLastWeek > 0
          ? ((tasksThisWeek - tasksLastWeek) / tasksLastWeek) * 100
          : 0;

        const dailyAverage = tasksThisWeek / 7;

        // Calculate completion trends and efficiency
        const completionTrends = Array(7).fill(0);
        const taskDistribution = { morning: 0, afternoon: 0, evening: 0 };
        let totalCompletionTime = 0;
        let completedTaskCount = 0;

        tasksData.forEach(task => {
          const taskDate = new Date(task.date);
          const hours = taskDate.getHours();
          
          // Calculate task distribution by time of day
          if (hours >= 5 && hours < 12) taskDistribution.morning++;
          else if (hours >= 12 && hours < 18) taskDistribution.afternoon++;
          else taskDistribution.evening++;

          // Calculate weekly completion pattern
          if (isWithinInterval(taskDate, { start: startOfDay(oneWeekAgo), end: endOfDay(today) })) {
            const dayIndex = 6 - Math.floor((endOfDay(today) - taskDate) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < 7) completionTrends[dayIndex]++;
          }

          // Calculate average completion time for completed tasks
          if (task.completed === 'c' && task.completedAt) {
            const completionTime = new Date(task.completedAt) - new Date(task.date);
            totalCompletionTime += completionTime;
            completedTaskCount++;
          }
        });

        const averageCompletionTime = completedTaskCount > 0 
          ? totalCompletionTime / completedTaskCount 
          : 0;

        // Calculate efficiency (completed tasks vs created tasks ratio for the week)
        const efficiency = tasksThisWeek > 0 
          ? (completedTasks / tasksThisWeek) * 100 
          : 0;

        // Ordena as tarefas por data para atividade recente
        const recentActivity = [...tasksData]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(task => ({
            ...task,
            tags: tagsTasksData
              .filter(tt => tt.task_id === task.id)
              .map(tt => tagsData.find(t => t.id === tt.tag_id))
              .filter(Boolean)
          }));

        setMetrics({
          totalTasks: tasksData.length,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          tasksByDate,
          tagUsage,
          averageCompletionTime,
          completionTrends,
          recentActivity,
          taskDistribution,
          performance: {
            tasksLastWeek,
            tasksThisWeek,
            completionRate,
            weeklyGrowth,
            dailyAverage,
            efficiency,
            weeklyCompletion: completionTrends
          }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);


  // Gráfico de status das tarefas (pizza)
  const taskStatusData = [
    { id: 0, value: metrics.completedTasks, label: 'Concluídas' },
    { id: 1, value: metrics.inProgressTasks, label: 'Em Andamento' },
    { id: 2, value: metrics.pendingTasks, label: 'Pendentes' },
  ];

  // Gráfico de uso de tags (barras)
  const tagUsageData = tags.map(tag => ({
    id: tag.id,
    value: tagsTasks.filter(tt => tt.tag_id === tag.id).length,
    label: tag.name,
    color: tag.color || '#3b82f6',
  }));

  // Gráfico de linha: tarefas criadas por dia
  const sortedDates = Object.keys(metrics.tasksByDate).sort((a, b) => {
    const [da, ma, ya] = a.split('/').map(Number);
    const [db, mb, yb] = b.split('/').map(Number);
    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
  });
  const lineChartData = {
    labels: sortedDates,
    values: sortedDates.map(date => metrics.tasksByDate[date]),
  };

  // Gráfico de barras: tarefas por lista
  const listTypes = ['Pendentes', 'Em Andamento', 'Concluídos'];
  const tasksByList = listTypes.map(list =>
    tasks.filter(task => task.lista === list).length
  );

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen max-h-screen bg-gray-900 text-white">
        <Header isActive={[false, false, true]} />
        <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
<div className="flex flex-col h-screen max-h-screen bg-gray-800 text-white">
  <Header isActive={[false, false, true]} />
  <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

  <div className="flex-1 p-8 ml-16 overflow-auto">
    <div className="flex justify-between items-center mb-8">
      <Typography variant="h4" className="text-blue-300">Dashboard</Typography>
      <Typography variant="body2" className="text-gray-300">
        Última atualização: {format(new Date(), "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}
      </Typography>
    </div>

    <Grid container spacing={4}>
      {/* Cards de métricas */}
      <Grid item xs={12} sm={6} md={3}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent className="relative overflow-hidden">
            <div className="relative z-10 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <Typography variant="overline" className="text-blue-400">Total de Tarefas</Typography>
                <div className="flex items-center px-2 py-1 rounded bg-opacity-20 bg-blue-400">
                  {metrics.performance.weeklyGrowth > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-300" />
                  ) : metrics.performance.weeklyGrowth < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-300" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>
              <Typography variant="h3" className="mt-2">{metrics.totalTasks}</Typography>
              <div className="mt-4 flex items-center space-x-2">
                <div className="flex-1">
                  <Typography variant="body2" className="text-gray-300">
                    vs. semana anterior
                  </Typography>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${
                      metrics.performance.weeklyGrowth > 0 ? 'text-green-300' :
                      metrics.performance.weeklyGrowth < 0 ? 'text-red-300' :
                      'text-gray-300'
                    }`}>
                      {metrics.performance.weeklyGrowth > 0 ? '+' : ''}
                      {metrics.performance.weeklyGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(Math.abs(metrics.performance.weeklyGrowth), 100)}
                  className="w-20"
                  sx={{
                    backgroundColor: '#374151',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metrics.performance.weeklyGrowth >= 0 ? '#10B981' : '#EF4444'
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent className="relative overflow-hidden">
            <div className="relative z-10">
              <Typography variant="overline" className="text-green-400">Concluídas</Typography>
              <Typography variant="h3" className="mt-2">{metrics.completedTasks}</Typography>
              <Typography variant="body2" className="text-gray-300 mt-1">
                {((metrics.completedTasks / metrics.totalTasks) * 100).toFixed(1)}% do total
              </Typography>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
              <Box className="w-16 h-16 rounded-full bg-green-400" />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent className="relative overflow-hidden">
            <div className="relative z-10">
              <Typography variant="overline" className="text-yellow-400">Em Andamento</Typography>
              <Typography variant="h3" className="mt-2">{metrics.inProgressTasks}</Typography>
              <Typography variant="body2" className="text-gray-300 mt-1">
                {((metrics.inProgressTasks / metrics.totalTasks) * 100).toFixed(1)}% do total
              </Typography>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
              <Box className="w-16 h-16 rounded-full bg-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent className="relative overflow-hidden">
            <div className="relative z-10">
              <Typography variant="overline" className="text-red-400">Pendentes</Typography>
              <Typography variant="h3" className="mt-2">{metrics.pendingTasks}</Typography>
              <Typography variant="body2" className="text-gray-300 mt-1">
                {((metrics.pendingTasks / metrics.totalTasks) * 100).toFixed(1)}% do total
              </Typography>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
              <Box className="w-16 h-16 rounded-full bg-red-400" />
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Gráficos */}
      <Grid item xs={12} md={4}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="text-blue-300">Status das Tarefas</Typography>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2" />
                  <Typography variant="caption" className="text-gray-300">
                    {((metrics.completedTasks / metrics.totalTasks) * 100).toFixed(0)}%
                  </Typography>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                  <Typography variant="caption" className="text-gray-300">
                    {((metrics.inProgressTasks / metrics.totalTasks) * 100).toFixed(0)}%
                  </Typography>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2" />
                  <Typography variant="caption" className="text-gray-300">
                    {((metrics.pendingTasks / metrics.totalTasks) * 100).toFixed(0)}%
                  </Typography>
                </div>
              </div>
            </div>
            <Box height={260} className="relative">
              <PieChart
                series={[
                  {
                    data: taskStatusData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    innerRadius: 80,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    colors: ['#10B981', '#F59E0B', '#EF4444']
                  },
                ]}
                height={260}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Typography variant="h4" className="text-white font-bold">
                    {metrics.totalTasks}
                  </Typography>
                  <Typography variant="caption" className="text-gray-300">
                    Total
                  </Typography>
                </div>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="text-blue-300">Tarefas Criadas por Dia</Typography>
              <div className="flex items-center space-x-2">
                <Typography variant="caption" className="text-gray-300">
                  Média diária: {metrics.performance.dailyAverage.toFixed(1)}
                </Typography>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  metrics.performance.dailyAverage >= 3 ? 'bg-green-400 bg-opacity-20 text-green-300' :
                  metrics.performance.dailyAverage >= 1 ? 'bg-yellow-400 bg-opacity-20 text-yellow-300' :
                  'bg-red-400 bg-opacity-20 text-red-300'
                }`}>
                  {metrics.performance.dailyAverage >= 3 ? 'Alto' :
                   metrics.performance.dailyAverage >= 1 ? 'Médio' : 'Baixo'}
                </div>
              </div>
            </div>
            <Box height={260} className="relative">
              <LineChart
                xAxis={[{
                  data: lineChartData.labels,
                  scaleType: 'point',
                  tickLabelStyle: { fill: '#d1d5db', fontSize: 12 },
                  tickSize: 0,
                  tickRotation: -45
                }]}
                series={[{
                  data: lineChartData.values,
                  color: '#3B82F6',
                  area: true,
                  showMark: false,
                  label: 'Tarefas Criadas',
                  area: { fill: 'url(#gradient)' }
                }]}
                height={260}
                margin={{ left: 40, bottom: 40, right: 20, top: 20 }}
                sx={{
                  '.MuiChartsAxis-line': { stroke: '#6b7280' },
                  '.MuiChartsAxis-tick': { stroke: '#6b7280' },
                  '.MuiChartsAxis-tickLabel': { fill: '#d1d5db' },
                  '.MuiChartsAxis-root > line': { stroke: 'transparent' }
                }}
              >
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50" />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent>
            <Typography variant="h6" className="mb-4 text-blue-300">Tarefas por Lista</Typography>
            <Box height={260}>
              <BarChart
                series={[{
                  data: tasksByList,
                  color: '#8B5CF6',
                }]}
                xAxis={[{
                  data: listTypes,
                  scaleType: 'band',
                }]}
                height={260}
                sx={{
                  '.MuiChartsAxis-line': { stroke: '#6b7280' },
                  '.MuiChartsAxis-tick': { stroke: '#6b7280' },
                  '.MuiChartsAxis-tickLabel': { fill: '#d1d5db' },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent>
            <Typography variant="h6" className="mb-4 text-blue-300">Uso de Tags</Typography>
            <Box height={300}>
              <BarChart
                series={[
                  {
                    data: tagUsageData.map(d => d.value),
                    color: '#3B82F6',
                  },
                ]}
                xAxis={[
                  {
                    data: tagUsageData.map(d => d.label),
                    scaleType: 'band',
                  },
                ]}
                height={300}
                sx={{
                  '.MuiChartsAxis-line': { stroke: '#6b7280' },
                  '.MuiChartsAxis-tick': { stroke: '#6b7280' },
                  '.MuiChartsAxis-tickLabel': { fill: '#d1d5db' },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Atividades Recentes */}
      <Grid item xs={12} md={6}>
        <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 shadow-lg">
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="text-blue-300">Atividades Recentes</Typography>
              <Typography variant="caption" className="text-gray-300">
                Últimas {metrics.recentActivity.length} atividades
              </Typography>
            </div>
            <div className="space-y-4">
              {metrics.recentActivity.map((task, index) => (
                <div key={task.id} className="relative flex items-start gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{
                    backgroundColor: task.completed === 'c' ? '#10B981' :
                                   task.completed === 'a' ? '#F59E0B' :
                                   '#EF4444'
                  }} />
                  <div className="flex-1 ml-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Typography variant="subtitle1" className="font-medium text-white">
                          {task.title}
                        </Typography>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.completed === 'c' ? 'bg-green-400 bg-opacity-20 text-green-300' :
                            task.completed === 'a' ? 'bg-yellow-400 bg-opacity-20 text-yellow-300' :
                            'bg-red-400 bg-opacity-20 text-red-300'
                          }`}>
                            {task.completed === 'c' ? 'Concluído' :
                             task.completed === 'a' ? 'Em Progresso' :
                             'Pendente'}
                          </span>
                          <Typography variant="caption" className="text-gray-300">
                            por {task.assignee}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Typography variant="caption" className="text-gray-300">
                          {format(new Date(task.date), "dd 'de' MMM", { locale: ptBR })}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          {format(new Date(task.date), "HH:mm")}
                        </Typography>
                      </div>
                    </div>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {task.tags.map(tag => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: `${tag.color}20` || '#3b82f620',
                              color: tag.color || '#3b82f6'
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </div>
</div>
  );
}
