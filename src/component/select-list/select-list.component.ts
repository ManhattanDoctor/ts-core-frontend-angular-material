import { Component, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { SelectListItems, ISelectListItem } from '@ts-core/angular';

@Component({
    selector: 'vi-select-list',
    templateUrl: 'select-list.component.html'
})
export class SelectListComponent<T = any> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public list: SelectListItems<ISelectListItem<T>>;
}
