// Module
module templa.util.Elements {

    export function find(attribute: string, value: string, nodes: Node[], filter?:(o:Node)=>bool): Element {
        var result = null;
        for (var i in nodes) {
            var node: Node = nodes[i];
            if (node instanceof HTMLElement) {
                var element: HTMLElement = <HTMLElement>node;
                var attributeValue = element.getAttribute(attribute);
                if (attributeValue == value) {
                    result = node;
                    break;
                } else {
                    var children = getChildren(element, filter);
                    result = find(attribute, value, children, filter);
                    if (result != null) {
                        break;
                    }
                }
            }
        }
        return result;
    }

    export function getChildren(container: HTMLElement, filter?: (o: Node) => bool): Node[] {
        var collection: NodeList = container.childNodes;
        var result: Node[] = [];
        var i = 0;
        while (i < collection.length) {
            var node: Node = collection.item(i);
            if (filter == null || filter(node)) {
                result.push(node);
            }
            i++;
        }
        return result;
    }



}