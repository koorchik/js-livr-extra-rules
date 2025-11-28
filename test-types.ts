// Type inference tests for livr-extra-rules
// Run with: npx tsc --noEmit

import type { InferFromSchema } from 'livr/types';

// Import type augmentations
import './types';

// ============================================================================
// Type Testing Utilities
// ============================================================================

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

// ============================================================================
// String Validators (output: string)
// ============================================================================

// base64
{
    const schema = { field: 'base64' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// credit_card
{
    const schema = { field: 'credit_card' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// creditCard (camelCase alias)
{
    const schema = { field: 'creditCard' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// ipv4
{
    const schema = { field: 'ipv4' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// md5
{
    const schema = { field: 'md5' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// mongo_id
{
    const schema = { field: 'mongo_id' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// mongoId (camelCase alias)
{
    const schema = { field: 'mongoId' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// uuid
{
    const schema = { field: 'uuid' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// iso_date
{
    const schema = { field: 'iso_date' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// isoDate (camelCase alias)
{
    const schema = { field: 'isoDate' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: string }>>;
}

// ============================================================================
// Type Transformer (output: boolean)
// ============================================================================

// boolean
{
    const schema = { field: 'boolean' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: boolean }>>;
}

// ============================================================================
// Pass-through Validators (output: unknown)
// ============================================================================

// has_methods
{
    const schema = { field: 'has_methods' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// hasMethods (camelCase alias)
{
    const schema = { field: 'hasMethods' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// list_items_unique
{
    const schema = { field: 'list_items_unique' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// listItemsUnique (camelCase alias)
{
    const schema = { field: 'listItemsUnique' } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// list_length
{
    const schema = { field: { list_length: 3 } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// listLength (camelCase alias)
{
    const schema = { field: { listLength: 3 } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// required_if
{
    const schema = { field: { required_if: { other: 'value' } } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// requiredIf (camelCase alias)
{
    const schema = { field: { requiredIf: { other: 'value' } } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: unknown }>>;
}

// ============================================================================
// Parameterized Rules
// ============================================================================

// is - outputs literal type with required effect
{
    const schema = { field: { is: 'active' as const } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field: 'active' }>>;
}

// is - with number literal
{
    const schema = { field: { is: 42 as const } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field: 42 }>>;
}

// instanceOf - outputs instance type
{
    const schema = { field: { instanceOf: Date } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: Date }>>;
}

// instance_of (snake_case) - outputs instance type
{
    const schema = { field: { instance_of: Date } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: Date }>>;
}

// instanceOf with custom class
{
    class MyClass {
        value: number = 0;
    }
    const schema = { field: { instanceOf: MyClass } } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field?: MyClass }>>;
}

// ============================================================================
// Combined with Core LIVR Rules
// ============================================================================

// required + string validator
{
    const schema = { field: ['required', 'uuid'] } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field: string }>>;
}

// required + boolean
{
    const schema = { field: ['required', 'boolean'] } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { field: boolean }>>;
}

// nested_object with extra rules
{
    const schema = {
        user: {
            nested_object: {
                id: ['required', 'uuid'],
                email_hash: 'md5',
                is_active: 'boolean',
            },
        },
    } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<
        Equal<
            Result,
            {
                user?: {
                    id: string;
                    email_hash?: string;
                    is_active?: boolean;
                };
            }
        >
    >;
}

// ============================================================================
// Complex Schemas
// ============================================================================

// Real-world example: User profile
{
    const schema = {
        id: ['required', 'mongo_id'],
        avatar: 'base64',
        credit_card: 'credit_card',
        ip_address: 'ipv4',
        password_hash: 'md5',
        session_id: 'uuid',
        birth_date: 'iso_date',
        is_verified: 'boolean',
        status: { is: 'active' as const },
    } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<
        Equal<
            Result,
            {
                id: string;
                avatar?: string;
                credit_card?: string;
                ip_address?: string;
                password_hash?: string;
                session_id?: string;
                birth_date?: string;
                is_verified?: boolean;
                status: 'active';
            }
        >
    >;
}

// CamelCase variant of the same schema
{
    const schema = {
        id: ['required', 'mongoId'],
        avatar: 'base64',
        creditCard: 'creditCard',
        ipAddress: 'ipv4',
        passwordHash: 'md5',
        sessionId: 'uuid',
        birthDate: 'isoDate',
        isVerified: 'boolean',
        status: { is: 'active' as const },
    } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<
        Equal<
            Result,
            {
                id: string;
                avatar?: string;
                creditCard?: string;
                ipAddress?: string;
                passwordHash?: string;
                sessionId?: string;
                birthDate?: string;
                isVerified?: boolean;
                status: 'active';
            }
        >
    >;
}

// Multiple rules per field
{
    const schema = {
        tags: ['list_items_unique', { list_length: 5 }],
    } as const;
    type Result = InferFromSchema<typeof schema>;
    type _test = Expect<Equal<Result, { tags?: unknown }>>;
}
