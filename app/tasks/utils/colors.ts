// List of predefined color combinations
export const LIST_COLORS = [
  { accent: '#3B82F6', bg: 'bg-blue-50' },    // Blue
  { accent: '#10B981', bg: 'bg-green-50' },   // Green
  { accent: '#6366F1', bg: 'bg-indigo-50' },  // Indigo
  { accent: '#8B5CF6', bg: 'bg-purple-50' },  // Purple
  { accent: '#EC4899', bg: 'bg-pink-50' },    // Pink
  { accent: '#F59E0B', bg: 'bg-amber-50' },   // Amber
  { accent: '#EF4444', bg: 'bg-red-50' },     // Red
  { accent: '#14B8A6', bg: 'bg-teal-50' },    // Teal
  { accent: '#F97316', bg: 'bg-orange-50' },  // Orange
  { accent: '#84CC16', bg: 'bg-lime-50' },    // Lime
] as const;

// Function to get a color combination by index
export function getListColor(index: number) {
  return LIST_COLORS[index % LIST_COLORS.length];
}

// Function to get a random color combination
export function getRandomListColor() {
  const randomIndex = Math.floor(Math.random() * LIST_COLORS.length);
  return LIST_COLORS[randomIndex];
}

// Function to get a color combination for a specific list type
export function getListColorByType(type: 'default' | 'custom') {
  if (type === 'default') {
    return LIST_COLORS[0];
  }
  return getRandomListColor();
} 