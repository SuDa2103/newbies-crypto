import * as React from 'react';
import { RadioGroupProps as $RadioGroupProps } from 'antd/lib/radio/interface';
import { FormikFieldProps } from '../FieldProps';
export declare type RadioGroupProps = FormikFieldProps & $RadioGroupProps;
export declare const Radio: {
    ({ name, validate, fast, onChange, ...restProps }: RadioGroupProps): JSX.Element;
    Group({ name, validate, fast, onChange, ...restProps }: RadioGroupProps): JSX.Element;
    Button: React.ForwardRefExoticComponent<import("antd/lib/radio/radioButton").RadioButtonProps & React.RefAttributes<any>>;
};
export default Radio;
//# sourceMappingURL=index.d.ts.map