// Text and time formatting utilities

/**
 * Truncates text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats timestamp to readable time string
 */
export function formatTime(timestamp?: number): string {
  return new Date(timestamp ?? Date.now()).toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
