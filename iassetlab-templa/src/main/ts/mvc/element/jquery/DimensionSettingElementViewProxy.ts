///<reference path="../IElementView.ts"/>
///<reference path="../../../../d.ts/jquery.d.ts"/>

// Module
module templa.mvc.element.jquery {

    // Class
    export class DimensionSettingElementViewProxy implements IElementView {
        // Constructor
        constructor(private _proxied:IElementView, private _variableDimensionSelector:string, private _fixedWidthSelectors:string[], private _fixedHeightSelectors:string[]) {

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
            var variableDimensionElement = $(<Element[]><any>this.getRoots());
            if (this._variableDimensionSelector != null) {
                variableDimensionElement = variableDimensionElement.find(this._variableDimensionSelector);
            }
            if (this._fixedHeightSelectors != null) {
                var fixedHeight = 0;
                for (var i in this._fixedHeightSelectors) {
                    var fixedHeightSelector = this._fixedHeightSelectors[i];
                    var fixedHeightElement = $(fixedHeightSelector);
                    fixedHeight += fixedHeightElement.outerHeight(true);
                }
                var windowHeight = window.innerHeight;
                var height = windowHeight - fixedHeight;
                variableDimensionElement.height(height);
            }
            if (this._fixedWidthSelectors != null) {
                var fixedWidth = 0;
                for (var i in this._fixedWidthSelectors) {
                    var fixedWidthSelector = this._fixedWidthSelectors[i];
                    var fixedWidthElement = $(fixedWidthSelector);
                    fixedWidth += fixedWidthElement.outerHeight();
                }
                var windowWidth = window.innerWidth;
                var width = windowWidth - fixedWidth;
                variableDimensionElement.width(width);
            }
            return result;
        }
    }
}