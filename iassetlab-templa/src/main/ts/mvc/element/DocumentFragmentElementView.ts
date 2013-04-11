///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="../../util/Elements.ts"/>

module templa.mvc.element {
    export class DocumentFragmentElementView implements IElementView {

        public static createFromHTML(html: string, container: IElementReference, id: string) {
            var fragment: DocumentFragment = document.createDocumentFragment();
            var element = document.createElement("div");
            if (html != null) {
                element.innerHTML = html;
            }
            var childNodes = element.childNodes;
            for (var i in childNodes) {
                var childNode: Node = childNodes[i];
                if (childNode instanceof Element) {
                    //element.removeChild(childNode);
                    // don't actually need to clone it
                    //var clone:Element = <any>childNode;
                    var clone: Element = <any>childNode.cloneNode(true);
                    clone.setAttribute("view_id", id);
                    fragment.appendChild(clone);
                }
            }

            return new DocumentFragmentElementView(fragment, container, id);
        }

        private _attached: bool;

        constructor(private _fragment:DocumentFragment, private _container: IElementReference, private _id: string) {
            this._attached = false;
            if (this._container == null) {
                throw new Error("no container!");
            }
        }

        public attach() {
            this._container.resolve().appendChild(this._fragment);
            this._attached = true;
        }

        public detach() {
            var elements = this.getRoots();
            var container: Node = this._container.resolve();
            for (var i in elements) {
                var element = elements[i];
                container.removeChild(element);
            }
            this._attached = false;
            /* NO?!
            var childNodes = this._fragment.childNodes;
            for (var i in childNodes) {
                var childNode = childNodes[i];
                container.removeChild(childNode);
            }
            */

        }

        public layout(): bool {
            return false;
        }

        public getRoots():Node[] {
            var roots = [];
            var childNodes;
            if (this._attached) {
                var container = this._container.resolve();
                childNodes = container.childNodes;
            } else {
                childNodes = this._fragment.childNodes;
            }
            for (var i in childNodes) {
                var childNode: Element = childNodes[i];
                if (childNode instanceof Element && childNode.getAttribute("view_id") == this._id) {
                    roots.push(childNode);
                }
            }
            return roots;
            //return this.getChildren();
        }

        /*
        public get _element(): Node {
            // find ourselves
            var childNodes;
            if (this._attached) {
                var container = this._container.resolve();
                childNodes = container.childNodes;
            } else {
                childNodes = this._fragment.childNodes;
            }
            for (var i in childNodes) {
                var childNode: Element = childNodes[i];
                if (childNode instanceof Element && childNode.getAttribute("id") == this._id) {
                    return childNode;
                }
            }
            return null;
        }
    */
    }
}