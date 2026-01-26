import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DestroyableContainer, FilterableDataSourceMapCollection } from '@ts-core/common';
import { ICdkTableRow } from './row/ICdkTableRow';
import { ICdkTableColumn } from './column/ICdkTableColumn';
import { Sort } from '@angular/material/sort';
import { CdkTableDataSource } from './CdkTableDataSource';
import { merge, takeUntil } from 'rxjs';
import { MatTable } from '@angular/material/table';
import * as _ from 'lodash';

@Component({ template: '' })
export abstract class CdkTableBaseComponent<
    M extends FilterableDataSourceMapCollection<U>,
    U,
    S extends CdkTableDataSource<M, U> = CdkTableDataSource<M, U>
> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _table: M;
    protected _settings: ICdkTableSettings<U>;

    protected _rows: ICdkTableRow<U>;
    protected _columns: Array<ICdkTableColumn<U>>;
    protected _columnNames: Array<keyof U>;

    protected _source: S;
    protected _selectedRow: U;
    protected _selectedRows: Array<U>;

    @ViewChild(MatTable)
    protected _component: MatTable<U>;

    @Output()
    public rowClicked: EventEmitter<ICdkTableRowEvent<U>>;
    @Output()
    public cellClicked: EventEmitter<ICdkTableCellEvent<U>>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();

        this._source = this.createSource();
        this._columnNames = new Array();

        this.settings = {};
        this.rowClicked = new EventEmitter();
        this.cellClicked = new EventEmitter();

        merge(this.source.itemChanged, this.source.itemReplaced)
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.render());
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected createSource(): S {
        return new CdkTableDataSource() as S;
    }

    protected commitTableProperties(): void {
        if (!this.table.isDirty) {
            this.table.reload();
        }
    }

    protected commitColumnsProperties(): void {
        let value = null;

        value = !_.isEmpty(this.columns) ? this.columns.map(item => item.name) : [];
        if (value !== this._columnNames) {
            this._columnNames = value;
        }
    }

    protected commitSelectedRowsProperties(): void {
        this._selectedRow = !_.isEmpty(this.selectedRows) && this.selectedRows.length === 1 ? this.selectedRows[0] : null;
    }

    protected commitComponentProperties(): void {
        // dataSource is bound via template [dataSource]="source.items()"
    }

    protected commitSettingsProperties(): void {
        if (_.isNil(this.settings.noDataId)) {
            this.settings.noDataId = 'general.noDataFound';
        }
        if (_.isNil(this.settings.isInteractive)) {
            this.settings.isInteractive = true;
        }
        if (_.isNil(this.rows) && !_.isEmpty(this.settings.rows)) {
            this.rows = this.settings.rows;
        }
        if (_.isNil(this.columns) && !_.isEmpty(this.settings.columns)) {
            this.columns = this.settings.columns;
        }
    }

    protected commitRowProperties(): void {}

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public render(): void {
        if (_.isNil(this.component)) {
            return;
        }
        this.component.dataSource = null;
        this.component.dataSource = this.source.items();
    }

    public columnTrackBy(index: number, item: ICdkTableColumn<U>): string {
        return item.name;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.table = null;
        this.component = null;
        this.selectedRows = null;

        if (!_.isNil(this.source)) {
            this.source.destroy();
            this._source = null;
        }
        if (!_.isNil(this.cellClicked)) {
            this.cellClicked.complete();
            this.cellClicked = null;
        }
        if (!_.isNil(this.rowClicked)) {
            this.rowClicked.complete();
            this.rowClicked = null;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    public rowClickHandler(item: U, event: MouseEvent): void {
        this.rowClicked.emit({ data: item, event });
    }

    public cellClickHandler(item: U, column: ICdkTableColumn<U>, event: MouseEvent): void {
        this.cellClicked.emit({ data: item, column: column.name, event });
    }

    public sortEventHandler(event: Sort): void {
        this.source.applySortIfNeed(event);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get source(): S {
        return this._source;
    }

    public get table(): M {
        return this._table;
    }
    @Input()
    public set table(value: M) {
        if (value === this._table) {
            return;
        }
        if (!_.isNil(this.source)) {
            this.source.map = null;
        }
        this._table = value;
        if (!_.isNil(value)) {
            this.source.map = value;
            this.commitTableProperties();
        }
    }

    public get selectedRows(): Array<U> {
        return this._selectedRows;
    }
    @Input()
    public set selectedRows(value: Array<U>) {
        if (value === this._selectedRows) {
            return;
        }
        this._selectedRows = value;
        this.commitSelectedRowsProperties();
    }

    public get selectedRow(): U {
        return this._selectedRow;
    }
    @Input()
    public set selectedRow(value: U) {
        if (value === this._selectedRow) {
            return;
        }
        this.selectedRows = !_.isNil(value) ? [value] : [];
    }

    public get rows(): ICdkTableRow<U> {
        return this._rows;
    }
    @Input()
    public set rows(value: ICdkTableRow<U>) {
        if (value === this._rows) {
            return;
        }
        this._rows = value;
        if (!_.isNil(value)) {
            this.commitRowProperties();
        }
    }

    public get columns(): Array<ICdkTableColumn<U>> {
        return this._columns;
    }
    @Input()
    public set columns(value: Array<ICdkTableColumn<U>>) {
        if (value === this._columns) {
            return;
        }
        this._columns = value;
        if (!_.isNil(value)) {
            this.commitColumnsProperties();
        }
    }

    public get settings(): ICdkTableSettings<U> {
        return this._settings;
    }
    @Input()
    public set settings(value: ICdkTableSettings<U>) {
        if (value === this._settings) {
            return;
        }
        this._settings = value;
        if (!_.isNil(value)) {
            this.commitSettingsProperties();
        }
    }

    public get component(): MatTable<U> {
        return this._component;
    }
    @Input()
    public set component(value: MatTable<U>) {
        if (value === this._component) {
            return;
        }
        this._component = value;
        if (!_.isNil(value)) {
            this.commitComponentProperties();
        }
    }

    public get columnNames(): Array<keyof U> {
        return this._columnNames;
    }
}

export interface ICdkTableRowEvent<U> {
    data: U;
    event: MouseEvent;
}

export interface ICdkTableCellEvent<U> extends ICdkTableRowEvent<U> {
    column: string;
}

export interface ICdkTableSettings<U> {
    noDataId?: string;
    isHideHeader?: boolean;
    isInteractive?: boolean;

    rows?: ICdkTableRow<U>;
    columns?: Array<ICdkTableColumn<U>>;
}
