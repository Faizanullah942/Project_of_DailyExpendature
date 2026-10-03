/**
 * Date and Time utilities for real-time UTC timestamping and display across the application.
 */

export const getLiveUtcTimeString = (d: Date = new Date()): string => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}:${s} UTC`;
};

export const getUtcTimeOnly = (d: Date = new Date()): string => {
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');
  return `${h}:${min}:${s} UTC`;
};

export const getUtcDateOnly = (d: Date = new Date()): string => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getRelativeDateString = (daysAgo: number = 0): string => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return getUtcDateOnly(d);
};

export const formatDateDisplay = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(Date.UTC(year, monthIndex, day));
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${months[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, '0')}, ${date.getUTCFullYear()}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
};

export const formatHeaderDate = (d: Date = new Date()): { monthDay: string; year: string } => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = months[d.getUTCMonth()];
  const day = d.getUTCDate();
  return {
    monthDay: `${m} ${day},`,
    year: String(d.getUTCFullYear())
  };
};

export const getFormattedCurrentDate = (d: Date = new Date()): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

export const getCurrentCycleString = (d: Date = new Date()): string => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}.${m}`;
};
