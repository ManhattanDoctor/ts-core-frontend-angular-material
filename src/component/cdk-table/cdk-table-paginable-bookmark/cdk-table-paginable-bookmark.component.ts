import * as _ from 'lodash';
import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { Component, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import { FilterableDataSourceMapCollection } from '@ts-core/common';

@Component({
    selector: 'vi-cdk-table-paginable-bookmark',
    templateUrl: 'cdk-table-paginable-bookmark.component.html'
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
