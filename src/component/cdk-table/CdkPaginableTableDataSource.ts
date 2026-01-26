import { PaginableDataSourceMapCollection } from '@ts-core/common';
import { CdkTableDataSource } from './CdkTableDataSource';
import { signal, Signal, WritableSignal } from '@angular/core';

export class CdkPaginableTableDataSource<M extends PaginableDataSourceMapCollection<U>, U> extends CdkTableDataSource<M, U> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _total: WritableSignal<number>;
    protected _pages: WritableSignal<number>;
    protected _pageSize: WritableSignal<number>;
    protected _pageIndex: WritableSignal<number>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this._total = signal(0);
        this._pages = signal(0);
        this._pageSize = signal(0);
        this._pageIndex = signal(0);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handler
    //
    // --------------------------------------------------------------------------

    protected applySort(): void {
        this.map.load();
    }

    protected updateData(): void {
        super.updateData();
        this._total.set(this.map.total);
        this._pages.set(this.map.pages);
        this._pageSize.set(this.map.pageSize);
        this._pageIndex.set(this.map.pageIndex);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this._total = null;
        this._pages = null;
        this._pageSize = null;
        this._pageIndex = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get total(): Signal<number> {
        return this._total;
    }

    public get pages(): Signal<number> {
        return this._pages;
    }

    public get pageSize(): Signal<number> {
        return this._pageSize;
    }

    public get pageIndex(): Signal<number> {
        return this._pageIndex;
    }
}
