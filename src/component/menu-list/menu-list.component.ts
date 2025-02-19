import { Component, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ListItems, IListItem } from '@ts-core/angular';
import * as _ from 'lodash';

@Component({
    selector: 'vi-menu-list',
    templateUrl: 'menu-list.component.html',
    standalone: false
})
export class MenuListComponent<U extends IListItem<V>, V = any> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public list: ListItems<U>;
}
