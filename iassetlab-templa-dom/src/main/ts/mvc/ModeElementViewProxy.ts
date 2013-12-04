///<reference path="IElementReference.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {

    // Class
    export class ModeElementViewProxy implements IElementView {

        // Constructor
        constructor(
            private _container: IElementReference,
            private _proxied: IElementView,
            private _currentMode: string,
            private _modeFunction: (IElementReference) => string
        ) {

        }

        getRoots(): Node[]{
            return this._proxied.getRoots();
        }

        attach() {
            this._proxied.attach();
        }

        detach() {
            this._proxied.detach();
        }

        layout(): boolean {
            // check ratio
            var ratio = window.innerWidth / window.innerHeight;
            var needsExternalLayout;
            var mode = this._modeFunction(this._container);
            if (mode != this._currentMode) {
                needsExternalLayout = true;
            } else {
                needsExternalLayout = this._proxied.layout();
            }
            return needsExternalLayout;
        }
    }

}