import React from 'react';
import styles from './Input.module.css';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helperText?: string;
  multiline?: boolean;
};

export function Input({ label, helperText, multiline, id, className = '', ...props }: InputProps) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      {multiline ? (
        <textarea id={id} className={`${styles.input} ${styles.textarea}`} {...(props as any)} />
      ) : (
        <input id={id} className={styles.input} {...props} />
      )}
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
}
