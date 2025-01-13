import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { Component, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import { FilterableDataSourceMapCollection } from '@ts-core/common';
import * as _ from 'lodash';

@Component({
    selector: 'vi-cdk-table-filterable',
    templateUrl: 'cdk-table-filterable.component.html',
    standalone: false
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
