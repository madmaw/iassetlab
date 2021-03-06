﻿// Module
module templa.util.Strings {

    export function format(format: string, params: any[]): string {
        var anyFormat = <any>format;
        var result;
        if (anyFormat.format) {
            // do it natively
            result = anyFormat.format.apply(anyFormat, params);
        } else {
            // do it using regex
            var f = function (match:string, num?:string) : string {
                return typeof params[num] != 'undefined'
                    ? params[num]
                    : match
                    ;
            };
            result = format.replace(<string><any>(/{(\d+)}/g), f);
        }
        return result;
    }

}

