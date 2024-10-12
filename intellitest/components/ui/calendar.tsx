import DateTimePicker, {
  IOSNativeProps,
  AndroidNativeProps,
  WindowsNativeProps,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React, { ComponentProps, useState } from "react";
import { Calendar as CalendarIcon } from "@/lib/icons";
import { format } from "date-fns";

type CalendarButtonprops = ComponentProps<typeof Button>;
type DateTimePickerProps = IOSNativeProps &
  AndroidNativeProps &
  WindowsNativeProps;

interface CalendarProps extends DateTimePickerProps {
  className?: string;
  placeholder?: string;
  buttonProps?: CalendarButtonprops;
  value: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  className,
  placeholder = "Pick a date",
  value,
  mode = "date",
  onChange,
  buttonProps,
  ...props
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    if (onChange) {
      onChange(event, currentDate);
    }
  };

  const showPicker = () => {
    setShow(true);
  };

  return (
    <>
      <Button
        variant={"outline"}
        className={cn("flex flex-row gap-3 justify-start", className)}
        {...buttonProps}
        onPress={showPicker}
      >
        {({ pressed }) => (
          <>
            <CalendarIcon
              size={16}
              className={cn(
                "text-muted-foreground",
                pressed && "text-accent-foreground",
              )}
            />
            <Text
              className={cn(
                "!text-sm",
                pressed && "text-accent-foreground",
                !value && "text-muted-foreground",
              )}
            >
              {value ? format(value, "PPP") : placeholder}
            </Text>
          </>
        )}
      </Button>
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          onChange={handleDateChange}
          {...props}
        />
      )}
    </>
  );
};

export { Calendar };
