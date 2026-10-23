// Types of livr-extra-rules for livr 2.12 or newer: the type of every rule in RuleTypes of livr,
// so that InferFromSchema and the strict mode of livr know these rules. camelCase names
// (creditCard, mongoId, ...) are typed by livr. https://js.livr-spec.org/typescript#rule-packages
import type { As, RuleType } from 'livr/types/inference';

/** { is: 'active' } -> 'active': the value is the argument, and the field is required */
interface IsType extends RuleType {
    output: this['args'][0];
    present: true;
}

/** { instance_of: Date } -> Date */
interface InstanceOfType extends RuleType {
    output: this['args'][0] extends abstract new (...args: any) => infer T ? T : unknown;
}

declare module 'livr/types/inference' {
    interface RuleTypes {
        // Strings
        base64: As<string>;
        credit_card: As<string>;
        ipv4: As<string>;
        md5: As<string>;
        mongo_id: As<string>;
        uuid: As<string>;
        // Replaces iso_date of livr, also with { iso_date: { min, max, format } }
        iso_date: As<string>;

        // Converts the value to a boolean
        boolean: boolean;

        // Check the value and keep the type of earlier rules
        has_methods: As<object>;
        list_items_unique: As<unknown[]>;
        list_length: As<unknown[]>;
        required_if: As<unknown>;

        is: IsType;
        instance_of: InstanceOfType;
    }
}

// "export =" is at the top level: inside "declare module 'livr-extra-rules'" in this file it
// would be a module augmentation, where exports are not allowed (TS2666 without skipLibCheck)

type RuleFactory = (
    ...args: Array<any>
) => (value: any, params: any, outputArr: Array<any>) => string | undefined;

/**
 * Extra rules to register with LIVR Validator.
 *
 * @example
 * ```typescript
 * import LIVR from 'livr';
 * import extraRules from 'livr-extra-rules';
 * import type { InferFromSchema } from 'livr/types';
 *
 * LIVR.Validator.registerDefaultRules(extraRules);
 *
 * const schema = {
 *     id: ['required', 'uuid'],
 *     is_active: 'boolean',
 *     status: { is: 'active' },
 *     tags: [{ list_of: 'string' }, 'list_items_unique'],
 * } as const;
 *
 * type Data = InferFromSchema<typeof schema>;
 * // { id: string; is_active?: boolean; status: 'active'; tags?: string[] }
 * ```
 */
type LivrExtraRules = Record<string, RuleFactory>;
declare const extraRules: LivrExtraRules;
export = extraRules;
