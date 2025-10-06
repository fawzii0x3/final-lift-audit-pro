import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import type { ComponentProps } from "react";
import { type TypeOf, z } from "zod";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface TextFieldProps extends ComponentProps<"input"> {
  label: string;
}
interface SelectFieldProps {
  label: string;
  data: { label: string; value: string; key: string }[];
  disabled?: boolean;
  readonly: boolean;
  placeholder?: string;
}

export interface DateFieldProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export type ZodSchema = z.Schema;
export type FieldProps = {
  text: TextFieldProps;
  select: SelectFieldProps;
  date: DateFieldProps;
};
export type FieldType = keyof FieldProps;

export type ControllerRender<Schema extends ZodSchema> = {
  field: ControllerRenderProps<FieldValues, Path<TypeOf<Schema>>>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
};

export interface RenderProps<TYPE extends FieldType> {
  type: TYPE;
  props: FieldProps[TYPE];
}

export function RenderField<Schema extends ZodSchema, TYPE extends FieldType>({
  type,
  props,
  field,
}: ControllerRender<Schema> & RenderProps<TYPE>) {
  switch (type) {
    case "date": {
      const {
        label = "Date d'inspection *",
        placeholder = "Pick a date",
        disabled = false,
        readonly = false,
        minDate,
        maxDate,
      } = props as DateFieldProps;

      if (readonly) {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                value={
                  field.value
                    ? format(new Date(field.value + "T00:00:00"), "PPP")
                    : "N/A"
                }
                disabled={true}
                className="bg-muted"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }

      return (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(new Date(field.value + "T00:00:00"), "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={
                  field.value ? new Date(field.value + "T00:00:00") : undefined
                }
                onSelect={(date) =>
                  field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                }
                autoFocus
                className="p-3 pointer-events-auto"
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return date > new Date("2100-01-01");
                }}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      );
    }
    case "select": {
      const { data, readonly, label, disabled, placeholder } =
        props as SelectFieldProps;
      return (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {readonly ? (
            <FormControl>
              <Input
                value={
                  data.find((row) => row.value === field.value)?.label || "N/A"
                }
                disabled={true}
                className="bg-muted"
              />
            </FormControl>
          ) : (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.map((item) => (
                  <SelectItem key={item.key} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FormMessage />
        </FormItem>
      );
    }
    default: {
      const { label, ...rest } = props;
      return (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...rest} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      );
    }
  }
}
