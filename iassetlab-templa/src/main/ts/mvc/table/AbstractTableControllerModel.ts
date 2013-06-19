///<reference path="ITableControllerModel.ts"/>
///<reference path="TableHeader.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../../util/Arrays.ts"/>

module templa.mvc.table {
    export class AbstractTableControllerModel extends templa.mvc.AbstractModel implements ITableControllerModel {

        private _cells: templa.mvc.IController<templa.mvc.IModel>[][];
        private _rowHeaders: TableHeader[][];
        private _columnHeaders: TableHeader[][];

        constructor(private _rowCount:number, private _columnCount:number, private _rowHeaderDepth:number, private _columnHeaderDepth:number) {
            super();

            // create the cell array
            this._cells = templa.util.Arrays.create2DArray(this._rowCount, this._columnCount);

            // create the header arrays
            this._rowHeaders = templa.util.Arrays.create2DArray(this._rowCount, this._rowHeaderDepth);
            this._columnHeaders = templa.util.Arrays.create2DArray(this._columnCount, this._columnHeaderDepth);
        }

        public getRowCount(): number {
            return this._rowCount;
        }

        public getColumnCount(): number {
            return this._columnCount;
        }

        public getRowHeaderDepth(): number {
            return this._rowHeaderDepth;
        }

        public getColumnHeaderDepth(): number {
            return this._columnHeaderDepth;
        }

        public getRowHeaders(): TableHeader[][]{
            return this._rowHeaders;
        }

        public getRowHeader(row: number, depth:number): TableHeader {
            return this._rowHeaders[row][depth];
        }

        public setRowHeader(header: TableHeader, depth: number) {
            for (var i = 0; i < header.getSpan(); i++) {
                this._rowHeaders[i + header.getFromIndex()][depth] = header;
            }
            this._fireModelChangeEvent();
        }

        public getColumnHeaders(): TableHeader[][]{
            return this._columnHeaders;
        }

        public getColumnHeader(column: number, depth:number): TableHeader {
            return this._columnHeaders[column][depth];
        }

        public setColumnHeader(header: TableHeader, depth: number) {
            for (var i = 0; i < header.getSpan(); i++) {
                this._columnHeaders[i + header.getFromIndex()][depth] = header;
            }
            this._fireModelChangeEvent();
        }

        public getCell(row: number, column: number): templa.mvc.IController<templa.mvc.IModel> {
            return this._cells[row][column];
        }

        public setCell(row: number, column: number, cell: templa.mvc.IController<templa.mvc.IModel>) {
            this._cells[row][column] = cell;
            // TODO should probably be more specific about what has changed
            this._fireModelChangeEvent();
        }
    }
}