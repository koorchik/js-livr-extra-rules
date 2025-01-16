type RuleFactory = (
  ...args: Array<any>
) => (value: any, params: any, outputArr: Array<any>) => string | undefined;

declare module 'livr-extra-rules' {
  /**
  * Extra rules to register with LIVR Validator
  */
  type LivrExtraRules = Record<string, RuleFactory>;
  const extraRules: LivrExtraRules
  export = extraRules;
}