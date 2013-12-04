///<reference path="TableHeader.ts"/>

///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>

module templa.mvc.table {
    export interface ITableControllerModel extends IModel {
        getRowCount(): number;

        getColumnCount(): number;

        getRowHeaderDepth(): number;

        getColumnHeaderDepth(): number;

        getRowHeader(row: number, depth:number): TableHeader;

        getColumnHeader(column: number, depth:number): TableHeader;

        getCell(row: number, column: number): templa.mvc.IController;
    }

}