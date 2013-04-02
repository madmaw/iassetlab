///<reference path="HeightSettingElementViewProxy.ts"/>
///<reference path="../IElementViewFactory.ts"/>

// Module
module templa.mvc.element.jquery {

    // Class
    export class HeightSettingElementViewProxyFactory implements IElementViewFactory {
        // Constructor
        constructor(private _proxied:IElementViewFactory, private _variableHeightSelector:string, private _fixedHeightSelectors:string[]) {
        }

        public create(container: IElementReference): IElementView {
            var proxied = this._proxied.create(container);
            return new HeightSettingElementViewProxy(proxied, this._variableHeightSelector, this._fixedHeightSelectors);
        }
    }

}