import OtpInput from 'react-otp-input';
import { theme } from './snack/theme';

interface IDialPadProps {
  value: string;
  onChange: (otp: string) => void;
  onBlur: (e: any) => void;
}

export function OtpDailPad({ value, onChange, onBlur }: IDialPadProps) {
  const inputStyle = {
    height: 48,
    width: 48,
    marginRight: 10,
    backgroundColor: theme.palette.surface,
    borderRadius: '6px',
    color: theme.palette.primary,
    fontSize: '28px',
    border:
      value.length > 0
        ? `1px solid ${theme.palette.primary[400]}`
        : `1px solid #B0BED3`,
    fontWeight: 600
  };

  return (
    <OtpInput
      value={value}
      onChange={onChange}
      numInputs={6}
      shouldAutoFocus={true}
      inputStyle={inputStyle}
      inputType="number"
      containerStyle={{ display: 'flex', justifyContent: 'center' }}
      renderInput={(props, index) => (
        <input
          {...props}
          onBlur={onBlur}
          inputMode="numeric"
          pattern="[0-9]*"
          name={'otp'}
          style={{
            ...props.style,
            marginRight: index === 5 ? 0 : 10
          }}
          className="outline-primary-300"
        />
      )}
    />
  );
}
