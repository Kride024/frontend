import React, { forwardRef, memo } from "react";

interface EnquiryInputFieldProps {
  id: string;
  label: string;
  value?: string | number | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}

const InputFieldBase = forwardRef<HTMLInputElement, EnquiryInputFieldProps>(
  (
    { id, label, value, onChange, type = "text", disabled = false },
    ref
  ) => {
    return (
      <div className="grid gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#001433]" // dark label color
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={`h-9 px-2 border border-gray-500 rounded text-sm w-full
            bg-gray-100 text-gray-950
            disabled:bg-gray-200 disabled:text-gray-700`}
        />
      </div>
    );
  }
);

InputFieldBase.displayName = "InputField";

const EnquiryInputField = memo(InputFieldBase);
export default EnquiryInputField;
