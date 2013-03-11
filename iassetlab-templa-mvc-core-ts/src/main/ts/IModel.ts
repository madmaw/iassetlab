///<reference path="ModelChangeEvent.ts"/>
module Templa {
    export interface IModel {

        addOnChangeListener(listener:(source:IModel, changeEvent:ModelChangeEvent)=>void);

        removeOnChangeListener(listener:(source:IModel, changeEvent:ModelChangeEvent)=>void);
    }
}