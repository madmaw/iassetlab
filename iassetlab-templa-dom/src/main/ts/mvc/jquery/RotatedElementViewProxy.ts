///<reference path="../IElementView.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {

    export class RotatedElementViewProxy implements templa.dom.mvc.IElementView {
        constructor(private _container: templa.dom.mvc.IElementReference, private _useContainer: bool, private _prepend: bool, private _proxied: templa.dom.mvc.IElementView, private _root: Element) {

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