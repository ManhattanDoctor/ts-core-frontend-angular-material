import { PaginableDataSourceMapCollection } from '@ts-core/common';
import { CdkTableDataSource } from './CdkTableDataSource';

export class CdkPaginableTableDataSource<M extends PaginableDataSourceMapCollection<U>, U> extends CdkTableDataSource<M, U> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _total: number;
    protected _pages: number;
    protected _pageSize: number;
    protected _pagePages: number;
    protected _pageIndex: number;

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
        this._total = this.map.total;
        this._pages = this.map.pages;
        this._pageSize = this.map.pageSize;
        this._pageIndex = this.map.pageIndex;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get pageSize(): number {
        return this._pageSize;
    }
    public get pageIndex(): number {
        return this._pageIndex;
    }
    public get pages(): number {
        return this._pages;
    }
    public get total(): number {
        return this._total;
    }
}
