import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Props for the IconButton component
 */
interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title?: string;
  className?: string;
  size?: number;
  variant?: 'default' | 'danger' | 'primary';
  disabled?: boolean;
}

/**
 * IconButton component for consistent button styling across the app
 */
export default function IconButton({
  icon: Icon,
  onClick,
  title,
  className = '',
  size = 16,
  variant = 'default',
  disabled = false,
}: IconButtonProps) {
  const baseStyles = 'p-1 rounded-full transition-colors focus:outline-none';
  const variantStyles = {
    default: 'hover:bg-gray-100 text-gray-500',
    danger: 'hover:bg-red-100 text-gray-500 hover:text-red-500',
    primary: 'hover:bg-blue-100 text-gray-500 hover:text-blue-500',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      title={title}
    >
      <Icon size={size} />
    </motion.button>
  );
} 