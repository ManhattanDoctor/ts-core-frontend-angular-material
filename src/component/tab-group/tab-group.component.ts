import { MatTabsModule } from '@angular/material/tabs';
import { ChangeDetectorRef, Component, Input, WritableSignal, booleanAttribute, inject, signal } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DestroyableContainer } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { SelectListItems, ISelectListItem } from '@ts-core/angular';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
    imports: [MatTabsModule],
    selector: 'vi-tab-group',
    templateUrl: 'tab-group.component.html'
})
export class TabGroupComponent<T = any> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public className: string;

    protected _list: SelectListItems<ISelectListItem<T>>;
    protected _isStretch: boolean = true;

    public isStretchSignal: WritableSignal<boolean>;
    public selectedIndexSignal: WritableSignal<number>;

    protected listSubscription?: Subscription;
    private cd: ChangeDetectorRef;

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this.isStretchSignal = signal(true);
        this.selectedIndexSignal = signal(null);
        this.cd = inject(ChangeDetectorRef);

        // Названия вкладок переводятся внутри списка, а он про отрисовку ничего не знает:
        // без этого при смене языка на экране остались бы прежние слова
        let language = inject(LanguageService, { optional: true });
        if (!_.isNil(language)) {
            language.completed.pipe(takeUntil(this.destroyed)).subscribe(() => this.cd.markForCheck());
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitListProperties(): void {
        this.listSelectedIndexChanged();
        this.listSubscription = this.list.changed.pipe(takeUntil(this.destroyed)).subscribe(() => this.listSelectedIndexChanged());
    }

    protected commitIsStretchProperties(): void {}

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public selectedIndexChanged(event: number): void {
        if (!_.isNil(this.list)) {
            this.list.selectedIndex = event;
        }
    }

    public selectedTabChanged(event: MatTabChangeEvent): void {
        if (_.isNil(this.list)) {
            return;
        }
        let index = event.index;
        if (index < 0 || index >= this.list.length) {
            return;
        }
        let item = this.list.collection[index];
        this.list.selectedItem = item;
        this.list.actionItem(item);
    }

    protected listSelectedIndexChanged(): void {
        this.selectedIndexSignal.set(this.list?.selectedIndex);
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
        this.isStretchSignal = null;
        this.selectedIndexSignal = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get list(): SelectListItems<ISelectListItem<T>> {
        return this._list;
    }
    @Input()
    public set list(value: SelectListItems<ISelectListItem<T>>) {
        if (value === this._list) {
            return;
        }

        if (!_.isNil(this.listSubscription)) {
            this.listSubscription.unsubscribe();
            this.listSubscription = null;
        }
        this._list = value;
        if (!_.isNil(value)) {
            this.commitListProperties();
        }
    }

    public get isStretch(): boolean {
        return this._isStretch;
    }
    @Input({ transform: booleanAttribute })
    public set isStretch(value: boolean) {
        if (value === this._isStretch) {
            return;
        }
        this._isStretch = value;
        this.isStretchSignal?.set(value);
        this.commitIsStretchProperties();
    }
}
