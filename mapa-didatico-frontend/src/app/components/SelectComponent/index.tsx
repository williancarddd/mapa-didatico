import React, { ChangeEvent } from "react";

interface SelectProps<T extends string | number> {
  id: string;
  label: string;
  options: T[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
}

function SelectComponent<T extends string | number>({ id, label, options, value, onChange }: SelectProps<T>) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as T;
    onChange(selectedValue);
  };

  return (
    <div className="w-60">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <select
        id={id}
        onChange={handleChange}
        value={value || ""}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        {options.map((option) => (
          <option key={option.toString()} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectComponent;
