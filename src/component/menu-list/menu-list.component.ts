import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ListItems, IListItem } from '@ts-core/angular';
import * as _ from 'lodash';

@Component({
    imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
    selector: 'vi-menu-list',
    templateUrl: 'menu-list.component.html'
})
export class MenuListComponent<U extends IListItem<V>, V = any> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public list: ListItems<U>;

    @Input({ transform: booleanAttribute })
    public isMaterialIcon: boolean;
}
