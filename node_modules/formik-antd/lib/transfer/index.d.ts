/// <reference types="react" />
import { FormikFieldProps } from '../FieldProps';
import { TransferItem, TransferProps as $TransferProps } from 'antd/lib/transfer';
export declare type TransferProps<T> = FormikFieldProps & $TransferProps<T>;
export declare function Transfer<T extends TransferItem = TransferItem>({ name, validate, fast, onChange, ...restProps }: TransferProps<T>): JSX.Element;
export default Transfer;
//# sourceMappingURL=index.d.ts.map