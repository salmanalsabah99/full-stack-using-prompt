import { PRIORITY_COLORS } from '@/lib/constants';

export const inputStyles = "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
export const buttonStyles = {
  primary: "px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors",
  secondary: "px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors",
  icon: "p-1 hover:bg-gray-100 rounded-full transition-colors",
  delete: "p-1 hover:bg-red-50 rounded-full transition-colors"
};

export const pageStyles = {
  container: "min-h-screen w-full bg-gradient-to-b from-[#030712] via-[#0b0c2a] to-[#0f0f1e] text-white",
  content: "relative z-10 px-10 py-12 text-white",
  title: "text-6xl font-extrabold text-center mb-4 tracking-widest drop-shadow-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent",
  subtitle: "text-blue-200 text-lg mb-6",
  loadingContainer: "relative z-10 flex items-center justify-center min-h-screen",
  loadingText: "text-2xl font-bold",
  errorText: "text-2xl font-bold text-red-500"
};

export { PRIORITY_COLORS as priorityColors }; 