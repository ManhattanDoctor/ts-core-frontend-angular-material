import { PaginableDataSourceMapCollection } from '@ts-core/common';
import { CdkTableDataSource } from './CdkTableDataSource';
import { signal, Signal, WritableSignal } from '@angular/core';

export class CdkPaginableTableDataSource<M extends PaginableDataSourceMapCollection<U>, U> extends CdkTableDataSource<M, U> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public totalSignal: WritableSignal<number>;
    public pagesSignal: WritableSignal<number>;
    public pageSizeSignal: WritableSignal<number>;
    public pageIndexSignal: WritableSignal<number>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this.totalSignal = signal(0);
        this.pagesSignal = signal(0);
        this.pageSizeSignal = signal(0);
        this.pageIndexSignal = signal(0);
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
        this.totalSignal?.set(this.map.total);
        this.pagesSignal?.set(this.map.pages);
        this.pageSizeSignal?.set(this.map.pageSize);
        this.pageIndexSignal?.set(this.map.pageIndex);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.totalSignal = null;
        this.pagesSignal = null;
        this.pageSizeSignal = null;
        this.pageIndexSignal = null;
    }
}
