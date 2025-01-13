import { Component, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { SelectListItems, ISelectListItem } from '@ts-core/angular';
import * as _ from 'lodash';

@Component({
    selector: 'vi-select-list',
    templateUrl: 'select-list.component.html',
    standalone: false
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
