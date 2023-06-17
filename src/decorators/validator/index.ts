import {
  type ValidationArguments,
  type ValidationOptions,
  ValidateBy,
  isNumber,
  isString,
  isNumberString,
  isInt,
  isArray,
  isBoolean,
  buildMessage,
} from 'class-validator';
import isIso8601String from 'validator/lib/isISO8601'

const InnerTypesValidator = {
  number: isNumber,
  string: isString,
  numberString: isNumberString,
  int: isInt,
  array: isArray,
  boolean: isBoolean,
};

/**Dto中验证泛型 */
export const IsGenericType = (
  validators: (keyof typeof InnerTypesValidator | ((value: any) => boolean))[],
  validationOptions?: ValidationOptions,
) =>
  ValidateBy(
    {
      name: 'IS_GENERIC_TYPE',
      validator: {
        validate: (value: any) => {
          return validators.some((item) =>
            typeof item === 'function'
              ? item(value)
              : InnerTypesValidator[item]?.(value),
          );
        },
        defaultMessage: (validationArguments?: ValidationArguments) => {
          return `${validationArguments?.property}: Data type mismatch`;
        },
      },
    },
    validationOptions,
  );

/**Dto中验证是否是某1类型的元素或其数组 */
export const IsSelfOrArrayType = (
  /**class-validator的几个内置类型或可选值的数组或一个自定义的校验函数用来校验每1个元素 */
  itemTypeOrListOrValidator:
    | 'number'
    | 'string'
    | 'boolean'
    | 'int'
    | 'numberString'
    | ((value: any) => boolean)
    | any[],
  validationOptions?: ValidationOptions,
) =>
  ValidateBy(
    {
      name: 'IS_SELF_OR_ARRAY_TYPE',
      validator: {
        validate: (value: any) => {
          const fn =
            typeof itemTypeOrListOrValidator === 'function'
              ? itemTypeOrListOrValidator
              : Array.isArray(itemTypeOrListOrValidator)
              ? (v: any) => itemTypeOrListOrValidator.includes(v)
              : InnerTypesValidator[itemTypeOrListOrValidator];
          return Array.isArray(value)
            ? value.every((ele) => fn?.(ele))
            : fn?.(value);
        },
        defaultMessage: (validationArguments?: ValidationArguments) => {
          return `${validationArguments?.property}: Data type mismatch`;
        },
      },
    },
    validationOptions,
  );

    interface IsISO8601Options {
        /**
         * If `strict` is `true`, performs additional checks for valid dates,
         * e.g. invalidates dates like `2009-02-29`.
         *
         * @default false
         */
        strict?: boolean | undefined;
        /**
         * If `strictSeparator` is true, date strings with date and time separated
         * by anything other than a T will be invalid
         *
         */
        strictSeparator?: boolean | undefined;
    }

  export const IsDateString = (options?: IsISO8601Options, validationOptions?: ValidationOptions) => 
  ValidateBy(
    {
      name: 'IS_DATE_STRING',
      constraints: [options],
      validator: {
        validate: (value): boolean => isIso8601String(value, options),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid ISO 8601 date string',
          validationOptions
        ),
      },
    },
    validationOptions
  )