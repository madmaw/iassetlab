///<reference path="ModelChangeEvent.ts"/>
module templa.mvc {
    export interface IModel {

        addOnChangeListener(listener:(source:IModel, changeEvent:ModelChangeEvent)=>void);

        removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void );

        addStateDescriptionChangeListener(listener: (source: IModel) => void );

        removeStateDescriptionChangeListener(listener: (source: IModel) => void );

        createStateDescription(models?:IModel[]):any;

        loadStateDescription(description: any);
    }
}