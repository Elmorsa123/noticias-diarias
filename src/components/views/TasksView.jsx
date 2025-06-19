import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ChevronDown, ChevronUp, ListChecks, AlertTriangle, CheckCircle, Clock, User as UserIcon, CalendarDays, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TaskCard = ({ task, onToggleDetails, expanded, handleShowToast, onUpdateStatus }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { text: 'Pendiente', Icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' };
      case 'progress': return { text: 'En Progreso', Icon: AlertTriangle, color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' };
      case 'completed': return { text: 'Completada', Icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30' };
      default: return { text: 'Desconocido', Icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/20 border-gray-500/30' };
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high': return { text: 'Alta', color: 'text-red-400' };
      case 'medium': return { text: 'Media', color: 'text-orange-400' };
      case 'low': return { text: 'Baja', color: 'text-sky-400' };
      default: return { text: 'Normal', color: 'text-gray-400' };
    }
  };
  
  const getTaskTypeLabel = (type) => {
    const labels = {
      maintenance: 'Mantenimiento',
      repair: 'Reparación',
      cleaning: 'Limpieza',
      inspection: 'Inspección'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const statusInfo = getStatusInfo(task.status);
  const priorityInfo = getPriorityInfo(task.priority);

  const handleCompleteTask = (e) => {
    e.stopPropagation(); 
    if (task.status !== 'completed') {
      onUpdateStatus(task.id, 'completed');
    } else {
      handleShowToast("Tarea ya completada", `La tarea "${task.title}" ya está marcada como completada.`, "info");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 overflow-hidden"
    >
      <div className="p-5 cursor-pointer" onClick={() => onToggleDetails(task.id)}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-100 mb-2 sm:mb-0">{task.title}</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center ${statusInfo.bg} ${statusInfo.color}`}>
              <statusInfo.Icon className="w-3.5 h-3.5 mr-1.5" />
              {statusInfo.text}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className={`flex items-center font-medium ${priorityInfo.color}`}><AlertTriangle className="w-3.5 h-3.5 mr-1" />Prioridad: {priorityInfo.text}</span>
            <span className="flex items-center"><Tag className="w-3.5 h-3.5 mr-1" />Tipo: {getTaskTypeLabel(task.type)}</span>
            <span className="flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1" />Vence: {task.dueDate}</span>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-700"
          >
            <div className="p-5 space-y-3">
              <p className="text-sm text-slate-300">{task.details}</p>
              <div className="text-xs text-slate-400">
                <span className="flex items-center"><UserIcon className="w-3.5 h-3.5 mr-1" /> Asignado a: {task.assignedTo || 'No asignado'}</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={(e) => { e.stopPropagation(); handleShowToast("Editar Tarea", `Función para editar: ${task.title}`)}}>
                  Editar
                </Button>
                {task.status !== 'completed' && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600" 
                    onClick={handleCompleteTask}
                  >
                    Marcar como Finalizada
                  </Button>
                )}
                 {task.status === 'completed' && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" 
                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, 'pending');}}
                  >
                    Reabrir Tarea
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => onToggleDetails(task.id)} 
        className="w-full py-2 px-5 text-xs text-slate-400 hover:bg-slate-700/50 flex items-center justify-center transition-colors"
        aria-expanded={expanded}
        aria-controls={`task-details-${task.id}`}
      >
        {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
        {expanded ? 'Ocultar Detalles' : 'Ver Detalles'}
      </button>
    </motion.div>
  );
};

const TasksView = ({ tasks, setTasks, handleShowToast, updateTaskStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const handleToggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(task => filterPriority === 'all' || task.priority === filterPriority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500 text-sm"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2.5 border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' class='w-5 h-5 text-slate-400'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
            >
              <option value="all" className="bg-slate-700 text-slate-200">Todas las Prioridades</option>
              <option value="high" className="bg-slate-700 text-slate-200">Alta</option>
              <option value="medium" className="bg-slate-700 text-slate-200">Media</option>
              <option value="low" className="bg-slate-700 text-slate-200">Baja</option>
            </select>
          </div>
          <Button 
            onClick={() => handleShowToast("Nueva Tarea", "Formulario para crear nueva tarea.")} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-md w-full md:w-auto text-sm py-2.5"
          >
            <Plus className="w-4.5 h-4.5 mr-2" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid gap-5">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                onToggleDetails={handleToggleDetails} 
                expanded={expandedId === task.id}
                handleShowToast={handleShowToast} 
                onUpdateStatus={updateTaskStatus}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10">
            <ListChecks className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No se encontraron tareas</h3>
            <p className="text-slate-500">Intenta ajustar los filtros o crea una nueva tarea.</p>
        </div>
      )}
    </motion.div>
  );
};

export default TasksView;