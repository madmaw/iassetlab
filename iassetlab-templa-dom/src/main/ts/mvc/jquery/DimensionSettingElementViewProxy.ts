///<reference path="../IElementView.ts"/>

///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {

    // Class
    export class DimensionSettingElementViewProxy implements IElementView {
        // Constructor
        constructor(
            private _proxied: IElementView,
            private _variableDimensionSelector: string,
            private _fixedWidthSelectors: string[],
            private _fixedHeightSelectors: string[],
            private _widthAttribute?: string,
            private _heightAttribute?: string,
            private _maxHeightSelectors?:string[]
        ) {
            if (this._widthAttribute == null) {
                this._widthAttribute = "width";
            }
            if (this._heightAttribute == null) {
                this._heightAttribute = "height";
            }
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

        public layout(): boolean {
            var result: boolean = this._proxied.layout();
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
                if (this._maxHeightSelectors != null) {
                    var maxHeight = height;
                    for (var i in this._maxHeightSelectors) {
                        var maxHeightSelector = this._maxHeightSelectors[i];
                        var allVariableDimensionElements = $(maxHeightSelector);
                        var newHeight = Math.max.apply(null, allVariableDimensionElements.map(function () { return $(this).height(); }).get());
                        if (newHeight > maxHeight) {
                            maxHeight = newHeight;
                        }
                    }
                    if (height < maxHeight) {
                        height = maxHeight;
                    }
                }
                variableDimensionElement.css(this._heightAttribute, height + "px");
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
                variableDimensionElement.css(this._widthAttribute, width + "px");
            }
            return result;
        }
    }
}