///<reference path="../IElementView.ts"/>

module Templa.Controller.View {
    export class HTMLElementView implements Templa.Controller.IElementView {

        private _html:string;
        private _container: HTMLElement;

        constructor(_html: string, _container: HTMLElement) {
            this._html = _html;
            this._container = _container;
        }

        public attach() {
            this._container.innerHTML = this._html;
        }

        public detach() {
            this._container.innerHTML = "";
        }

        public find(key:string):Element {
            var children: Node[] = this.getRoots();
            return this._find(key, children);
        }

        private _find(key:string, nodes:Node[]):Element {
            var result = null;
            for( var i in nodes ) {
                var node: Node = nodes[i];
                if (node instanceof HTMLElement) {
                    var element: HTMLElement = <HTMLElement>node;
                    var attributeValue = element.getAttribute("key");
                    if (attributeValue == key) {
                        result = node;
                        break;
                    } else {
                        var children = this.getRoots(element);
                        result = this._find(key, children);
                        if (result != null) {
                            break;
                        }
                    }
                }
            }
            return result;
        }

        public getRoots(container?: HTMLElement): Node[]{
            if (container == null) {
                container = this._container;
            }
            var collection: NodeList = container.childNodes;
            var result: Node[] = [];
            var i = 0;
            while (i < collection.length) {
                var node: Node = collection.item(i);
                result.push(<Element>node);
                i++;
            }
            return result;
        }
    }
}