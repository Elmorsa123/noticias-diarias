import React from 'react';
import { motion } from 'framer-motion';
import { Wrench as Tool, ListChecks, ClipboardList, ArrowRight, Zap, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
const StatCard = ({
  title,
  value,
  icon,
  color,
  unit,
  onClick
}) => <motion.div whileHover={{
  scale: 1.05,
  boxShadow: "0px 10px 20px rgba(0,0,0,0.2)"
}} onClick={onClick} className={`bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700 cursor-pointer transform transition-all duration-300 ease-in-out`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className={`text-3xl font-bold bg-gradient-to-r ${color} text-transparent bg-clip-text`}>
          {value} <span className="text-lg text-slate-500">{unit}</span>
        </p>
      </div>
      <div className={`p-3 bg-gradient-to-br ${color} rounded-full shadow-md`}>
        {React.createElement(icon, {
        className: "w-6 h-6 text-white"
      })}
      </div>
    </div>
  </motion.div>;
const RecentActivityItem = ({
  title,
  type,
  status,
  date,
  icon,
  statusColor,
  onClick
}) => <motion.div initial={{
  opacity: 0,
  x: -20
}} animate={{
  opacity: 1,
  x: 0
}} onClick={onClick} className="flex items-center justify-between p-4 bg-slate-800 rounded-xl hover:bg-slate-700/70 transition-colors cursor-pointer border border-slate-700 shadow-md">
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-full ${statusColor}`}>
        {React.createElement(icon, {
        className: "w-5 h-5 text-white"
      })}
      </div>
      <div>
        <h3 className="font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400">{type} - {date}</p>
      </div>
    </div>
    <div className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor} bg-opacity-20`}>
      {status}
    </div>
  </motion.div>;
const getStatusDetails = status => {
  switch (status) {
    case 'pending':
      return {
        text: 'Pendiente',
        icon: Clock,
        color: 'bg-yellow-500/80'
      };
    case 'progress':
      return {
        text: 'En Progreso',
        icon: AlertTriangle,
        color: 'bg-blue-500/80'
      };
    case 'completed':
      return {
        text: 'Completado',
        icon: CheckCircle,
        color: 'bg-green-500/80'
      };
    default:
      return {
        text: 'Desconocido',
        icon: Clock,
        color: 'bg-gray-500/80'
      };
  }
};
const DashboardView = ({
  incidents,
  tasks,
  cleaningJobs,
  handleShowToast
}) => {
  const openIncidents = incidents.filter(i => i.status !== 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const dueCleaning = cleaningJobs.filter(c => c.status === 'pending').length;
  const recentActivities = [...incidents.slice(0, 2).map(i => ({
    title: i.title,
    type: `Incidencia en ${i.residence}`,
    status: getStatusDetails(i.status).text,
    date: i.reportedDate,
    icon: getStatusDetails(i.status).icon,
    statusColor: getStatusDetails(i.status).color,
    onClick: () => handleShowToast("Ver Incidencia", `Detalles de: ${i.title}`)
  })), ...tasks.slice(0, 1).map(t => ({
    title: t.title,
    type: `Tarea: ${t.type}`,
    status: getStatusDetails(t.status).text,
    date: t.dueDate,
    icon: getStatusDetails(t.status).icon,
    statusColor: getStatusDetails(t.status).color,
    onClick: () => handleShowToast("Ver Tarea", `Detalles de: ${t.title}`)
  }))].sort((a, b) => new Date(b.date) - new Date(a.date));
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Incidencias Abiertas" value={openIncidents} icon={Tool} color="from-red-500 to-orange-500" onClick={() => handleShowToast("Ver Incidencias", "Navegar a la sección de incidencias.")} />
        <StatCard title="Tareas Pendientes" value={pendingTasks} icon={ListChecks} color="from-blue-500 to-sky-500" onClick={() => handleShowToast("Ver Tareas", "Navegar a la sección de tareas.")} />
        <StatCard title="Limpiezas Programadas" value={dueCleaning} icon={ClipboardList} color="from-green-500 to-teal-500" onClick={() => handleShowToast("Ver Limpieza", "Navegar a la sección de limpieza.")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Incidencias</h2>
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={() => handleShowToast("Ver Toda la Actividad", "Próximamente: Historial completo de actividad.")} className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center">
              Ver todo <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => <RecentActivityItem key={index} {...activity} />)}
            {recentActivities.length === 0 && <p className="text-slate-400 text-center py-4">No hay actividad reciente.</p>}
          </div>
        </div>
        
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Asistente IA</h2>
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-slate-300 mb-4 text-sm">
            Nuestro asistente inteligente está aquí para ayudarte a optimizar la gestión de mantenimiento.
          </p>
          <ul className="space-y-2 text-sm text-slate-400 mb-6">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
              <span>Priorización automática de tareas.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
              <span>Sugerencias proactivas de mantenimiento.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
              <span>Integración con WhatsApp para respuestas rápidas (próximamente).</span>
            </li>
          </ul>
           <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={() => handleShowToast("Interactuar con IA", "Próximamente: Interfaz de chat con el asistente IA.")} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all">
            Hablar con el Asistente
          </motion.button>
        </div>
      </div>
    </motion.div>;
};
export default DashboardView;