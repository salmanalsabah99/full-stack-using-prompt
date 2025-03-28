import { Plus } from 'lucide-react';

interface AddEventButtonProps {
  onClick: () => void;
}

export default function AddEventButton({ onClick }: AddEventButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
    >
      <Plus size={24} />
    </button>
  );
} 