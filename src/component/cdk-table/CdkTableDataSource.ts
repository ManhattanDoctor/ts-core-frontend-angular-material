import {
    FilterableDataSourceMapCollection,
    DestroyableContainer,
    ObjectUtil,
    ObservableData,
    LoadableEvent,
    DataSourceMapCollectionEvent
} from '@ts-core/common';
import { Sort, SortDirection } from '@angular/material/sort';
import { Subscription, Observable, Subject, BehaviorSubject, map, filter } from 'rxjs';
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
    protected _observer: Subject<ObservableData<DataSourceMapCollectionEvent, U>>;
    protected _isLoading: boolean;
    protected _dataObserver: BehaviorSubject<Array<U>>;

    protected subscription: Subscription;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitMapProperties(): void {
        this.updateData();
        this.updateLoading();
    }

    protected applySort(): void {
        this.map.reload();
    }

    protected updateData(): void {
        this.dataObserver.next(this.map.collection);
    }

    protected updateLoading(): void {
        this._isLoading = this.map.isLoading;
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
        this.observer.next(new ObservableData(DataSourceMapCollectionEvent.ITEM_CHANGED, item));
    }

    protected mapItemReplacedHandler(item: U): void {
        this.observer.next(new ObservableData(DataSourceMapCollectionEvent.ITEM_REPLACED, item));
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
        if (!_.isNil(this._dataObserver)) {
            this._dataObserver.complete();
            this._dataObserver = null;
        }
        this.map = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get observer(): Subject<ObservableData<DataSourceMapCollectionEvent, U>> {
        if (_.isNil(this._observer)) {
            this._observer = new Subject();
        }
        return this._observer;
    }

    protected get dataObserver(): BehaviorSubject<Array<U>> {
        if (_.isNil(this._dataObserver)) {
            this._dataObserver = new BehaviorSubject(new Array());
        }
        return this._dataObserver;
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
            filter(item => item.type === DataSourceMapCollectionEvent.ITEM_CHANGED),
            map(item => item.data)
        );
    }

    public get itemReplaced(): Observable<U> {
        return this.observer.pipe(
            filter(item => item.type === DataSourceMapCollectionEvent.ITEM_REPLACED),
            map(item => item.data)
        );
    }

    public get itemsChanged(): Observable<Array<U>> {
        return this.dataObserver.asObservable();
    }

    public get isLoading(): boolean {
        return this._isLoading;
    }
}
