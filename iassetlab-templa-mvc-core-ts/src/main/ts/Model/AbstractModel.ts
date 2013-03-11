///<reference path="../IModel.ts"/>
module Templa.Model {

    export class AbstractModel implements Templa.IModel {
        private modelOnChangeListeners: { (source: Templa.IModel, changeEvent: Templa.ModelChangeEvent) : void; }[];

        constructor() {
            this.modelOnChangeListeners = [];
        }

        public addOnChangeListener(listener:(source:Templa.IModel, changeEvent:Templa.ModelChangeEvent)=>void) {
            this.modelOnChangeListeners.push(listener);
        }

        public removeOnChangeListener(listener:(source:Templa.IModel, changeEvent:Templa.ModelChangeEvent)=>void) {
            var index:number = this.modelOnChangeListeners.length;
            while( index > 0 ) {
                index--;
                if( this.modelOnChangeListeners[index] == listener ) {
                    this.modelOnChangeListeners.splice(index, 1);
                }
            }
        }

        public _fireModelChangeEvent(changeEvent:Templa.ModelChangeEvent) {
            for( var i in this.modelOnChangeListeners ) {
                var modelOnChangeListener = this.modelOnChangeListeners[i];
                modelOnChangeListener(this, changeEvent);
            }
        }
    }
}