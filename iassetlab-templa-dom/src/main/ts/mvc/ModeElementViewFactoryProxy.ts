///<reference path="IElementViewFactory.ts"/>
///<reference path="ModeElementViewProxy.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {

    // Class
    export class ModeElementViewFactoryProxy implements IElementViewFactory {
        // Constructor
        constructor(private _modeFunction: (IElementReference) => string, private _modesToFactories: { string: IElementViewFactory; }) {

        }

        create(container: IElementReference, prepend?: bool):IElementView {
            var mode = this._modeFunction(container);
            var factory:IElementViewFactory = this._modesToFactories[mode];
            var result;
            if (factory != null) {
                var view = factory.create(container, prepend);
                result = new ModeElementViewProxy(container, view, mode, this._modeFunction);
            } else {
                result = null;
            }
            return result;
        }
    }

}