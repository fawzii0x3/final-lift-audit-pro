import type { ComponentProps, PropsWithChildren } from "react";
import { type TypeOf, z } from "zod";
import {
  Controller,
  type Path,
  type SubmitHandler,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RenderField } from "./render";
import { Form } from "@/components/ui/form";

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

type FieldProps = {
  text: TextFieldProps;
  select: SelectFieldProps;
};
type FieldType = keyof FieldProps;
type ZodSchema = z.Schema;

type FieldName<Schema extends ZodSchema> = Path<TypeOf<Schema>>;

export function useCreateForm<Schema extends ZodSchema>(
  schema: Schema,
  formsProps: Omit<UseFormProps<z.infer<Schema>>, "resolver">,
) {
  const form = useForm({
    ...formsProps,
    resolver: zodResolver(schema),
  });
  const { control } = form;

  function createField<TYPE extends FieldType>(
    name: FieldName<Schema>,
    type: TYPE,
    props: FieldProps[TYPE],
  ) {
    return (
      <Controller
        name={name}
        control={control}
        render={(renderProps) => (
          <RenderField type={type} props={props} {...renderProps} />
        )}
      />
    );
  }
  function DynamicForm({
    submitHandler,
    children,
  }: PropsWithChildren<{ submitHandler: SubmitHandler<TypeOf<Schema>> }>) {
    return (
      <Form {...form}>
        <form onSubmit={submitHandler}>{children}</form>
      </Form>
    );
  }

  return {
    createField,
    Form: DynamicForm,
  };
}
