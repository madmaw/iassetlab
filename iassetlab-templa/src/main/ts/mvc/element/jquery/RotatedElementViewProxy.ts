///<reference path="../IElementView.ts"/>
///<reference path="../../../../d.ts/jquery.d.ts"/>

module templa.mvc.element.jquery {

    export class RotatedElementViewProxy implements templa.mvc.element.IElementView {
        constructor(private _container:templa.mvc.IElementReference, private _useContainer:bool, private _prepend:bool, private _proxied: templa.mvc.element.IElementView, private _root: Element) {

        }

        getRoots(): Node[]{
            if (this._root != null) {
                return [this._root];
            } else {
                return this._proxied.getRoots();
            }
        }

        attach() {
            this._proxied.attach();
            if (this._root != null) {
                if (this._prepend) {
                    var element = this._container.resolve();
                    element.insertBefore(this._root, element.firstElementChild);
                } else {
                    this._container.resolve().appendChild(this._root);
                }
            }
        }

        detach() {
            this._proxied.detach();
            if (this._root != null) {
                this._container.resolve().removeChild(this._root);
            }
        }

        layout():bool {
            var result = this._proxied.layout();
            if (!result) {
                // size off inner value
                var toSize;
                $(this._root).removeAttr("width").removeAttr("height").removeAttr("margin-top").removeAttr("margin-bottom");
                var query = $(this._proxied.getRoots());
                var width = query.width();
                var height = query.height();
                if (this._useContainer) {
                    toSize = this._container.resolve();
                    if (this._root != null) {
                        $(this._root).width(height).height(width).css("margin-top", Math.round(width/2) + "px").css("margin-bottom", "-" + Math.round(width/2) + "px");
                    }
                } else {
                    toSize = this._root;
                }
                $(toSize).width(height).height(width);
            }
            return result;
        }
    }

}