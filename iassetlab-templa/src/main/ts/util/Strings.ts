// Module
module templa.util.Strings {

    export function format(format: string, params: any[]): string {
        var anyFormat = <any>format;
        var result;
        if (anyFormat.format) {
            // do it natively
            result = anyFormat.format.apply(anyFormat, params);
        } else {
            // do it using regex
            result = format.replace(/{(\d+)}/g, function (match, number) {
                return typeof params[number] != 'undefined'
                  ? params[number]
                  : match
                ;
            });
        }
        return result;
    }

}

