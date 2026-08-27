import React, { useState } from 'react';
import {
  KanbanSquare,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  Tag,
  Search,
  Cpu,
} from 'lucide-react';
import { ProjectTask, TaskStatus, TaskPriority } from '../../types';

interface ProjectsViewProps {
  tasks: ProjectTask[];
  onOpenNewTask: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  tasks,
  onOpenNewTask,
  onUpdateTaskStatus,
  onToggleSubtask,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'Backlog', title: 'Backlog & Ideias', color: 'border-zinc-700' },
    { status: 'Em Progresso', title: 'Em Andamento', color: 'border-[#8B5CF6]/50' },
    { status: 'Em Revisão', title: 'Em Validação / QA', color: 'border-[#6D28D9]/50' },
    { status: 'Concluído', title: 'Entregue / Concluído', color: 'border-emerald-500/50' },
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgente':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Alta':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Média':
        return 'bg-[#8B5CF6]/20 text-[#DDD6FE] border-[#8B5CF6]/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Control bar */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#0A0A0B] px-3.5 py-2 rounded-xl border border-zinc-700/80 focus-within:border-[#8B5CF6]/50 transition-colors">
          <Search className="w-4 h-4 text-[#A78BFA] shrink-0" />
          <input
            type="text"
            placeholder="Buscar tarefas, projetos IoT ou responsáveis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        {/* Priority Filter & New Task */}
        <div className="flex items-center gap-2.5">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#0A0A0B] border border-zinc-700/80 text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#8B5CF6]/50"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="Urgente">Urgente</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col, colIdx) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-2xl bg-[#1C1C1E] border border-[#8B5CF6]/15 p-3.5 min-h-[500px] shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{col.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#0A0A0B] text-[#C4B5FD] font-semibold border border-zinc-800 font-mono">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => {
                  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
                  const totalSubtasks = task.subtasks.length;
                  const progressPct = totalSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-[#0A0A0B] border border-zinc-800/90 hover:border-[#8B5CF6]/50 transition-all shadow-sm space-y-3 group"
                    >
                      {/* Priority and Project badge */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold text-[#A78BFA] uppercase tracking-wider">
                          {task.project}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-[#C4B5FD] transition-colors leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Subtasks Progress */}
                      {totalSubtasks > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400">
                            <span>Checklist ({completedSubtasks}/{totalSubtasks})</span>
                            <span className="font-mono text-[#C4B5FD]">{progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden border border-zinc-800">
                            <div
                              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>

                          {/* Quick subtask checklist items */}
                          <div className="space-y-1 pt-1">
                            {task.subtasks.map((st) => (
                              <button
                                key={st.id}
                                onClick={() => onToggleSubtask(task.id, st.id)}
                                className="w-full flex items-center gap-2 text-[11px] text-left hover:text-white transition-colors cursor-pointer"
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    st.completed ? 'text-[#8B5CF6] fill-[#8B5CF6]/20' : 'text-zinc-600'
                                  }`}
                                />
                                <span className={st.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}>
                                  {st.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assignee & Due Date */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-[#8B5CF6]/40"
                            title={`${task.assignee.name} (${task.assignee.role})`}
                          />
                          <span className="text-[11px] text-zinc-400 truncate max-w-[90px]">
                            {task.assignee.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                          <Calendar className="w-3 h-3 text-[#A78BFA]" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>

                      {/* Move Column Arrows */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500">
                        {colIdx > 0 ? (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, columns[colIdx - 1].status)}
                            className="flex items-center gap-0.5 hover:text-zinc-300 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3 h-3" />
                            <span>Voltar</span>
                          </button>
                        ) : <div />}

                        {colIdx < columns.length - 1 && (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, columns[colIdx + 1].status)}
                            className="flex items-center gap-0.5 text-[#A78BFA] hover:text-[#C4B5FD] font-semibold transition-colors cursor-pointer"
                          >
                            <span>Avançar</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-36 border-2 border-dashed border-zinc-800/60 rounded-xl flex items-center justify-center text-xs text-zinc-600">
                    Nenhuma tarefa nesta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
