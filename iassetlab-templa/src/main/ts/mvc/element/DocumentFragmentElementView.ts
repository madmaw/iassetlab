///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="../../util/Elements.ts"/>

module templa.mvc.element {
    export class DocumentFragmentElementView implements IElementView {

        private _fragment: DocumentFragment;

        constructor(_html: string, private _container: IElementReference, private _id: string) {
            // probably should do this in the factory!?
            var fragment: DocumentFragment = document.createDocumentFragment();
            var element = document.createElement("div");
            element.setAttribute("id", this._id);
            element.innerHTML = _html;
            fragment.appendChild(element);
            this._fragment = fragment;
        }

        public attach() {
            this._container.resolve().appendChild(this._fragment);
        }

        public detach() {
            var element = this._element;
            if (element != null) {
                var container:Node = this._container.resolve();
                container.removeChild(element);
            }
            /* NO?!
            var childNodes = this._fragment.childNodes;
            for (var i in childNodes) {
                var childNode = childNodes[i];
                container.removeChild(childNode);
            }
            */

        }

        public getRoots():Node[] {
            var element = this._element;
            var roots = [];
            if (element != null) {
                roots.push(element);
            }
            return roots;
            //return this.getChildren();
        }

        public get _element(): Node {
            // find ourselves
            var container = this._container.resolve();
            var childNodes = container.childNodes;
            for (var i in childNodes) {
                var childNode: Element = childNodes[i];
                if (childNode instanceof Element && childNode.getAttribute("id") == this._id) {
                    return childNode;
                }
            }
            return null;
        }
    }
}