///<reference path="IElementAnimationFactory.ts"/>
///<reference path="CSSElementClassAnimation.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.animation {

    // Class
    export class CSSElementClassAnimationFactory implements IElementAnimationFactory {
        // Constructor
        constructor(private _class: string, private _maxTimeMillis?: number, private _lifecycleFunction?:(phase:string, view:Element) => void) {

        }

        public create(container: Element, view: Element): templa.animation.IAnimation {
            return new CSSElementClassAnimation(view, this._class, this._maxTimeMillis, this._lifecycleFunction);
        }
    }

}

