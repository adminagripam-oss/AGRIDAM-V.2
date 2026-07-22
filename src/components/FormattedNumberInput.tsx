import React, { useState, useEffect } from 'react';

interface FormattedNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number;
  onChange: (value: number) => void;
}

export function FormattedNumberInput({ value, onChange, className, ...props }: FormattedNumberInputProps) {
  // Local state to hold the formatted string representation
  const [displayValue, setDisplayValue] = useState('');

  // Update local state if the prop changes externally (e.g. initial load or reset)
  useEffect(() => {
    if (value === 0 && displayValue === '') {
      // Don't override an empty input with '0' if the user just cleared it
      return;
    }
    
    // Format the number to Indonesian locale without currency symbol
    // 1234.56 -> "1.234,56"
    if (value !== undefined && value !== null) {
      // Check if displayValue already represents this number to avoid formatting while typing
      const parsedDisplay = parseFloat(displayValue.replace(/\./g, '').replace(/,/g, '.'));
      if (parsedDisplay !== value) {
        // We only format fully when not actively typing a decimal separator
        if (!displayValue.endsWith(',')) {
          setDisplayValue(
            value === 0 ? '' : new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value)
          );
        }
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    
    // Allow empty
    if (raw === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Only allow numbers, dots (as thousands separator in ID) and commas (as decimal separator in ID)
    raw = raw.replace(/[^0-9,.]/g, '');

    setDisplayValue(raw);

    // Convert Indonesian format (1.234,56) to standard float (1234.56)
    const normalized = raw.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(normalized);
    
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      onChange(0);
    }
  };

  const handleBlur = () => {
    if (displayValue !== '') {
      // Re-format cleanly on blur
      const normalized = displayValue.replace(/\./g, '').replace(/,/g, '.');
      const parsed = parseFloat(normalized);
      if (!isNaN(parsed)) {
        setDisplayValue(new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(parsed));
      } else {
        setDisplayValue('');
      }
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      {...props}
    />
  );
}
