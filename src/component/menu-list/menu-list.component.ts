import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { ListItems, IListItem } from '@ts-core/angular';
import { takeUntil } from 'rxjs';
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

    private cd: ChangeDetectorRef;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    //
    // Подписи пунктов переводятся внутри списка, а он про отрисовку ничего не знает:
    // без этого при смене языка на экране остались бы прежние слова
    //
    constructor() {
        super();
        this.cd = inject(ChangeDetectorRef);

        let language = inject(LanguageService, { optional: true });
        if (!_.isNil(language)) {
            language.completed.pipe(takeUntil(this.destroyed)).subscribe(() => this.cd.markForCheck());
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.cd = null;
        this.list = null;
    }
}
