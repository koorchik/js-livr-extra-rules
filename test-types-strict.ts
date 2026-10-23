// The rules in the strict mode of livr: they have types, so schemas with them compile and
// a misspelled rule is a compile error. Strict mode is global, so it is a program of its own.
// Run with: npx tsc --noEmit -p tsconfig.strict.json

import LIVR from 'livr';
import type { InferFromSchema, LIVRSchema } from 'livr/types';
import extraRules from './types';

declare module 'livr/types/inference' {
    interface TypeOptions {
        strictRules: true;
    }
}

type Expect<T extends true> = T;
type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

LIVR.Validator.registerDefaultRules(extraRules);

// Every rule, snake_case and camelCase names
const schema = {
    avatar: 'base64',
    card: ['credit_card', 'creditCard'],
    ip: 'ipv4',
    hash: 'md5',
    id: ['required', 'mongo_id', 'mongoId'],
    session: { uuid: 'v4' },
    birthDate: ['iso_date', { isoDate: { min: '1900-01-01', max: 'current' } }],
    isActive: 'boolean',
    tags: [{ list_of: 'string' }, 'list_items_unique', 'listItemsUnique', { list_length: [1, 5] }],
    nickname: ['string', { required_if: { isActive: '1' } }, { requiredIf: { isActive: '1' } }],
    status: { is: 'active' },
    createdAt: [{ instance_of: Date }, { instanceOf: Date }, { has_methods: ['getTime'] }],
    address: { nested_object: { zip: ['required', 'ipv4'] } },
} as const satisfies LIVRSchema;

const validator = new LIVR.Validator<InferFromSchema<typeof schema>>(schema);

type _types = [
    Expect<
        Equal<
            InferFromSchema<typeof schema>,
            {
                avatar?: string;
                card?: string;
                ip?: string;
                hash?: string;
                id: string;
                session?: string;
                birthDate?: string;
                isActive?: boolean;
                tags?: string[];
                nickname?: string;
                status: 'active';
                createdAt?: Date;
                address?: { zip: string };
            }
        >
    >,
];

// A misspelled rule is a compile error
new LIVR.Validator({
    // @ts-expect-error
    id: ['required', 'uuidd'],
});

export { validator };
