///<reference path="AbstractCompositeJQueryController.ts"/>
///<reference path="../../../animation/IElementAnimationFactory.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 

// Module
module templa.dom.mvc.jquery.composite {

    export interface IStackAnimationFactoryBundle {
        popAnimationFactory?: templa.dom.animation.IElementAnimationFactory;
        pushAnimationFactory?: templa.dom.animation.IElementAnimationFactory;
        selector?: string;
    }

    export class StackJQueryController extends AbstractCompositeJQueryController {

        private _backCommand: templa.mvc.Command;

        private removedAnimatedChildren: templa.mvc.IController[];

        constructor(
            viewFactory: templa.dom.mvc.IElementViewFactory,
            private _animationFactoryBundles:IStackAnimationFactoryBundle[]
        ) {
            super(viewFactory);
            this.removedAnimatedChildren = [];
            this._backCommand = new templa.mvc.Command(
                "back",
                templa.mvc.CommandTypeBack,
                1,
                () => {
                    this._back();
                }
            );
        }

        public setAnimationFactoryBundles(_animationFactoryBundles: IStackAnimationFactoryBundle[]) {
            this._animationFactoryBundles = _animationFactoryBundles;
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            var pushed: bool;
            var stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPushed);
            if (stackChangeDescription == null) {
                stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPopped);
                pushed = false;
            } else {
                pushed = true;
            }
            if ( stackChangeDescription != null ) {
                var stackDescription: templa.mvc.composite.StackControllerModelChangeDescription = stackChangeDescription;

                // remove all the silent ones (if any)
                var silentRemovedControllers = stackDescription.silentRemovedControllers;
                if (silentRemovedControllers != null) {
                    for (var i in silentRemovedControllers) {
                        var silentRemovedController = silentRemovedControllers[i];
                        this._remove(silentRemovedController, true, false);
                    }
                }
                // add all the silent ones (if any)
                var silentAddedControllers = stackDescription.silentAddedControllers;
                if (silentAddedControllers != null) {
                    for (var i in silentAddedControllers) {
                        var silentAddedController = silentAddedControllers[i];
                        this._add(silentAddedController, false, false, false);
                    }
                }

                var animationFactoryName:string;
                
                if (pushed) {
                    animationFactoryName = "pushAnimationFactory";
                } else {
                    animationFactoryName = "popAnimationFactory";
                }

                var hiddenController = stackDescription.removedController;
                var hiddenView: IElementView;
                if (hiddenController != null) {
                    var maxState: number;
                    if (this.getState() >= templa.mvc.ControllerStateInitialized ) {
                        maxState = templa.mvc.ControllerStateInitialized;
                        hiddenView = <any>hiddenController.getView();
                        /*
                        var roots: Node[] = hiddenView.getRoots();
                        for (var i in roots) {
                            var root = roots[i];
                            var animation = removeAnimationFactory.create(<any>container, <any>root);
                            animation.addAnimationListener((source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => {
                                if (event.animationState == templa.animation.animationStateFinished) {
                                    hiddenView.detach();
                                }
                            });
                            this._addAnimation(animation, false);
                        }
                        */
                    } else {
                        maxState = null;
                        hiddenView = null;
                    }
                    this._remove(hiddenController, hiddenView == null);
                }

                var addedController = <templa.dom.mvc.IElementController>stackDescription.addedController;
                if (addedController != null) {

                    this._add(addedController, true, true, !pushed);
                    var pushedView: IElementView = <any>addedController.getView();
                    /*
                    var roots: Node[] = pushedView.getRoots();
                    for (var i in roots) {
                        var root = roots[i];
                        var animation = addAnimationFactory.create(<any>container, <any>root);
                        // add it to the controller so it can manage its own animations
                        pushedController.addAnimation(animation);
                    }
                        */
                }
                var animated;
                if (addedController != null || hiddenController != null) {
                    var animationListener;
                    if (hiddenView != null) {
                        animationListener = (source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => {
                            if (event.animationState == templa.animation.animationStateFinished) {
                                hiddenView.detach();
                            }
                        }
                    } else {
                        animationListener = null;
                    }
                    animated = this._animate(
                        animationFactoryName,
                        animationListener
                    );
                } else {
                    animated = false;
                }
                if (!animated && hiddenView != null) {
                    // remove immediately
                    hiddenView.detach();
                }
                this.layout();
                this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));

            } else {
                super._handleModelChangeEvent(event);
            }
            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
        }

        public _back() {
            var stackControllerModel: templa.mvc.composite.IStackControllerModel = <templa.mvc.composite.IStackControllerModel>this._model;
            stackControllerModel.requestPop();
        }

        public getCommands(): templa.mvc.Command[]{
            var commands = super.getCommands();
            var stackControllerModel: templa.mvc.composite.IStackControllerModel = <templa.mvc.composite.IStackControllerModel>this._model;
            if (stackControllerModel != null && stackControllerModel.canPop()) {
                if (commands == null) {
                    commands = [];
                }
                commands.push(this._backCommand);
            }
            
            return commands;
        }

        private _animate(animationFactoryName: string, animationCompletionListener?: (source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => void ): bool {
            var result: bool = false;

            var count = 0;
            var completionCount = 0;

            var roots: Node[] = this._view.getRoots();
            for (var i in this._animationFactoryBundles) {
                var animationFactoryBundle:IStackAnimationFactoryBundle = this._animationFactoryBundles[i];
                var animationFactory = animationFactoryBundle[animationFactoryName];
                if (animationFactory != null) {
                    var selector = animationFactoryBundle.selector;
                    var jquery: JQuery = $(<Element[]>roots);
                    if (selector != null) {
                        var self: JQuery = $(<Element[]>roots).filter(selector);
                        jquery = jquery.find(selector).add(self);
                    }
                    // TODO work out which element has a root
                    var containerElement = this._view.getRoots()[0];
                    for (var j = 0; j < jquery.length; j++) {
                        var toAnimate = jquery.get(j);
                        var animation = animationFactory.create(containerElement, <any>toAnimate);
                        count++;
                        result = true;
                        if (animationCompletionListener != null) {
                            // aggregate all the animation completions into one callback
                            animation.addAnimationListener(
                                function (source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) {
                                    if (event.animationState == templa.animation.animationStateFinished) {
                                        completionCount++;
                                        if (completionCount == count) {
                                            animationCompletionListener(source, event);
                                        }
                                    }
                                }
                            );
                        }
                        this._addAnimation(animation, false);
                    }
                }
            }
            if (count == 0 && animationCompletionListener != null) {
                // animation is complete now
                animationCompletionListener(null, new templa.animation.AnimationStateChangeEvent(templa.animation.animationStateFinished));
            }
            return result;
        }
    }
}