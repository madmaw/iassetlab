///<reference path="IElementView.ts"/>

module templa.mvc.element {
    export class HTMLElementView implements IElementView {

        private _html:string;
        private _container: HTMLElement;
        private _div: HTMLElement;
        private _id: string;

        constructor(_html: string, _container: HTMLElement, _id:string) {
            this._html = _html;
            this._container = _container;
            this._id = _id;
        }

        public attach() {
            this._container.innerHTML += this._html;
            // find ourselves
            this._div = <HTMLElement><any>this._find("id", this._id, <Node[]>[<Node><any>this._container]);
        }

        public detach() {
            this._div.parentNode.removeChild(this._div);
            this._div = null;
        }

        public find(key:string):Element {
            var children: Node[] = this.getRoots();
            return this._find("key", key, children);
        }

        private _find(attribute:string, value:string, nodes:Node[]):Element {
            var result = null;
            for( var i in nodes ) {
                var node: Node = nodes[i];
                if (node instanceof HTMLElement) {
                    var element: HTMLElement = <HTMLElement>node;
                    var attributeValue = element.getAttribute(attribute);
                    if (attributeValue == value) {
                        result = node;
                        break;
                    } else {
                        var children = this.getChildren(element);
                        result = this._find(attribute, value, children);
                        if (result != null) {
                            break;
                        }
                    }
                }
            }
            return result;
        }

        public getRoots() {
            return [this._div];
            //return this.getChildren();
        }

        public getChildren(container?: HTMLElement): Node[]{
            if (container == null) {
                container = this._div;
            }
            var collection: NodeList = container.childNodes;
            var result: Node[] = [];
            var i = 0;
            while (i < collection.length) {
                var node: Node = collection.item(i);
                result.push(node);
                i++;
            }
            return result;
        }
    }
}