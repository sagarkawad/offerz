const DISPLAY_DATE_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/;

export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

export function parseDisplayDate(displayDate: string): string | null {
  const match = DISPLAY_DATE_PATTERN.exec(displayDate.trim());
  if (!match) {
    return null;
  }

  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${yyyy}-${mm}-${dd}`;
}
