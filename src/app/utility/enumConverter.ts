// Given an enum and a value as a string, converts a string to the enum type
// The string must match the enum keys
function convertStringToEnum<T> (type: T, value: string): T[keyof T] | null {
    const enumValue = (type as any)[value.toUpperCase()];
    return enumValue;
}

export { convertStringToEnum }
