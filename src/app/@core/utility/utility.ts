export class getFirstAndLastName {

  static parseUserName(name: string): { firstName: string; lastName: string } {
    let firstName = '';
    let lastName = '';

    if (name.includes(',')) {
      const parts = name.split(',').map(part => part.trim());
      if (parts.length === 2) {
        lastName = parts[0];
        firstName = parts[1];
      }
    } else {
      const parts = name.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    return { firstName, lastName };
  }

};

/**
 * Safely parse JSON string with fallback
 * @param {string} jsonString - The JSON string to parse
 * @param {any} fallback - Fallback value if parsing fails (default: {})
 * @returns {any} Parsed object or fallback value
 */
export const safeJsonParse = (jsonString: any, fallback = {}) => {
  try {
    return JSON.parse(jsonString || '{}');
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

export function formatDateTime(dateString: string): string {
  if (!dateString || dateString === 'undefined') return '';

  let utcString = dateString;
  if (!dateString.includes('Z') && !dateString.includes('+')) {
    utcString = dateString + 'Z';
  }

  const date = new Date(utcString);

  if (isNaN(date.getTime())) return '';

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};