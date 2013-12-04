///<reference path="../IElementView.ts"/>
///<reference path="../IElementReference.ts"/>

///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {

    // Class
    export class BorrowedElementView implements IElementView {
        // Constructor
        constructor(private _container: IElementReference, private _selector: string) {
            if (this._container == null) {
                throw "no container!";
            }
        }

        getRoots(): Node[]{
            var result;
            if (this._selector != null) {
                var query = $([this._container.resolve()]).select(this._selector);
                result = [];
                for (var i = 0; i < query.length; i++) {
                    result.push(query.get(i));
                }
            } else {
                result = [this._container.resolve()];
            }
            return result;
        }

        attach() {
            // do nothing, it's already attached
        }

        detach() {
            // do nothing, it's someone else's job
        }

        layout(): boolean {
            // nope
            return false;
        }

    }

}