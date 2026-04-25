import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const btnClass = `
    ${styles.button} 
    ${styles[variant]} 
    ${fullWidth ? styles.fullWidth : ''} 
    ${disabled || isLoading ? styles.disabled : ''}
    ${className}
  `.trim();

  return (
    <button className={btnClass} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className={styles.spinner} style={{width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite'}} />
      ) : null}
      {children}
    </button>
  );
}
