import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Wrench as Tool, ListChecks, ClipboardList, Plus, Search, Bell, Settings, Building, User, ChevronDown, ChevronUp, MessageSquare, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/views/DashboardView';
import IncidentsView from '@/components/views/IncidentsView';
import TasksView from '@/components/views/TasksView';
import CleaningView from '@/components/views/CleaningView';

const initialIncidents = [
  {
    id: 1,
    title: 'Fuga de agua en baño planta 2',
    residence: 'Residencia Sol Radiante',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Carlos Pérez',
    reportedDate: '2025-06-18',
    description: 'Fuga constante en el grifo del lavabo. Requiere atención urgente.'
  },
  {
    id: 2,
    title: 'Luz parpadeante pasillo principal',
    residence: 'Edificio El Roble',
    status: 'progress',
    priority: 'medium',
    assignedTo: 'Ana Gómez',
    reportedDate: '2025-06-17',
    description: 'La luz del pasillo principal parpadea intermitentemente.'
  },
  {
    id: 3,
    title: 'Caldera no enciende',
    residence: 'Apartamentos La Sierra',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Luis Rodríguez',
    reportedDate: '2025-06-15',
    description: 'La caldera central del edificio no funciona. Revisada y reparada.'
  }
];

const initialTasks = [
  {
    id: 1,
    title: 'Revisar sistema de riego jardín',
    type: 'maintenance',
    priority: 'low',
    assignedTo: 'Laura Martín',
    dueDate: '2025-06-25',
    status: 'pending',
    details: 'Inspección programada del sistema de riego automático.'
  },
  {
    id: 2,
    title: 'Pintar pared dañada habitación 101',
    type: 'repair',
    priority: 'medium',
    assignedTo: 'Jorge Sanz',
    dueDate: '2025-06-22',
    status: 'progress',
    details: 'Reparar y pintar la pared afectada por humedad en la habitación 101.'
  }
];

const initialCleaningJobs = [
  {
    id: 1,
    area: 'Recepción y zonas comunes',
    type: 'daily',
    responsible: 'Equipo Limpieza A',
    lastCleaned: '2025-06-19',
    nextCleanDue: '2025-06-20',
    status: 'pending'
  },
  {
    id: 2,
    area: 'Gimnasio y vestuarios',
    type: 'deep',
    responsible: 'Equipo Limpieza B',
    lastCleaned: '2025-06-15',
    nextCleanDue: '2025-06-22',
    status: 'completed'
  }
];


function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [incidents, setIncidents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [cleaningJobs, setCleaningJobs] = useState([]);

  useEffect(() => {
    const savedIncidents = localStorage.getItem('nexusIncidents');
    const savedTasks = localStorage.getItem('nexusTasks');
    const savedCleaningJobs = localStorage.getItem('nexusCleaningJobs');

    setIncidents(savedIncidents ? JSON.parse(savedIncidents) : initialIncidents);
    setTasks(savedTasks ? JSON.parse(savedTasks) : initialTasks);
    setCleaningJobs(savedCleaningJobs ? JSON.parse(savedCleaningJobs) : initialCleaningJobs);

    if (!savedIncidents) localStorage.setItem('nexusIncidents', JSON.stringify(initialIncidents));
    if (!savedTasks) localStorage.setItem('nexusTasks', JSON.stringify(initialTasks));
    if (!savedCleaningJobs) localStorage.setItem('nexusCleaningJobs', JSON.stringify(initialCleaningJobs));
  }, []);
  
  const handleShowToast = (title, description, variant = 'default') => {
    toast({
      title: title || "🚧 Función no implementada",
      description: description || "¡Puedes solicitarla en tu próximo prompt! 🚀",
      variant: variant,
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('nexusTasks', JSON.stringify(updatedTasks));
    handleShowToast(
      "Tarea Actualizada",
      `La tarea #${taskId} ha sido marcada como ${newStatus === 'completed' ? 'Completada' : newStatus}.`,
      'success' 
    );
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Wrench },
    { id: 'incidents', label: 'Incidencias', icon: Tool },
    { id: 'tasks', label: 'Tareas', icon: ListChecks },
    { id: 'cleaning', label: 'Limpieza', icon: ClipboardList },
    { id: 'ai', label: 'AI Asistente', icon: Brain, action: () => handleShowToast("Asistente IA", "Integración con IA y WhatsApp para atención automática.")},
    { id: 'contact', label: 'Contacto & Demo', icon: MessageSquare, action: () => handleShowToast("Contacto & Demo", "Formularios de contacto y solicitud de demos.")}
  ];
  
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView incidents={incidents} tasks={tasks} cleaningJobs={cleaningJobs} handleShowToast={handleShowToast}/>;
      case 'incidents':
        return <IncidentsView incidents={incidents} setIncidents={setIncidents} handleShowToast={handleShowToast} />;
      case 'tasks':
        return <TasksView tasks={tasks} setTasks={setTasks} handleShowToast={handleShowToast} updateTaskStatus={updateTaskStatus} />;
      case 'cleaning':
        return <CleaningView cleaningJobs={cleaningJobs} setCleaningJobs={setCleaningJobs} handleShowToast={handleShowToast} />;
      default:
        return <DashboardView incidents={incidents} tasks={tasks} cleaningJobs={cleaningJobs} handleShowToast={handleShowToast}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100">
      <Helmet>
        <title>NEXUS Task - Gestión Inteligente de Mantenimiento</title>
        <meta name="description" content="NEXUS Task: Plataforma líder para la gestión de incidencias, tareas y limpieza en empresas de mantenimiento y residencias. Automatización y eficiencia." />
      </Helmet>

      <Header appName="NEXUS Task" handleShowToast={handleShowToast} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar navigationItems={navigationItems} activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {renderView()}
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;