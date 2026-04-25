import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ title, description, children, className = '', hoverable = false }: CardProps) {
  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}>
      {(title || description) && (
        <div style={{ marginBottom: '1rem' }}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
