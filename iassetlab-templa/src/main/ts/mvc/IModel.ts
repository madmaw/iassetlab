///<reference path="ModelChangeEvent.ts"/>
///<reference path="IModelStateChange.ts"/>
module templa.mvc {
    export interface IModel {

        addOnChangeListener(listener:(source:IModel, changeEvent:ModelChangeEvent)=>void);

        removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void );

        addStateDescriptionChangeListener(listener: (source: IModel, change:IModelStateChange) => void );

        removeStateDescriptionChangeListener(listener: (source: IModel, change: IModelStateChange) => void );

        createStateDescription(models?:IModel[]):any;

        loadStateDescription(description: any);
    }
}