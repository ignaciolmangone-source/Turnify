import { env } from '../config/env.js';

// ---- Horas "HH:mm" <-> minutos desde las 00:00 ----
export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// ---- Fechas de turnos ----
// Guardamos el día a las 12:00 UTC. Así, convertido a cualquier huso de Argentina
// (UTC-3), sigue siendo el mismo día. Antes se guardaba a las 00:00 UTC y en el
// navegador aparecía el día anterior.
export const dayToDb = (yyyyMmDd: string) => new Date(`${yyyyMmDd}T12:00:00.000Z`);

// Día de la semana (0 = domingo) de una fecha "AAAA-MM-DD"
export const dayOfWeek = (yyyyMmDd: string) => dayToDb(yyyyMmDd).getUTCDay();

// Fecha y hora actuales en la zona horaria del negocio (por defecto Buenos Aires)
export function nowInAppTz() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: env.APP_TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

// ¿El momento (fecha + hora) ya pasó?
export function isPast(yyyyMmDd: string, hhmm: string) {
  const now = nowInAppTz();
  if (yyyyMmDd !== now.date) return yyyyMmDd < now.date;
  return toMinutes(hhmm) <= now.minutes;
}
