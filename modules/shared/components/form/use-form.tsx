import type { PropsWithChildren } from "react";
import { type TypeOf, z } from "zod";
import {
  Controller,
  type Path,
  type SubmitHandler,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldProps, type FieldType, RenderField } from "./render";
import { Form } from "@/components/ui/form";

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
        <form onSubmit={form.handleSubmit(submitHandler)}>{children}</form>
      </Form>
    );
  }

  return {
    createField,
    Form: DynamicForm,
  };
}
