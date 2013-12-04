///<reference path="../ElementViewJQuerySelectorHandler.ts"/>
///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../JQueryElementReference.ts"/>
///<reference path="../../IElementController.ts"/>
///<reference path="../../AbstractElementController.ts"/>
///<reference path="../../ViewRootElementReference.ts"/> 

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery.table {

    export interface IAbstractTableJQueryControllerCell {
        container: templa.dom.mvc.IElementReference;
        controller: templa.mvc.IController;
    }

    export class AbstractTableJQueryController<ModelType extends templa.mvc.table.ITableControllerModel> extends templa.dom.mvc.AbstractElementController<ModelType> implements templa.dom.mvc.jquery.IJQuerySelectorHandler {

        private _rowHeaders: IAbstractTableJQueryControllerCell[];
        private _leafRowHeaders: IAbstractTableJQueryControllerCell[];
        private _columnHeaders: IAbstractTableJQueryControllerCell[];
        private _leafColumnHeaders: IAbstractTableJQueryControllerCell[];
        private _cells: IAbstractTableJQueryControllerCell[][];
        private _rowCount: number;
        private _columnCount: number;

        private _rowHeaderView: templa.dom.mvc.IElementView;
        private _columnHeaderView: templa.dom.mvc.IElementView;
        private _tableView: templa.dom.mvc.IElementView;

        constructor(
            viewFactory: templa.dom.mvc.IElementViewFactory,
            private _rowHeaderViewFactory: (container: IElementReference, rows: number, depth:number) => templa.dom.mvc.IElementView,
            private _rowSelectorFormat: string,
            private _columnHeaderViewFactory: (container: IElementReference, columns: number, depth: number) => templa.dom.mvc.IElementView,
            private _columnSelectorFormat: string,
            private _tableViewFactory: (container: IElementReference, rows: number, columns: number) => templa.dom.mvc.IElementView,
            private _cellSelectorFormat: string

        ) {
            super(viewFactory);
        }

        public _doLoad(model: templa.mvc.IModel) {

            // remove everything

            this._removeAll();

            var tableModel = <templa.mvc.table.ITableControllerModel>model;
            var rowCount = tableModel.getRowCount();
            var columnCount = tableModel.getColumnCount();
            var rowHeaderDepth = tableModel.getRowHeaderDepth();
            var columnHeaderDepth = tableModel.getColumnHeaderDepth();

            this._rowCount = rowCount;
            this._columnCount = columnCount;

            var container = new templa.dom.mvc.ViewRootElementReference(this._view);

            // create the views
            this._rowHeaderView = this._rowHeaderViewFactory(container, rowCount, rowHeaderDepth);
            this._rowHeaderView.attach();

            this._columnHeaderView = this._columnHeaderViewFactory(container, columnCount, columnHeaderDepth);
            this._columnHeaderView.attach();

            this._tableView = this._tableViewFactory(container, rowCount, columnCount);
            this._tableView.attach();

            // create the headers
            this._columnHeaders = [];
            this._leafColumnHeaders = [];
            var columnHeaderSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._columnHeaderView);
            for (var i = 0; i < columnCount; i++) {
                for (var depth = 0; depth < columnHeaderDepth; depth++) {
                    var columnHeader = tableModel.getColumnHeader(i, depth);
                    var columnSelector = templa.util.Strings.format(this._columnSelectorFormat, [i, depth]);
                    var reference = new templa.dom.mvc.jquery.JQueryElementReference(columnHeaderSelectorHandler, columnSelector);
                    if (columnHeader.getFromIndex() == i) {
                        var columnHeaderController = <templa.dom.mvc.IElementController>columnHeader.getController();
                        // set the span on cell
                        var columnSpan = columnHeader.getSpan();
                        if (columnSpan != null && columnSpan > 1) {
                            $(reference.resolve()).attr("colspan", columnSpan);
                        }

                        var columnHeaderCell: IAbstractTableJQueryControllerCell = {
                            container: reference,
                            controller: columnHeaderController
                        };
                        columnHeaderController.init(reference, false);
                        var view = <templa.dom.mvc.IElementView>columnHeaderController.getView();
                        if (depth == columnHeaderDepth - 1) {
                            this._leafColumnHeaders.push(columnHeaderCell);
                        }
                        columnHeaderController.start();
                        this._columnHeaders.push(columnHeaderCell);
                    } else {
                        // slight problem here, we want a colspan of 0, but that's not going to work, remove should do the trick
                        $(reference.resolve()).remove();
                    }
                }
            }
            this._rowHeaders = [];
            this._leafRowHeaders = [];
            var rowHeaderSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._rowHeaderView);
            for (var i = 0; i < rowCount; i++) {
                for (var depth = 0; depth < rowHeaderDepth; depth++) {
                    var rowHeader = tableModel.getRowHeader(i, depth);
                    var rowHeaderSelector = templa.util.Strings.format(this._rowSelectorFormat, [i, depth]);
                    var reference = new templa.dom.mvc.jquery.JQueryElementReference(rowHeaderSelectorHandler, rowHeaderSelector);
                    if (rowHeader.getFromIndex() == i) {
                        var rowHeaderController = <templa.dom.mvc.IElementController>rowHeader.getController();
                        // set the span on cell
                        var rowSpan = rowHeader.getSpan();
                        if (rowSpan != null && rowSpan > 1) {
                            $(reference.resolve()).attr("rowspan", rowSpan);
                        }

                        var rowHeaderCell:IAbstractTableJQueryControllerCell = {
                            container: reference,
                            controller: rowHeaderController
                        };

                        rowHeaderController.init(reference, false);
                        var view = <templa.dom.mvc.IElementView>rowHeaderController.getView();
                        if (depth == rowHeaderDepth - 1) {
                            this._leafRowHeaders.push(rowHeaderCell);
                        }
                        rowHeaderController.start();
                        this._rowHeaders.push(rowHeaderCell);
                    } else {
                        // slight problem here, we want a rowspan of 0, but that's not going to work, remove should do the trick
                        $(reference.resolve()).remove();
                    }
                }
            }
            // assign the rows and columns
            this._cells = [];
            var tableSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._tableView);
            for (var row = 0; row < rowCount; row++) {
                var columns: IAbstractTableJQueryControllerCell[] = [];
                for (var col = 0; col < columnCount; col++) {
                    var cell = <templa.dom.mvc.IElementController>tableModel.getCell(row, col);
                    var cellSelector = templa.util.Strings.format(this._cellSelectorFormat, [row, col]);
                    //
                    var reference = new templa.dom.mvc.jquery.JQueryElementReference(tableSelectorHandler, cellSelector);
                    cell.init(reference, false);
                    columns.push({
                        container: reference,
                        controller: cell
                    });
                }
                this._cells.push(columns);
            }
            // make sure eveything is lined up properly
            this._layoutTable();
        }

        public _removeAll() {
            this._removeAllFromArray(this._rowHeaders);
            this._removeAllFromArray(this._columnHeaders);
            if (this._cells != null) {
                for (var i in this._cells) {
                    var row:IAbstractTableJQueryControllerCell[] = this._cells[i];
                    this._removeAllFromArray(row);
                }
                this._cells = null;
            }
            if (this._rowHeaderView != null) {
                this._rowHeaderView.detach();
                this._rowHeaderView = null;
            }
            if (this._columnHeaderView != null) {
                this._columnHeaderView.detach();
                this._columnHeaderView = null;
            }
            if (this._tableView != null) {
                this._tableView.detach();
                this._tableView = null;
            }
        }

        public _removeAllFromArray(controllers:IAbstractTableJQueryControllerCell[]) {
            if (controllers != null) {
                for (var i in controllers) {
                    var controller: templa.mvc.IController = controllers[i].controller;
                    if (this.getState() >= templa.mvc.ControllerStateInitialized) {
                        if (this.getState() == templa.mvc.ControllerStateStarted) {
                            controller.stop();
                        }
                    }
                    controller.destroy();
                }
            }
        }

        public layout(): void {
            // layout table controllers so everything is aligned
            super.layout();
            this._layoutTable();
        }

        public _layoutTable(): void {
            // measure everything
            var maxRowHeights: number[] = [];
            var maxColumnWidths: number[] = [];

            var rowHeaderQuery = $(this._rowHeaderView.getRoots());
            var columnHeaderQuery = $(this._columnHeaderView.getRoots());
            var tableQuery = $(this._tableView.getRoots());
            // assume these don't interfere with eachother
            var rowHeaderWidth = rowHeaderQuery.width();
            var columnHeaderHeight = columnHeaderQuery.height();
            rowHeaderQuery.css('margin-top', columnHeaderHeight + 'px');
            columnHeaderQuery.css('margin-left', rowHeaderWidth + 'px');
            tableQuery.css('margin-top', columnHeaderHeight + 'px');
            tableQuery.css('margin-left', rowHeaderWidth + 'px');

            for (var row = 0; row < this._rowCount; row++) {
                var controller = this._leafRowHeaders[row].controller;
                var view = <templa.dom.mvc.IElementView>controller.getView();
                var height = $(view.getRoots()).height();
                maxRowHeights.push(height);
            }
            for (var column = 0; column < this._columnCount; column++) {
                var controller = this._leafColumnHeaders[column].controller;
                var view = <templa.dom.mvc.IElementView>controller.getView();
                var width = $(view.getRoots()).width();
                maxColumnWidths.push(width);
            }
            for (var row = 0; row < this._rowCount; row++) {
                var maxHeight = maxRowHeights[row];
                for (var column = 0; column < this._columnCount; column++) {
                    var cell = this._cells[row][column].controller;
                    var view = <templa.dom.mvc.IElementView>cell.getView();
                    var width = $(view.getRoots()).width();
                    var height = $(view.getRoots()).height();
                    var maxWidth = maxColumnWidths[column];
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                    if (width > maxWidth) {
                        maxColumnWidths[column] = width;
                    }
                }
                maxRowHeights[row] = maxHeight;
            }
            // size em up
            // we actually want to size the container, not the contents so that subsequent calls to layout will still work
            for (var row = 0; row < this._rowCount; row++) {
                var height = maxRowHeights[row];
                var rowHeaderContainer = this._leafRowHeaders[row].container;
                $(rowHeaderContainer).height(height);
                for (var column = 0; column < this._columnCount; column++) {
                    var width = maxColumnWidths[column];
                    if (row == 0) {
                        var columnHeaderContainer = this._leafColumnHeaders[column].container;
                        $(columnHeaderContainer.resolve()).width(width);
                    }
                    var maxWidth = maxColumnWidths[column];
                    var cellContainer = this._cells[row][column].container;
                    $(cellContainer.resolve()).width(width).height(height);
                }
            }
        }

        // from IJQuerySelectorHandler
        // do we need this method?
        public $(selector?: string, roots?:Node[]): JQuery {
            // do a careful jquery (only owned elements)
            if (roots == null) {
                roots = this._view.getRoots();
            }
            // we inherently know that our roots are valid (no need to check lineage)
            var self: JQuery = $(<Element[]>roots);
            var query;
            if (selector != null) {
                var allChildRoots: Node[] = [];
                // initialized controllers
                this._appendRoots(allChildRoots, this._columnHeaders);
                this._appendRoots(allChildRoots, this._rowHeaders);
                for (var row in this._cells) {
                    var rowCells = this._cells[row];
                    this._appendRoots(allChildRoots, rowCells);
                }

                // selector goes first as checking the parenthood is quite expensive
                query = $(<Element[]>roots).find(selector).filter(function (index) {
                    var valid = true;
                    var e: Node = this;
                    while (e != null) {
                        if (roots.indexOf(e) >= 0) {
                            // we're at our root, it's OK
                            break;
                        } else if (allChildRoots.indexOf(e) >= 0) {
                            valid = false;
                            break;
                        } else {
                            e = e.parentNode;
                        }
                    }
                    return valid;
                });
                self = self.filter(selector);
                query = query.add(self);
            } else {
                query = self;
            }

            return query;
        }

        private _appendRoots(into: Node[], cells: IAbstractTableJQueryControllerCell[]) {
            for (var index in cells) {
                var cell: templa.mvc.IController = cells[index].controller;
                var view = <templa.dom.mvc.IElementView>cell.getView();
                if (view != null) {
                    // we can get odd situations where the owner controller is initialized, but the children are not
                    var childRoots = view.getRoots();
                    if (childRoots != null) {
                        templa.util.Arrays.pushAll(into, childRoots);
                    }
                }
            }
        }

    }
}