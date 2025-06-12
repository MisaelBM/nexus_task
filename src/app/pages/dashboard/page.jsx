"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, PieChart } from '@mui/x-charts';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Header from '../../../components/headerLogIn';
import Sidebar from '@/components/sidebar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsTasks, setTagsTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
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

        setTasks(tasksRes.data);
        setTags(tagsRes.data);
        setTagsTasks(tagsTasksRes.data);

        // Calcula as métricas
        const completedTasks = tasksRes.data.filter(task => task.completed === 'c').length;
        const inProgressTasks = tasksRes.data.filter(task => task.completed === 'a').length;
        const pendingTasks = tasksRes.data.filter(task => task.completed === 'p').length;

        setMetrics({
          totalTasks: tasksRes.data.length,
          completedTasks,
          pendingTasks,
          inProgressTasks,
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Prepara dados para os gráficos
  const taskStatusData = [
    { id: 0, value: metrics.completedTasks, label: 'Concluídas' },
    { id: 1, value: metrics.inProgressTasks, label: 'Em Andamento' },
    { id: 2, value: metrics.pendingTasks, label: 'Pendentes' },
  ];

  // Dados para o gráfico de tags
  const tagUsageData = tags.map(tag => ({
    id: tag.id,
    value: tagsTasks.filter(tt => tt.tag_id === tag.id).length,
    label: tag.name,
  }));

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-900 text-white">
      <Header isActive={[true, false, false]} />
      <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

      <div className="flex-1 p-6 ml-16 overflow-auto">
        <Typography variant="h4" className="mb-6">Dashboard</Typography>

        <Grid container spacing={3}>
          {/* Cards de métricas */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-[#1F2B3E] text-white">
              <CardContent>
                <Typography variant="h6">Total de Tarefas</Typography>
                <Typography variant="h4">{metrics.totalTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-[#1F2B3E] text-white">
              <CardContent>
                <Typography variant="h6">Tarefas Concluídas</Typography>
                <Typography variant="h4">{metrics.completedTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-[#1F2B3E] text-white">
              <CardContent>
                <Typography variant="h6">Em Andamento</Typography>
                <Typography variant="h4">{metrics.inProgressTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-[#1F2B3E] text-white">
              <CardContent>
                <Typography variant="h6">Pendentes</Typography>
                <Typography variant="h4">{metrics.pendingTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráficos */}
          <Grid item xs={12} md={6}>
            <Card className="bg-[#1F2B3E] text-white">
              <CardContent>
                <Typography variant="h6" className="mb-4">Status das Tarefas</Typography>
                <Box height={300}>
                  <PieChart
                    series={[
                      {
                        data: taskStatusData,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                      },
                    ]}
                    height={300}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="bg-[#1F2B3E] text-white">
              <CardContent>
                <Typography variant="h6" className="mb-4">Uso de Tags</Typography>
                <Box height={300}>
                  <BarChart
                    series={[
                      {
                        data: tagUsageData.map(d => d.value),
                      },
                    ]}
                    xAxis={[
                      {
                        data: tagUsageData.map(d => d.label),
                        scaleType: 'band',
                      },
                    ]}
                    height={300}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
