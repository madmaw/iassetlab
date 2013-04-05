///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="../../util/Elements.ts"/>

module templa.mvc.element {
    export class DocumentFragmentElementView implements IElementView {

        public static createFromHTML(html: string, container: IElementReference, id: string, divClass?:string) {
            var fragment: DocumentFragment = document.createDocumentFragment();
            var element = document.createElement("div");
            element.setAttribute("id", id);
            if (divClass != null) {
                element.setAttribute("class", divClass);
            }
            if (html != null) {
                element.innerHTML = html;
            }
            fragment.appendChild(element);

            return new DocumentFragmentElementView(fragment, container, id);
        }

        private _attached: bool;

        constructor(private _fragment:DocumentFragment, private _container: IElementReference, private _id: string) {
            this._attached = false;
        }

        public attach() {
            this._container.resolve().appendChild(this._fragment);
            this._attached = true;
        }

        public detach() {
            var element = this._element;
            if (element != null) {
                var container:Node = this._container.resolve();
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
    }
}