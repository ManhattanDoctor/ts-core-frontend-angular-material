import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { INotification, INotificationConfig, INotificationContent, NotificationEvent, ViewUtil, WindowBase, WindowEvent } from '@ts-core/angular';
import { NotificationProperties } from './NotificationProperties';
import * as _ from 'lodash';

export class NotificationImpl<T = any> extends WindowBase implements INotification {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private _container: HTMLElement;

    protected properties: NotificationProperties<T>;

    protected timer: any;
    protected observer: Subject<string>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(properties: NotificationProperties<T>) {
        super();
        this.observer = new Subject();

        this.properties = properties;
        this.content.notification = this;

        // Have to save for unsubscribe on destroy
        this._container = this.properties.overlay.overlayElement;

        this.setProperties();
        this.getReference().afterOpened().pipe(takeUntil(this.destroyed)).subscribe(this.setOpened);
        this.getReference().afterClosed().pipe(takeUntil(this.destroyed)).subscribe(this.setClosed);

        this.events
            .pipe(
                filter(event => event === WindowEvent.CONTENT_READY),
                takeUntil(this.destroyed)
            )
            .subscribe(this.updatePosition);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected setProperties(): void {
        super.setProperties();
        ViewUtil.addClass(this.container, 'vi-notification');
    }

    protected setClosed = (): void => {
        this.emit(WindowEvent.CLOSED);
        this.destroy();
    };

    protected setOpened = (): void => {
        this.emit(WindowEvent.OPENED);
    };

    protected commitSizeProperties(): void {
        let width = !_.isNaN(this.width) ? `${this.width}px` : 'auto';
        let height = !_.isNaN(this.height) ? `${this.height}px` : 'auto';
        this.getReference().updateSize(width, height);
    }

    protected commitPositionProperties(): void {
        if (_.isNaN(this._x) && _.isNaN(this._y)) {
            return;
        }
        let position = {} as any;
        if (!_.isNaN(this._y)) {
            position.top = `${this._y}px`;
        }
        if (!_.isNaN(this._x)) {
            position.left = `${this._x}px`;
        }
        this.getReference().updatePosition(position);
    }

    protected getConfig(): INotificationConfig<T> {
        return this.properties.config;
    }
    protected getContainer(): HTMLElement {
        return this.container;
    }
    protected getReference(): MatDialogRef<INotificationContent<T>> {
        return this.properties.reference;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public emit(event: string): void {
        this.observer.next(event);
    }

    public close(): void {
        this.getReference().close();
    }

    public remove(): void {
        this.close();
        this.observer.next(NotificationEvent.REMOVED);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }
        this.properties = null;
        this._container = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Size Methods
    //
    // --------------------------------------------------------------------------

    public getWidth(): number {
        return this.calculateWidth();
    }

    public getHeight(): number {
        return this.calculateHeight();
    }

    public setWidth(value: number): void {
        this.width = value;
    }

    public setHeight(value: number): void {
        this.height = value;
    }

    public setSize(width: number, height: number): void {
        this.setWidth(width);
        this.setHeight(height);
    }

    // --------------------------------------------------------------------------
    //
    //  Move Methods
    //
    // --------------------------------------------------------------------------

    public getX(): number {
        return this.x;
    }

    public setX(value: number): void {
        this.x = value;
    }

    public getY(): number {
        return this.y;
    }
    public setY(value: number): void {
        this.y = value;
    }

    public move(x: number, y: number): void {
        this.setX(x);
        this.setY(y);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get events(): Observable<string> {
        return this.observer.asObservable();
    }

    public get config(): INotificationConfig<T> {
        return this.properties.config;
    }

    public get content(): INotificationContent<T> {
        return this.properties.reference ? this.properties.reference.componentInstance : null;
    }

    public get container(): HTMLElement {
        return this._container;
    }
}
