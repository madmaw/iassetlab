///<reference path="AbstractCompositeJQueryController.ts"/>
///<reference path="../../../composite/IStackControllerModel.ts"/>
///<reference path="../../../composite/StackControllerModelChangeDescription.ts"/>
///<reference path="../../../../animation/element/IElementAnimationFactory.ts"/>
///<reference path="../../../../animation/IAnimation.ts"/>
///<reference path="../../../../animation/AnimationStateChangeEvent.ts"/>

//  this doesn't actually use an JQuery features
module templa.mvc.element.jquery.composite {
    export class StackJQueryController extends AbstractCompositeJQueryController {

        private _backCommand: Command;

        private removedAnimatedChildren: IController[];

        constructor(
            viewFactory: templa.mvc.element.IElementViewFactory,
            private _popAddAnimationFactory?: templa.animation.element.IElementAnimationFactory,
            private _popRemoveAnimationFactory?: templa.animation.element.IElementAnimationFactory,
            private _pushAddAnimationFactory?: templa.animation.element.IElementAnimationFactory,
            private _pushRemoveAnimationFactory?: templa.animation.element.IElementAnimationFactory
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

                var addAnimationFactory;
                var removeAnimationFactory;
                
                if (stackDescription.changeType == templa.mvc.composite.stackControllerModelEventPushed) {
                    addAnimationFactory = this._pushAddAnimationFactory;
                    removeAnimationFactory = this._pushRemoveAnimationFactory;
                } else {
                    addAnimationFactory = this._popAddAnimationFactory;
                    removeAnimationFactory = this._popRemoveAnimationFactory;
                }

                var hiddenController = stackDescription.previousController;
                if (hiddenController != null) {
                    var maxState: number;
                    var hiddenView: IElementView;
                    if (removeAnimationFactory != null && this.getState() >= ControllerStateInitialized ) {
                        var container = this.getControllerContainer(hiddenController);
                        hiddenView = <any>hiddenController.getView();
                        maxState = ControllerStateInitialized;
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
                    } else {
                        maxState = null;
                        hiddenView = null;
                    }
                    this._remove(hiddenController, hiddenView == null);
                }

                var pushedController = stackDescription.topController;
                if (pushedController != null) {

                    this._add(pushedController);
                    if (addAnimationFactory != null) {
                        var pushedView: IElementView = <any>pushedController.getView();
                        var container = this.getControllerContainer(pushedController);
                        var roots: Node[] = pushedView.getRoots();
                        for (var i in roots) {
                            var root = roots[i];
                            var animation = addAnimationFactory.create(<any>container, <any>root);
                            // add it to the controller so it can manage its own animations
                            pushedController.addAnimation(animation);
                        }
                    }
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
    }
}