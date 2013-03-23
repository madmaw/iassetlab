///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="../../util/Elements.ts"/>

module templa.mvc.element {
    export class HTMLElementView implements IElementView {

        constructor( private _html: string, private _container: IElementReference, private _id:string) {
        }

        public attach() {
            (<HTMLElement><any>this._container.resolve()).innerHTML += this._html;
        }

        public detach() {
            var node:Element = this._container.resolve();
            node.removeChild(this.div);
        }

        public find(key:string):IElementReference {
            return new AttributeElementReference(this, "key", key);
        }

        public getRoots():Node[] {
            var div = this.div;
            var roots = [];
            if (div != null) {
                roots.push(div);
            }
            return roots;
            //return this.getChildren();
        }

        public get div(): HTMLElement {
            // find ourselves
            var div = document.getElementById(this._id);
            return div;
        }
    }
}