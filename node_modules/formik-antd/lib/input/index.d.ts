import { Input as $Input } from 'antd';
import * as React from 'react';
import { InputProps as $InputProps, PasswordProps as $PasswordProps, TextAreaProps as $TextAreaProps } from 'antd/lib/input';
import { FormikFieldProps } from '../FieldProps';
import { TextAreaRef } from 'antd/lib/input/TextArea';
export declare type InputProps = FormikFieldProps & $InputProps;
interface InputType extends React.ForwardRefExoticComponent<FormikFieldProps & $InputProps & React.RefAttributes<$Input>> {
    Password: React.ForwardRefExoticComponent<FormikFieldProps & $PasswordProps & React.RefAttributes<unknown>>;
    TextArea: React.ForwardRefExoticComponent<FormikFieldProps & $TextAreaProps & React.RefAttributes<TextAreaRef>>;
}
declare const TypedInput: InputType;
export declare type PasswordProps = FormikFieldProps & $PasswordProps;
export declare type TextAreaProps = FormikFieldProps & $TextAreaProps;
export { TypedInput as Input };
export default TypedInput;
//# sourceMappingURL=index.d.ts.map