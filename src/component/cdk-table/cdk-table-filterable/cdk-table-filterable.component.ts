import { HTMLContentTitleDirective, LanguageModule } from '@ts-core/angular';
import { CdkTableRowStyleNamePipe } from '../row/CdkTableRowStyleNamePipe';
import { CdkTableRowClassNamePipe } from '../row/CdkTableRowClassNamePipe';
import { CdkTableColumnStyleNamePipe } from '../column/CdkTableColumnStyleNamePipe';
import { CdkTableColumnClassNamePipe } from '../column/CdkTableColumnClassNamePipe';
import { CdkTableCellStyleNamePipe } from '../cell/CdkTableCellStyleNamePipe';
import { CdkTableCellClassNamePipe } from '../cell/CdkTableCellClassNamePipe';
import { CdkTableCellValuePipePure } from '../cell/CdkTableCellValuePipePure';
import { CdkTableCellValuePipe } from '../cell/CdkTableCellValuePipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { Component, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import { FilterableDataSourceMapCollection } from '@ts-core/common';
import * as _ from 'lodash';

@Component({
    imports: [MatTableModule, MatSortModule, MatProgressBarModule, LanguageModule, HTMLContentTitleDirective, CdkTableCellValuePipe, CdkTableCellValuePipePure, CdkTableCellClassNamePipe, CdkTableCellStyleNamePipe, CdkTableColumnClassNamePipe, CdkTableColumnStyleNamePipe, CdkTableRowClassNamePipe, CdkTableRowStyleNamePipe],
    selector: 'vi-cdk-table-filterable',
    templateUrl: 'cdk-table-filterable.component.html'
})
export class CdkTableFilterableComponent<U = any> extends CdkTableBaseComponent<FilterableDataSourceMapCollection<U>, U> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super();
        ViewUtil.addClasses(container, 'd-flex flex-column scroll-no');
    }
}
