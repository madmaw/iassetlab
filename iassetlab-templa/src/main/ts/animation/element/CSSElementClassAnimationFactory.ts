///<reference path="IElementAnimationFactory.ts"/>
///<reference path="CSSElementClassAnimation.ts"/>

// Module
module templa.animation.element {

    // Class
    export class CSSElementClassAnimationFactory implements IElementAnimationFactory {
        // Constructor
        constructor(private _class: string, private _maxTimeMillis?: number) {

        }

        public create(container: Element, view: Element): IAnimation {
            return new CSSElementClassAnimation(view, this._class, this._maxTimeMillis);
        }
    }

}

