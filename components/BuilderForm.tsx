'use client';

import { RotateCw } from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { BuilderDetails } from '../types/builder';

interface BuilderFormProps {
  themeConfig: ThemeConfig;
  values: BuilderDetails;
  onValueChange: (field: keyof BuilderDetails, value: string) => void;
  title?: string;
  onRegenerateTitle?: () => void;
}

export function BuilderForm({ 
  themeConfig, 
  values, 
  onValueChange,
  title = 'CODE NINJA',
  onRegenerateTitle
}: BuilderFormProps) {
  const isGoa = themeConfig.id === 'goa';

  const inputClass = isGoa
    ? `
        w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border-2 border-[#083C26] text-[#083C26] font-semibold text-sm placeholder-[#3D6852]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2E93] focus:border-[#FF2E93] transition-all
      `
    : `
        w-full px-4 py-3 rounded-lg bg-[#182029] border border-white/10 text-[#F2EFE9] font-medium text-sm placeholder-[#8B959A]/40 focus:outline-none focus:ring-1 focus:ring-[#E05A1F] focus:border-[#E05A1F] transition-all
      `;

  const labelClass = isGoa
    ? 'block text-xs font-black uppercase tracking-wider text-[#FF2E93] mb-1.5'
    : 'block text-xs font-bold uppercase tracking-widest text-[#E05A1F] mb-1.5';

  return (
    <div className="w-full space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="builder-name" className={labelClass}>
          NAME
        </label>
        <input
          id="builder-name"
          type="text"
          maxLength={24}
          value={values.name}
          onChange={(e) => onValueChange('name', e.target.value)}
          placeholder="e.g. Aryan Patel"
          className={inputClass}
          required
        />
      </div>

      {/* Role Input */}
      <div>
        <label htmlFor="builder-role" className={labelClass}>
          ROLE
        </label>
        <input
          id="builder-role"
          type="text"
          maxLength={26}
          value={values.role}
          onChange={(e) => onValueChange('role', e.target.value)}
          placeholder="e.g. Frontend Wizard"
          className={inputClass}
          required
        />
      </div>

      {/* Tech Stack Input */}
      <div>
        <label htmlFor="builder-tech" className={labelClass}>
          TECH STACK
        </label>
        <input
          id="builder-tech"
          type="text"
          maxLength={38}
          value={values.techStack}
          onChange={(e) => onValueChange('techStack', e.target.value)}
          placeholder="e.g. React • Next.js • Python"
          className={inputClass}
          required
        />
      </div>

      {/* Builder Title Input (Replacing Vibe/Spirit/Passion) */}
      <div>
        <label htmlFor="builder-title" className={labelClass}>
          BUILDER TITLE
        </label>
        <div className="flex gap-2.5 relative items-center">
          <input
            id="builder-title"
            type="text"
            readOnly
            value={title}
            className={isGoa 
              ? "w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border-2 border-[#083C26] text-[#083C26] font-semibold text-sm placeholder-[#3D6852]/50 focus:outline-none select-all"
              : "w-full px-4 py-3 rounded-lg bg-[#182029] border border-white/10 text-[#F2EFE9] font-cinzel font-black uppercase text-sm focus:outline-none select-all"}
          />
          <button
            type="button"
            onClick={onRegenerateTitle}
            className={isGoa
              ? "absolute right-2 p-2 bg-[#FFE566] hover:bg-[#FF2E93] hover:text-white text-[#083C26] rounded-lg transition-all border-2 border-[#083C26] cursor-pointer flex items-center justify-center"
              : "absolute right-2 p-2 bg-[#1D2633] hover:bg-[#E05A1F] hover:text-[#F2EFE9] text-[#8B959A] rounded-md transition-all border border-white/5 cursor-pointer flex items-center justify-center"}
            title="Regenerate Title"
            aria-label="Regenerate Title"
          >
            <RotateCw className="w-4 h-4 animate-hover-spin" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default BuilderForm;
