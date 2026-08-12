import { HTMLContentTitleDirective, LanguageModule } from '@ts-core/angular';
import { CdkTableRowStyleNamePipe } from '../row/CdkTableRowStyleNamePipe';
import { CdkTableRowClassNamePipe } from '../row/CdkTableRowClassNamePipe';
import { CdkTableColumnStyleNamePipe } from '../column/CdkTableColumnStyleNamePipe';
import { CdkTableColumnClassNamePipe } from '../column/CdkTableColumnClassNamePipe';
import { CdkTableCellStyleNamePipe } from '../cell/CdkTableCellStyleNamePipe';
import { CdkTableCellClassNamePipe } from '../cell/CdkTableCellClassNamePipe';
import { CdkTableCellValuePipePure } from '../cell/CdkTableCellValuePipePure';
import { CdkTableCellValuePipe } from '../cell/CdkTableCellValuePipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { Component, Input, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import { PageEvent } from '@angular/material/paginator';
import { PaginableDataSourceMapCollection } from '@ts-core/common';
import { CdkPaginableTableDataSource } from '../CdkPaginableTableDataSource';
import * as _ from 'lodash';

@Component({
    imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressBarModule, LanguageModule, HTMLContentTitleDirective, CdkTableCellValuePipe, CdkTableCellValuePipePure, CdkTableCellClassNamePipe, CdkTableCellStyleNamePipe, CdkTableColumnClassNamePipe, CdkTableColumnStyleNamePipe, CdkTableRowClassNamePipe, CdkTableRowStyleNamePipe],
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
    public paginatorSignal: WritableSignal<ICdkTablePaginatorSettings>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super();
        ViewUtil.addClasses(container, 'd-flex flex-column scroll-no');
        this._paginator = { pageSizes: [10, 25, 100], hidePageSize: false, showFirstLastButtons: true };
        this.paginatorSignal = signal(this.paginator);
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
        this.paginatorSignal?.set(value);
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
