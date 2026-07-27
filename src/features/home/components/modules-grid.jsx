import { HOME_MODULES } from '../constants/modules';
import { ModuleCard } from './module-card';

export function ModulesGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {HOME_MODULES.map((module) => (
        <ModuleCard key={module.key} moduleKey={module.key} label={module.label} icon={module.icon} href={module.href} />
      ))}
    </div>
  );
}
