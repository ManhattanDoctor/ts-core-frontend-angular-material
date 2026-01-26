import { BreakpointObserver } from '@angular/cdk/layout';
import { DestroyableContainer } from '@ts-core/common';
import { filter, takeUntil } from 'rxjs';
import { INotificationConfig, NotificationService, NotificationServiceEvent } from '@ts-core/angular';
import { computed, Signal, signal, WritableSignal } from '@angular/core';
import * as _ from 'lodash';

export class ShellBaseComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _isNeedSide: WritableSignal<boolean>;
    protected _isShowMenu: WritableSignal<boolean>;
    protected _isShowNotifications: WritableSignal<boolean>;
    protected _notificationItems: WritableSignal<Array<INotificationConfig>>;
    protected _isHasNotifications: Signal<boolean>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        public notifications: NotificationService,
        public breakpointObserver: BreakpointObserver
    ) {
        super();
        this._isNeedSide = signal(false);
        this._isShowMenu = signal(true);
        this._notificationItems = signal(new Array());
        this._isHasNotifications = computed(() => !_.isEmpty(this._notificationItems()));
        this._isShowNotifications = signal(false);
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        // Notifications
        this.isHasNotificationsCheck();
        this.notifications.events
            .pipe(
                filter(data => data.type === NotificationServiceEvent.CLOSED || data.type === NotificationServiceEvent.REMOVED),
                takeUntil(this.destroyed)
            )
            .subscribe(() => this.isHasNotificationsCheck());

        // Menu Size
        this.isNeedSideCheck();
        this.breakpointObserver
            .observe(this.sideMediaQueryToCheck)
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.isNeedSideCheck());
    }

    protected isHasNotificationsCheck(): void {
        this._notificationItems.set(this.notifications.closedConfigs);
        if (!this._isHasNotifications()) {
            this._isShowNotifications.set(false);
        }
    }

    protected isNeedSideCheck(): void {
        this._isNeedSide.set(this.breakpointObserver.isMatched(this.sideMediaQueryToCheck));
        this._isShowMenu.set(this._isNeedSide());
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public toggleMenu(): void {
        if (!this._isNeedSide()) {
            this._isShowMenu.update(value => !value);
        }
    }

    public toggleNotifications(): void {
        this._isShowNotifications.update(value => !value);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        // Явная очистка signals для предотвращения утечек памяти
        this._isNeedSide = null;
        this._isShowMenu = null;
        this._isShowNotifications = null;
        this._notificationItems = null;
        this._isHasNotifications = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get sideMediaQueryToCheck(): string {
        return `(min-width: 1000px)`;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get isNeedSide(): Signal<boolean> {
        return this._isNeedSide;
    }

    public get isShowMenu(): Signal<boolean> {
        return this._isShowMenu;
    }

    public get isShowNotifications(): Signal<boolean> {
        return this._isShowNotifications;
    }

    public get notificationItems(): Signal<Array<INotificationConfig>> {
        return this._notificationItems;
    }

    public get isHasNotifications(): Signal<boolean> {
        return this._isHasNotifications;
    }
}
