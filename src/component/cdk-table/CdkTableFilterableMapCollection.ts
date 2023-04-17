import { CdkTableDataSource } from './CdkTableDataSource';
import { FilterableDataSourceMapCollection, FilterableSort } from '@ts-core/common';
import { ObjectUtil } from '@ts-core/common';
import { Sort, SortDirection } from '@angular/material/sort';
import { ICdkTableSortableMapCollection } from './sort/ICdkTableSortableMapCollection';
import * as _ from 'lodash';

export abstract class CdkTableFilterableMapCollection<U, V, T = any>
    extends FilterableDataSourceMapCollection<U, V, T>
    implements ICdkTableSortableMapCollection<U, V, T>
{
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static getSort<U, V, T>(collection: ICdkTableSortableMapCollection<U, V, T>): Sort {
        if (_.isNil(collection) || _.isEmpty(collection.sort)) {
            return null;
        }
        let active = ObjectUtil.keys(collection.sort)[0].toString();
        let direction: SortDirection = collection.sort[active] ? 'asc' : 'desc';
        return { active, direction };
    }

    public static applySortEvent<U, V, T>(item: ICdkTableSortableMapCollection<U, V, T>, event: Sort): boolean {
        let value = undefined;
        if (event.direction === 'asc') {
            value = true;
        }
        if (event.direction === 'desc') {
            value = false;
        }
        let name = event.active;
        let sort = item.getSortByColumn(name);
        if (value === sort[name]) {
            return false;
        }
        ObjectUtil.clear(sort);
        sort[name] = value;
        return true;
    }

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _table: CdkTableDataSource<U>;

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        super.initialize();
        this._table = this.getTable();
    }

    protected getTable(): CdkTableDataSource<U> {
        return new CdkTableDataSource(this);
    }

    protected sortFunction(first: U, second: U, event: Sort): number {
        if (_.isEmpty(event.direction)) {
            return 0;
        }
        let firstValue = first[event.active];
        let secondValue = second[event.active];
        let isHigher = firstValue > secondValue;
        if (event.direction === 'asc') {
            return isHigher ? -1 : 1;
        } else {
            return isHigher ? 1 : -1;
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public sortEventHandler(event: Sort): void {
        if (CdkTableFilterableMapCollection.applySortEvent(this, event)) {
            this.reload();
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public getSortByColumn(name: string): FilterableSort<U | V> {
        return this.sort;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this._table)) {
            this._table.destroy();
            this._table = null;
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get table(): CdkTableDataSource<U> {
        return this._table;
    }
}
