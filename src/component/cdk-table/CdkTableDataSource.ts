import {
    FilterableDataSourceMapCollection,
    DestroyableContainer,
    ObjectUtil,
    ObservableData,
    LoadableEvent,
    DataSourceMapCollectionEvent
} from '@ts-core/common';
import { Sort, SortDirection } from '@angular/material/sort';
import { Subscription, Observable, Subject, map, filter } from 'rxjs';
import { Signal, signal, WritableSignal } from '@angular/core';
import * as _ from 'lodash';

export class CdkTableDataSource<M extends FilterableDataSourceMapCollection<U>, U> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static getSort<U>(collection: FilterableDataSourceMapCollection<U>): Sort {
        if (_.isNil(collection) || _.isEmpty(collection.sort)) {
            return null;
        }
        let active = ObjectUtil.keys(collection.sort)[0].toString();
        let direction: SortDirection = collection.sort[active] ? 'asc' : 'desc';
        return { active, direction };
    }

    public static sortFunction<U>(first: U, second: U, event: Sort): number {
        if (_.isEmpty(event.direction)) {
            return 0;
        }
        let firstValue = first[event.active];
        let secondValue = second[event.active];
        let isHigher = firstValue > secondValue;
        if (event.direction === 'asc') {
            return isHigher ? -1 : 1;
        } else {
            return isHigher ? 1 : -1;
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _map: M;
    protected _observer: Subject<ObservableData<CdkTableDataSourceEvent, U>>;
    protected _items: WritableSignal<Array<U>>;
    protected _isLoading: WritableSignal<boolean>;
    protected _sortActive: WritableSignal<string>;
    protected _sortDirection: WritableSignal<SortDirection>;

    protected subscription: Subscription;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this._items = signal(null);
        this._isLoading = signal(false);
        this._sortActive = signal(null);
        this._sortDirection = signal(null);
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitMapProperties(): void {
        this.updateData();
        this.updateSort();
        this.updateLoading();
    }

    protected applySort(): void {
        this.map?.reload();
    }

    protected updateLoading(): void {
        this._isLoading.set(this.map?.isLoading);
    }

    protected updateData(): void {
        this._items.set(this.map?.collection || new Array());
    }

    protected updateSort(): void {
        let sort = CdkTableDataSource.getSort(this.map);
        this._sortActive.set(sort?.active);
        this._sortDirection.set(sort?.direction);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handler
    //
    // --------------------------------------------------------------------------

    protected mapEventHandler = (data: ObservableData<string, any>): void => {
        switch (data.type) {
            case LoadableEvent.STARTED:
                this.mapStartedHandler();
                break;
            case LoadableEvent.FINISHED:
                this.mapFinishedHandler();
                break;
            case LoadableEvent.COMPLETE:
                this.mapCompletedHandler();
                break;
            case DataSourceMapCollectionEvent.ITEM_CHANGED:
                this.mapItemChangedHandler(data.data);
                break;
            case DataSourceMapCollectionEvent.ITEM_REPLACED:
                this.mapItemReplacedHandler(data.data);
                break;
        }
    };

    protected mapStartedHandler(): void {
        this.updateLoading();
    }

    protected mapFinishedHandler(): void {
        this.updateLoading();
    }

    protected mapCompletedHandler(): void {
        this.updateData();
    }

    protected mapItemChangedHandler(item: U): void {
        this.observer.next(new ObservableData(CdkTableDataSourceEvent.ITEM_CHANGED, item));
    }

    protected mapItemReplacedHandler(item: U): void {
        this.observer.next(new ObservableData(CdkTableDataSourceEvent.ITEM_REPLACED, item));
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public applySortIfNeed(event: Sort): void {
        if (_.isNil(this.map)) {
            return;
        }
        let value = undefined;
        if (event.direction === 'asc') {
            value = true;
        }
        if (event.direction === 'desc') {
            value = false;
        }
        let name = event.active;
        let sort = this.map.getSortByName(name);
        if (value === sort[name]) {
            return;
        }
        ObjectUtil.clear(sort);
        sort[name] = value;
        this.applySort();
    }

    public trackBy(index: number, item: U): any {
        return !_.isNil(this.map) ? this.map.trackBy(index, item) : index;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        if (!_.isNil(this._observer)) {
            this._observer.complete();
            this._observer = null;
        }
        this.map = null;
        this._items = null;
        this._isLoading = null;
        this._sortActive = null;
        this._sortDirection = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get observer(): Subject<ObservableData<CdkTableDataSourceEvent, U>> {
        if (_.isNil(this._observer)) {
            this._observer = new Subject();
        }
        return this._observer;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get map(): M {
        return this._map;
    }

    public set map(value: M) {
        if (value === this._map) {
            return;
        }
        if (!_.isNil(this.subscription)) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this._map = value;
        if (!_.isNil(value)) {
            this.commitMapProperties();
            this.subscription = value.events.subscribe(this.mapEventHandler);
        }
    }

    public get itemChanged(): Observable<U> {
        return this.observer.pipe(
            filter(item => item.type === CdkTableDataSourceEvent.ITEM_CHANGED),
            map(item => item.data)
        );
    }

    public get itemReplaced(): Observable<U> {
        return this.observer.pipe(
            filter(item => item.type === CdkTableDataSourceEvent.ITEM_REPLACED),
            map(item => item.data)
        );
    }

    public get items(): Signal<Array<U>> {
        return this._items;
    }

    public get isLoading(): Signal<boolean> {
        return this._isLoading;
    }

    public get sortActive(): Signal<string> {
        return this._sortActive;
    }

    public get sortDirection(): Signal<SortDirection> {
        return this._sortDirection;
    }
}

export enum CdkTableDataSourceEvent {
    ITEM_CHANGED = 'ITEM_CHANGED',
    ITEM_REPLACED = 'ITEM_REPLACED'
}
