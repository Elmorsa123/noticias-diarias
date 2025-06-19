import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, ClipboardList, Users, CalendarDays, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CleaningJobCard = ({ job, handleShowToast }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { text: 'Pendiente', Icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' };
      case 'completed': return { text: 'Realizada', Icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30' };
      default: return { text: 'Desconocido', Icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/20 border-gray-500/30' };
    }
  };

  const getCleaningTypeLabel = (type) => {
    const labels = {
      daily: 'Diaria',
      deep: 'A Fondo',
      scheduled: 'Programada'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const statusInfo = getStatusInfo(job.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 p-5"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{job.area}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${job.type === 'deep' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
            Limpieza {getCleaningTypeLabel(job.type)}
          </span>
        </div>
        <span className={`mt-2 sm:mt-0 px-2.5 py-1 text-xs font-medium rounded-full flex items-center self-start ${statusInfo.bg} ${statusInfo.color}`}>
          <statusInfo.Icon className="w-3.5 h-3.5 mr-1.5" />
          {statusInfo.text}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-slate-400 mb-4">
        <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-slate-500" />Responsable: {job.responsible}</div>
        <div className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-slate-500" />Última limpieza: {job.lastCleaned}</div>
        <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-slate-500" />Próxima limpieza: {job.nextCleanDue}</div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={() => handleShowToast("Ver Historial", `Historial de limpieza para: ${job.area}`)}>
          Historial
        </Button>
        {job.status === 'pending' && (
          <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600" onClick={() => handleShowToast("Marcar como Realizada", `Marcar limpieza de ${job.area} como realizada.`)}>
            Marcar Realizada
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const CleaningView = ({ cleaningJobs, setCleaningJobs, handleShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'daily', 'deep'

  const filteredCleaningJobs = cleaningJobs
    .filter(job => 
      job.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.responsible.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(job => filterType === 'all' || job.type === filterType);

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
                placeholder="Buscar por área o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500 text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' class='w-5 h-5 text-slate-400'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
            >
              <option value="all" className="bg-slate-700 text-slate-200">Todos los Tipos</option>
              <option value="daily" className="bg-slate-700 text-slate-200">Diaria</option>
              <option value="deep" className="bg-slate-700 text-slate-200">A Fondo</option>
            </select>
          </div>
          <Button 
            onClick={() => handleShowToast("Nueva Tarea de Limpieza", "Formulario para programar nueva tarea de limpieza.")} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-md w-full md:w-auto text-sm py-2.5"
          >
            <Plus className="w-4.5 h-4.5 mr-2" />
            Programar Limpieza
          </Button>
        </div>
      </div>

      {filteredCleaningJobs.length > 0 ? (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredCleaningJobs.map(job => (
              <CleaningJobCard key={job.id} job={job} handleShowToast={handleShowToast} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10">
            <ClipboardList className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No se encontraron tareas de limpieza</h3>
            <p className="text-slate-500">Intenta ajustar los filtros o programa una nueva limpieza.</p>
        </div>
      )}
    </motion.div>
  );
};

export default CleaningView;