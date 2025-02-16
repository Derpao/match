import styles from '@/styles/Button.module.css'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export const Button = ({ children, onClick, type = 'button' }: ButtonProps) => {
  return (
    <button 
      className={styles.button}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
