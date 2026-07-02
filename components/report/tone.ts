import type { Tone } from '@/types/report';

export const toneText: Record<Tone, string> = {
  blue: 'text-sky-300',
  green: 'text-emerald-300',
  amber: 'text-amber-300',
  red: 'text-rose-300',
  purple: 'text-violet-300',
};

export const toneBorder: Record<Tone, string> = {
  blue: 'border-sky-400/40',
  green: 'border-emerald-400/40',
  amber: 'border-amber-400/40',
  red: 'border-rose-400/40',
  purple: 'border-violet-400/40',
};

export const toneBadge: Record<Tone, string> = {
  blue: 'bg-sky-400/10 text-sky-200 ring-sky-300/20',
  green: 'bg-emerald-400/10 text-emerald-200 ring-emerald-300/20',
  amber: 'bg-amber-400/10 text-amber-200 ring-amber-300/20',
  red: 'bg-rose-400/10 text-rose-200 ring-rose-300/20',
  purple: 'bg-violet-400/10 text-violet-200 ring-violet-300/20',
};
