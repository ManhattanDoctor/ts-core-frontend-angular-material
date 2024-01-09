import * as _ from 'lodash';
import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { Component, Input, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import { PageEvent } from '@angular/material/paginator';
import { PaginableDataSourceMapCollection } from '@ts-core/common';
import { CdkPaginableTableDataSource } from '../CdkPaginableTableDataSource';

@Component({
    selector: 'vi-cdk-table-paginable',
    templateUrl: 'cdk-table-paginable.component.html'
})
export class CdkTablePaginableComponent<U> extends CdkTableBaseComponent<
    PaginableDataSourceMapCollection<U>,
    U,
    CdkPaginableTableDataSource<PaginableDataSourceMapCollection<U>, U>
> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _paginator: ICdkTablePaginatorSettings;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super();
        ViewUtil.addClasses(container, 'd-flex flex-column scroll-no');
        this._paginator = { pageSizes: [10, 25, 100], hidePageSize: false, showFirstLastButtons: true };
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected createSource(): CdkPaginableTableDataSource<PaginableDataSourceMapCollection<U>, U> {
        return new CdkPaginableTableDataSource();
    }

    protected commitPaginatorProperties(): void {}

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public pageEventHandler(event: PageEvent): void {
        this.table.pageIndex = event.pageIndex;
        this.table.pageSize = event.pageSize;
        this.table.load();
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get paginator(): ICdkTablePaginatorSettings {
        return this._paginator;
    }
    @Input()
    public set paginator(value: ICdkTablePaginatorSettings) {
        if (value === this._paginator) {
            return;
        }
        this._paginator = value;
        if (!_.isNil(value)) {
            this.commitPaginatorProperties();
        }
    }
}

export interface ICdkTablePaginatorSettings {
    pageSizes?: Array<number>;
    hidePageSize?: boolean;
    showFirstLastButtons?: boolean;
}
