import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { Component, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import { FilterableDataSourceMapCollection } from '@ts-core/common';
import * as _ from 'lodash';

@Component({
    selector: 'vi-cdk-table-paginable-bookmark',
    templateUrl: 'cdk-table-paginable-bookmark.component.html',
    standalone: false
})
export class CdkTablePaginableBookmarkComponent<U> extends CdkTableBaseComponent<FilterableDataSourceMapCollection<U>, U> {
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
