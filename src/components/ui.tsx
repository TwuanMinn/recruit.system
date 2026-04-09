import React from 'react';
import type { ColorSet, InterviewStatus } from '../types';
import { confirmColors } from '../constants';

// ===== Material Icon =====
interface IconProps {
  name: string;
  className?: string;
  size?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = '' }) => (
  <span className={`material-symbols-outlined ${size} ${className}`}>{name}</span>
);

// ===== Badge =====
interface BadgeProps {
  label: string;
  colors: ColorSet;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, colors, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold glass-float whitespace-nowrap ${className}`}
    style={{
      color: colors.text,
      border: `1px solid ${colors.border || colors.text}20`,
    }}
  >
    {label}
  </span>
);

// ===== Status Dot =====
interface StatusDotProps {
  label: string;
  color: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ label, color }) => (
  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color }}>
    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
    {label}
  </span>
);

// ===== Input =====
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/80 mb-1.5">
      {label}
    </label>
    <input
      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/20 rounded-xl text-sm text-on-surface font-medium placeholder:text-on-surface/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      {...props}
    />
  </div>
);

// ===== TextArea =====
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/80 mb-1.5">
      {label}
    </label>
    <textarea
      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/20 rounded-xl text-sm text-on-surface font-medium placeholder:text-on-surface/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y min-h-[80px]"
      rows={3}
      {...props}
    />
  </div>
);

// ===== Select =====
interface SelectOption {
  value: string;
  label: string;
}

interface SelProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export const Sel: React.FC<SelProps> = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/80 mb-1.5">
      {label}
    </label>
    <select
      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/20 rounded-xl text-sm text-on-surface font-medium focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

// ===== Button =====
type BtnVariant = 'primary' | 'success' | 'danger' | 'ghost' | 'pdf' | 'tonal';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  icon?: string;
}

const variantMap: Record<BtnVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-lg shadow-primary/20',
  success: 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20',
  danger: 'bg-error text-on-error shadow-lg shadow-error/20',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low',
  pdf: 'bg-error text-on-error shadow-lg shadow-error/20',
  tonal: 'bg-surface-container-highest text-on-surface',
};

export const Btn: React.FC<BtnProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => (
  <button
    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform ${variantMap[variant]} ${className}`}
    {...props}
  >
    {icon && <Icon name={icon} className="text-lg" />}
    {children}
  </button>
);

// ===== Confirm Picker =====
interface ConfirmPickerProps {
  value: InterviewStatus;
  onChange: (v: InterviewStatus) => void;
}

const statusOptions: InterviewStatus[] = ['Confirmed', 'Rejected', 'No Response'];
const statusConfig: Record<InterviewStatus, { icon: string; color: string; bg: string }> = {
  Confirmed: { icon: 'check_circle', color: '#006d4a', bg: 'bg-secondary-container/30' },
  Rejected: { icon: 'cancel', color: '#ac3149', bg: 'bg-error-container/30' },
  'No Response': { icon: 'schedule', color: '#416188', bg: 'bg-surface-container' },
};

export const ConfirmPicker: React.FC<ConfirmPickerProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/50 mb-2">
      Interview Status
    </label>
    <div className="flex gap-3">
      {statusOptions.map((opt) => {
        const cfg = statusConfig[opt];
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-3 px-3 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 text-sm font-bold active:scale-95 ${
              selected
                ? `${cfg.bg} border-2 ring-2 ring-offset-1`
                : 'bg-surface-container-lowest border-2 border-outline-variant/10 text-on-surface/40 hover:text-on-surface/70'
            }`}
            style={selected ? { color: cfg.color, borderColor: cfg.color, ringColor: `${cfg.color}33` } : undefined}
          >
            <Icon name={cfg.icon} className="text-lg" />
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

// ===== Format Salary =====
export function formatSalary(v: string | number): string {
  return v ? Number(v).toLocaleString('en-US') : '';
}
