///<reference path="DimensionSettingElementViewProxy.ts"/>
///<reference path="../IElementViewFactory.ts"/>
///<reference path="../IElementView.ts"/>
///<reference path="../IElementReference.ts"/>

///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {

    // Class
    export class DimensionSettingElementViewProxyFactory implements IElementViewFactory {
        // Constructor
        constructor(
            private _proxied: IElementViewFactory,
            private _variableDimensionSelector: string,
            private _fixedWidthSelectors: string[],
            private _fixedHeightSelectors: string[],
            private _widthAttribute?: string,
            private _heightAttribute?: string,
            private _maxHeightSelectors?: string[]
        ) {
        }

        public create(container: IElementReference, prepend?:boolean): IElementView {
            var proxied = this._proxied.create(container, prepend);
            return new DimensionSettingElementViewProxy(
                proxied,
                this._variableDimensionSelector,
                this._fixedWidthSelectors,
                this._fixedHeightSelectors,
                this._widthAttribute,
                this._heightAttribute,
                this._maxHeightSelectors
            );
        }
    }

}