///<reference path="../IElementView.ts"/>
///<reference path="../../../../d.ts/jquery.d.ts"/>

// Module
module templa.mvc.element.jquery {

    // Class
    export class HeightSettingElementViewProxy implements IElementView {
        // Constructor
        constructor(private _proxied:IElementView, private _variableHeightSelector:string, private _fixedHeightSelectors:string[]) {

        }

        public getRoots(): Node[]{
            return this._proxied.getRoots();
        }

        public attach(): void {
            this._proxied.attach();
            // layout
            this.layout();
        }

        public detach(): void {
            this._proxied.detach();
        }

        public layout(): bool {
            var result: bool = this._proxied.layout();
            var variableHeightElement = $(<Element[]><any>this.getRoots()).find(this._variableHeightSelector);
            var fixedHeight = 0;
            for (var i in this._fixedHeightSelectors) {
                var fixedHeightSelector = this._fixedHeightSelectors[i];
                var fixedHeightElement = $(fixedHeightSelector);
                fixedHeight += fixedHeightElement.outerHeight(true);
            }
            var windowHeight = window.innerHeight;
            var height = windowHeight - fixedHeight;
            variableHeightElement.height(height);
            return result;
        }
    }
}