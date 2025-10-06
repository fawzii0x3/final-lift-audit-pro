import type { ComponentProps } from "react";
import { type TypeOf, z } from "zod";
import {
  Controller,
  type Path,
  type SubmitHandler,
  useForm,
  type UseFormProps,
  useFieldArray,
  type UseFieldArrayProps,
  type ArrayPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldProps, type FieldType, RenderField } from "./render";
import { Form } from "@/components/ui/form";

type ZodSchema = z.Schema;

type FieldName<Schema extends ZodSchema> = Path<TypeOf<Schema>>;

interface DynamicFormProps<Schema extends ZodSchema>
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  submitHandler: SubmitHandler<TypeOf<Schema>>;
}

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
  function DynamicForm({ submitHandler, ...props }: DynamicFormProps<Schema>) {
    return (
      <Form {...form}>
        <form {...props} onSubmit={form.handleSubmit(submitHandler)} />
      </Form>
    );
  }

  return {
    createField,
    Form: DynamicForm,
    form,
  };
}

export function useCreateArrayForm<Schema extends ZodSchema>(
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

  function createArrayField<
    TYPE extends FieldType,
    ArrayName extends ArrayPath<TypeOf<Schema>>,
  >(
    arrayName: ArrayName,
    index: number,
    fieldName: Path<TypeOf<Schema>[ArrayName][number]>,
    type: TYPE,
    props: FieldProps[TYPE],
  ) {
    return (
      <Controller
        name={`${arrayName}.${index}.${fieldName}` as FieldName<Schema>}
        control={control}
        render={(renderProps) => (
          <RenderField type={type} props={props} {...renderProps} />
        )}
      />
    );
  }

  function useArrayField(
    name: ArrayPath<TypeOf<Schema>>,
    options?: Omit<
      UseFieldArrayProps<TypeOf<Schema>, ArrayPath<TypeOf<Schema>>>,
      "control"
    >,
  ) {
    return useFieldArray({
      control,
      name: name,
      ...options,
    });
  }

  function DynamicForm({ submitHandler, ...props }: DynamicFormProps<Schema>) {
    return (
      <Form {...form}>
        <form {...props} onSubmit={form.handleSubmit(submitHandler)} />
      </Form>
    );
  }

  return {
    createField,
    createArrayField,
    useArrayField,
    Form: DynamicForm,
    form,
  };
}
