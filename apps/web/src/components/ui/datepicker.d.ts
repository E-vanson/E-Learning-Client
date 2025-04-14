import * as React from "react";
export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    fromDate?: Date;
    toDate?: Date;
}
declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLDivElement>>;
export { DatePicker };
//# sourceMappingURL=datepicker.d.ts.map