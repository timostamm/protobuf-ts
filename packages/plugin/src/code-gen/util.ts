export function camelToUnderscore(str: string) {
    if (str.length === 0) {
        return str
    }
    // Handles the cases where first character is uppercase.
    const lowercaseFirstCharacter = str[0].toLowerCase()
    let result = lowercaseFirstCharacter + str.slice(-(str.length - 1));
    result = result.replace( /([A-Z])/g, " $1" );
    return result.split(' ').join('_').toLowerCase();
}