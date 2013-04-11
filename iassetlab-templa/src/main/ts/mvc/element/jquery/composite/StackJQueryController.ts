///<reference path="AbstractCompositeJQueryController.ts"/>
///<reference path="../../../composite/IStackControllerModel.ts"/>
///<reference path="../../../composite/StackControllerModelChangeDescription.ts"/>
///<reference path="../../../../animation/element/IElementAnimationFactory.ts"/>
///<reference path="../../../../animation/IAnimation.ts"/>
///<reference path="../../../../animation/AnimationStateChangeEvent.ts"/>

//  this doesn't actually use an JQuery features
module templa.mvc.element.jquery.composite {

    export interface IStackAnimationFactoryBundle {
        popAddAnimationFactory?: templa.animation.element.IElementAnimationFactory;
        popRemoveAnimationFactory?: templa.animation.element.IElementAnimationFactory;
        pushAddAnimationFactory?: templa.animation.element.IElementAnimationFactory;
        pushRemoveAnimationFactory?: templa.animation.element.IElementAnimationFactory;
        selector?: string;
    }

    export class StackJQueryController extends AbstractCompositeJQueryController {

        private _backCommand: Command;

        private removedAnimatedChildren: IController[];

        constructor(
            viewFactory: templa.mvc.element.IElementViewFactory,
            private _animationFactoryBundles:IStackAnimationFactoryBundle[]
        ) {
            super(viewFactory);
            this.removedAnimatedChildren = [];
            this._backCommand = new Command(
                "back",
                CommandTypeBack,
                1,
                () => {
                    this._back();
                }
            );
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            var stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPushed);
            if (stackChangeDescription == null) {
                stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPopped);
            }
            if ( stackChangeDescription != null ) {
                var stackDescription: templa.mvc.composite.StackControllerModelChangeDescription = stackChangeDescription;

                var addAnimationFactoryName:string;
                var removeAnimationFactoryName:string;
                
                if (stackDescription.changeType == templa.mvc.composite.stackControllerModelEventPushed) {
                    addAnimationFactoryName = "pushAddAnimationFactory";
                    removeAnimationFactoryName = "pushRemoveAnimationFactory";
                } else {
                    addAnimationFactoryName = "popAddAnimationFactory";
                    removeAnimationFactoryName = "popRemoveAnimationFactory";
                }

                var hiddenController = stackDescription.previousController;
                if (hiddenController != null) {
                    var maxState: number;
                    var hiddenView: IElementView;
                    if (this.getState() >= ControllerStateInitialized ) {
                        var container = this.getControllerContainer(hiddenController);
                        maxState = ControllerStateInitialized;
                        hiddenView = <any>hiddenController.getView();
                        var animated = this._animate(
                            container,
                            hiddenView,
                            removeAnimationFactoryName,
                            this,
                            (source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => {
                                if (event.animationState == templa.animation.animationStateFinished) {
                                    hiddenView.detach();
                                }
                            }
                        );
                        if (!animated) {
                            // remove immediately
                            hiddenView = null;
                        }
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

                var pushedController = stackDescription.topController;
                if (pushedController != null) {

                    this._add(pushedController);
                    var pushedView: IElementView = <any>pushedController.getView();
                    var container = this.getControllerContainer(pushedController);
                    this._animate(container, pushedView, addAnimationFactoryName, <AbstractController>pushedController);
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
            } else {
                super._handleModelChangeEvent(event);
            }
            this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
        }

        public _back() {
            var stackControllerModel: templa.mvc.composite.IStackControllerModel = <templa.mvc.composite.IStackControllerModel>this._model;
            stackControllerModel.requestPop();
        }

        public getCommands(): Command[]{
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

        private _animate(container: IElementReference, view: IElementView, animationFactoryName: string, ownerController: AbstractController, animationCompletionListener?: (source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => void ): bool {
            var result: bool = false;

            var roots: Node[] = view.getRoots();
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
                    var containerElement = container.resolve();
                    for (var j = 0; j < jquery.length; j++) {
                        var toAnimate = jquery.get(j);
                        var animation = animationFactory.create(containerElement, <any>toAnimate);
                        result = true;
                        if (animationCompletionListener) {
                            // TODO aggregate all the animation completions into one callback
                            animation.addAnimationListener(animationCompletionListener);
                        }
                        ownerController._addAnimation(animation, false);
                    }
                }
            }

            return result;
        }
    }
}