import React, { forwardRef, useRef } from 'react';
import { Controller } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { Control } from 'react-hook-form';
import { InputModeOptions, TextInputProps } from 'react-native';
import { boolean } from 'zod';

interface ControlledInputFieldProps extends TextInputProps {
  control: any;
  title?: string;
  name: string;
  rules?: { required: boolean };
  isActive: boolean;
  setActiveField: (field: string | null) => void;
  handleFocus: (ref: React.RefObject<any>) => void;
  helperMessage?: string;
  errorMessage?: string;
  otherProps?: any;
}

const ControlledInputField = forwardRef<any, ControlledInputFieldProps>(
  (
    {
      name,
      title,
      control,
      rules = { required: true },
      isActive,
      setActiveField,
      handleFocus,
      helperMessage,
      errorMessage,
      ...otherProps
    },
    ref
  ) => {
    function onFocus() {
      setActiveField(name);
      handleFocus(inputRef);
    }

    const inputRef = useRef(null);

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            ref={inputRef}
            label={title}
            value={value}
            onChangeText={onChange}
            onBlur={() => {
              setActiveField(null);
              onBlur();
            }}
            onFocus={onFocus}
            active={isActive}
            helperMessage={helperMessage}
            errorMessage={errorMessage}
            {...otherProps}
          />
        )}
      />
    );
  }
);

export default ControlledInputField;
