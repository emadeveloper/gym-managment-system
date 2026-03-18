import React from 'react';
import { Copy, Plus, Search, UserRound } from 'lucide-react';
import { Card } from '../../../../ui/Card';
import { TemplateBuilder } from './TemplateBuilder';

export function TemplatesTabContent({
  templateSearch,
  setTemplateSearch,
  setEditingTemplateId,
  setIsBuildingTemplate,
  EMPTY_TEMPLATE,
  isBuildingTemplate,
  templateDraft,
  setTemplateDraft,
  exerciseLibrary,
  isSavingTemplate,
  handleTemplateSubmit,
  filteredTemplates,
  handleClone,
  handleEditTemplate,
  openConfirmDialog,
  setAssignmentDraft,
  assignmentDraft,
  routineTemplates,
  assignableMembers,
  handleAssignTemplate,
}) {
  return (
    <div className="space-y-4">
      <Card className="border border-gray-800 bg-surface p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={templateSearch}
              onChange={(event) => setTemplateSearch(event.target.value)}
              placeholder="Buscar plantillas por nombre, objetivo o nivel"
              className="w-full bg-transparent text-sm text-gray-200"
            />
          </label>
          <button
            onClick={() => {
              setEditingTemplateId(null);
              setTemplateDraft(EMPTY_TEMPLATE);
              setIsBuildingTemplate(true);
            }}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva plantilla
          </button>
        </div>
      </Card>

      {isBuildingTemplate ? (
        <TemplateBuilder
          value={templateDraft}
          setValue={setTemplateDraft}
          exerciseLibrary={exerciseLibrary}
          onCancel={() => {
            setIsBuildingTemplate(false);
            setEditingTemplateId(null);
            setTemplateDraft(EMPTY_TEMPLATE);
          }}
          onSubmit={handleTemplateSubmit}
          saving={isSavingTemplate}
        />
      ) : null}

      <h2 className="text-center text-2xl font-heading font-semibold uppercase tracking-[0.12em] text-white">
        Plantillas Creadas
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="border border-gray-800 bg-surface p-5 text-center">
            <div className="flex flex-col items-center gap-3">
              <div>
                <p className="text-sm font-heading font-semibold uppercase text-white">{template.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                  {template.objective} · {template.level}
                </p>
              </div>
              <span className="rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                {template.daysPerWeek} días/sem
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-400">{template.description || 'Sin descripción.'}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleClone(template)}
                className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300"
              >
                <Copy className="mr-1 h-3.5 w-3.5" /> Clonar
              </button>
              <button
                onClick={() => handleEditTemplate(template)}
                className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300"
              >
                Editar
              </button>
              <button
                onClick={() =>
                  openConfirmDialog({
                    title: 'Eliminar plantilla',
                    description: `Vas a eliminar "${template.name}". Esta acción no se puede deshacer.`,
                    actionType: 'template',
                    targetId: template.id,
                  })
                }
                className="inline-flex h-9 items-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-300"
              >
                Eliminar
              </button>
              <button
                onClick={() =>
                  setAssignmentDraft((current) => ({ ...current, templateId: template.id }))
                }
                className="inline-flex h-9 items-center rounded-xl border border-primary/30 bg-primary/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                Usar para asignar
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-800 bg-surface p-5">
        <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">Asignar plantilla a usuario</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          <select
            value={assignmentDraft.templateId}
            onChange={(event) =>
              setAssignmentDraft((current) => ({ ...current, templateId: event.target.value }))
            }
            className="h-11 rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          >
            <option value="">Seleccionar plantilla</option>
            {routineTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <select
            value={assignmentDraft.assignedMemberEmail}
            onChange={(event) =>
              setAssignmentDraft((current) => ({ ...current, assignedMemberEmail: event.target.value }))
            }
            className="h-11 rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          >
            <option value="">Seleccionar usuario</option>
            {assignableMembers.map((member) => (
              <option key={member.id} value={member.email}>
                {member.name}
              </option>
            ))}
          </select>
          <input
            value={assignmentDraft.coach}
            onChange={(event) =>
              setAssignmentDraft((current) => ({ ...current, coach: event.target.value }))
            }
            placeholder="Coach responsable"
            className="h-11 rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
          <button
            onClick={handleAssignTemplate}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            <UserRound className="mr-2 h-4 w-4" /> Asignar ahora
          </button>
        </div>
      </Card>
    </div>
  );
}
