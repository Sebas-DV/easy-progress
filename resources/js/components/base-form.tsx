import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { DefaultValues, FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { ZodType } from 'zod';

interface BaseFormProps<T extends FieldValues> {
    schema: ZodType<T>;
    onSubmit: (data: T) => Promise<void> | void;
    defaultValues?: DefaultValues<T>;
    mode?: 'create' | 'edit';
    children: (methods: UseFormReturn<T>) => React.ReactNode;
}

export function BaseForm<T extends FieldValues>({ mode = 'create', children, defaultValues, schema, onSubmit }: BaseFormProps<T>) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>{children(methods)}</form>
        </Form>
    );
}
