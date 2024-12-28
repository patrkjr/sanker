import React, { forwardRef } from 'react';
import { Controller } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { Control } from 'react-hook-form';
import { InputModeOptions } from 'react-native';

interface ControlledInputFieldProps {
  control: any;
  title?: string;
  name: string;
  isActive: boolean;
  setActiveField: (field: string | null) => void;
  handleFocus: (ref: React.RefObject<any>, fieldName: string) => void;
  inputMode?: InputModeOptions | undefined;
  errorMessage?: string;
  otherProps?: any;
}

const ControlledInputField = forwardRef<any, ControlledInputFieldProps>(
  (
    {
      name,
      title,
      control,
      isActive,
      setActiveField,
      handleFocus,
      errorMessage,
      inputMode,
      otherProps,
    },
    ref
  ) => (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { onBlur, onChange, value } }) => (
        <Input
          ref={ref}
          label={title}
          value={value}
          onChangeText={onChange}
          onBlur={() => {
            setActiveField(null);
            onBlur();
          }}
          onFocus={() => handleFocus(ref, name)}
          active={isActive}
          inputMode={inputMode}
          errorMessage={errorMessage}
          {...otherProps}
        />
      )}
    />
  )
);

export default ControlledInputField;
