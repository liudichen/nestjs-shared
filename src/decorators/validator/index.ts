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
          return `${validationArguments?.property}: Data type mismatch`;
        },
      },
    },
    validationOptions,
  );

/**Dto中验证是否是某1类型的元素或其数组 */
export const IsSelfOrArrayType = (
  /**class-validator的几个内置类型或可选值的数组或一个自定义的校验函数 */
  typeOrValueRangeArrayOrValidator:
    | keyof typeof InnerTypesValidator
    | ((value: any) => boolean)
    | any[],
  validationOptions?: ValidationOptions,
) =>
  ValidateBy(
    {
      name: 'IS_SELF_OR_ARRAY_TYPE',
      validator: {
        validate: (value: any) =>
          typeof typeOrValueRangeArrayOrValidator === 'function'
            ? typeOrValueRangeArrayOrValidator(value)
            : Array.isArray(typeOrValueRangeArrayOrValidator)
            ? Array.isArray(value)
              ? value.every((ele) =>
                  typeOrValueRangeArrayOrValidator.includes(ele),
                )
              : typeOrValueRangeArrayOrValidator.includes(value)
            : InnerTypesValidator[typeOrValueRangeArrayOrValidator]?.(value),
        defaultMessage: (validationArguments?: ValidationArguments) => {
          return `${validationArguments?.property}: Data type mismatch`;
        },
      },
    },
    validationOptions,
  );
