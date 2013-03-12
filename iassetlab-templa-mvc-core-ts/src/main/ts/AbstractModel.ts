///<reference path="IModel.ts"/>
module Templa.MVC {

    export class AbstractModel implements Templa.MVC.IModel {
        private modelOnChangeListeners: { (source: Templa.MVC.IModel, changeEvent: Templa.MVC.ModelChangeEvent) : void; }[];

        constructor() {
            this.modelOnChangeListeners = [];
        }

        public addOnChangeListener(listener: (source: Templa.MVC.IModel, changeEvent: Templa.MVC.ModelChangeEvent)=>void) {
            this.modelOnChangeListeners.push(listener);
        }

        public removeOnChangeListener(listener: (source: Templa.MVC.IModel, changeEvent: Templa.MVC.ModelChangeEvent)=>void) {
            var index:number = this.modelOnChangeListeners.length;
            while( index > 0 ) {
                index--;
                if( this.modelOnChangeListeners[index] == listener ) {
                    this.modelOnChangeListeners.splice(index, 1);
                }
            }
        }

        public _fireModelChangeEvent(changeEvent: Templa.MVC.ModelChangeEvent) {
            for( var i in this.modelOnChangeListeners ) {
                var modelOnChangeListener = this.modelOnChangeListeners[i];
                modelOnChangeListener(this, changeEvent);
            }
        }
    }
}