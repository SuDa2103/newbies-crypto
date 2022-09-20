/// <reference types="react" />
import { FormikFieldProps } from '../FieldProps';
import { SliderSingleProps, SliderRangeProps } from 'antd/lib/slider';
export declare type SliderProps = FormikFieldProps & (SliderSingleProps | SliderRangeProps);
export declare const Slider: ({ name, validate, fast, onChange, ...restProps }: SliderProps) => JSX.Element;
export default Slider;
//# sourceMappingURL=index.d.ts.map