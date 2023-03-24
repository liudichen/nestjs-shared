import {
  ValidationArguments,
  ValidationOptions,
  ValidateBy,
  isNumber,
  isString,
  isNumberString,
  isInt,
  isArray,
  isBoolean,
} from 'class-validator';

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
          return `${validationArguments?.property}-数据类型不匹配`;
        },
      },
    },
    validationOptions,
  );
