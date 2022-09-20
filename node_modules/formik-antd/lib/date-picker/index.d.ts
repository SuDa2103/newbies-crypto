/// <reference types="react" />
import { FormikFieldProps } from '../FieldProps';
import { DatePickerProps as $DatePickerProps, MonthPickerProps as $MonthPickerProps, RangePickerProps as $RangePickerProps, WeekPickerProps as $WeekPickerProps } from 'antd/lib/date-picker';
export declare type DatePickerProps = $DatePickerProps & FormikFieldProps & {
    keepOffset?: boolean;
};
export declare const DatePicker: {
    ({ name, validate, onChange, fast, keepOffset, ...restProps }: DatePickerProps): JSX.Element;
    MonthPicker({ name, validate, onChange, keepOffset, ...restProps }: MonthPickerProps): JSX.Element;
    RangePicker({ name, validate, onChange, ...restProps }: RangePickerProps): JSX.Element;
    WeekPicker({ name, validate, onChange, ...restProps }: WeekPickerProps): JSX.Element;
};
export default DatePicker;
export declare type WeekPickerProps = FormikFieldProps & $WeekPickerProps;
export declare type RangePickerProps = FormikFieldProps & $RangePickerProps;
export declare type MonthPickerProps = FormikFieldProps & $MonthPickerProps & {
    keepOffset?: boolean;
};
//# sourceMappingURL=index.d.ts.map