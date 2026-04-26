import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import styles from './Combobox.module.css';

export interface ComboboxOption {
  value: string;
  label: string;
  category?: string;
}

interface ComboboxProps {
  id?: string;
  label?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Combobox({ id, label, options, value, onChange, placeholder = "Select an option...", className = '' }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  // Filter options based on search term
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (opt.category && opt.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group by category if categories exist
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const cat = option.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(option);
    return acc;
  }, {} as Record<string, ComboboxOption[]>);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm(''); // Reset search on select
  };

  return (
    <div className={`${styles.wrapper} ${className}`} ref={wrapperRef}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      
      <button
        id={id}
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} style={{ color: 'var(--muted)' }} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrapper}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                style={{ paddingLeft: '28px' }}
              />
            </div>
          </div>

          <div className={styles.optionsList}>
            {filteredOptions.length === 0 ? (
              <div className={styles.noResults}>No options found.</div>
            ) : (
              Object.entries(groupedOptions).map(([category, opts]) => (
                <div key={category}>
                  {category !== 'Other' && <div className={styles.categoryLabel}>{category}</div>}
                  {opts.map(opt => (
                    <div
                      key={opt.value}
                      className={`${styles.option} ${value === opt.value ? styles.selected : ''}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
