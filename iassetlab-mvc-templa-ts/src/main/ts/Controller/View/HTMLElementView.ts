///<reference path="../IElementView.ts"/>

module Templa.Controller.View {
    export class HTMLElementView implements Templa.Controller.IElementView {

        private _html:string;
        private _container:Element;

        constructor(_html:string, _container:Element) {
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
            var children: Element[] = this.getRoots();
            return this._find(key, children);
        }

        private _find(key:string, elements:Element[]):Element {
            var result = null;
            for( var i in elements ) {
                var element = elements[i];
                var attributeValue = element.getAttribute("key");
                if( attributeValue == key ) {
                    result = element;
                    break;
                } else {
                    result = this._find(key, element.children);
                    if( result != null ) {
                        break;
                    }
                }
            }
            return result;
        }

        public getRoots():Element[] {
            return this._container.children;
        }
    }
}