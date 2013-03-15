// Type definitions for Handlebars 1.0
// Project: http://handlebarsjs.com/
// Definitions by: Boris Yankov <https://github.com/borisyankov/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


module Handlebars {
    export function registerHelper(name: string, fn: Function, inverse?: bool): void;
    export function registerPartial(name: string, str): void;
    export function K();
    export function createFrame(object);

    export class Exception {
        constructor(message: string);
    }
    export class SafeString {
        constructor(str: string);
    } 

    export function parse(string: string);
    export function print(ast);
    export var logger;
    export function log(level, str): void;
    export function compile(environment, options?, context?, asObject?):(any)=>string;
}
