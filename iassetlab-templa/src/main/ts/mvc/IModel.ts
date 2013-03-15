///<reference path="ModelChangeEvent.ts"/>
module templa.mvc {
    export interface IModel {

        addOnChangeListener(listener:(source:IModel, changeEvent:ModelChangeEvent)=>void);

        removeOnChangeListener(listener:(source:IModel, changeEvent:ModelChangeEvent)=>void);
    }
}