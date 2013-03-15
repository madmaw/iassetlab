// Module
module templa.util.Arrays {

    export function removeElement(array: any[], element:any): bool {
        var result: bool = false;
        var index = array.length;
        while (index > 0) {
            index--;
            var found = array[index];
            if (found == element) {
                result = true;
                array.splice(index, 1);
                break;
            }
        }
        return result;
    }

    export function pushAll(array: any[], elements: any[]) {
        for (var i in elements) {
            var element = elements[i];
            array.push(element);
        }
    }


}

