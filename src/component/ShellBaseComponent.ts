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

    public isNeedSide: WritableSignal<boolean>;
    public isShowMenu: WritableSignal<boolean>;
    public isShowNotifications: WritableSignal<boolean>;

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
        this.isNeedSide = signal(false);
        this.isShowMenu = signal(true);
        this.isShowNotifications = signal(false);

        this._notificationItems = signal(new Array());
        this._isHasNotifications = computed(() => !_.isEmpty(this._notificationItems()));
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
        if (!this.isHasNotifications()) {
            this.isShowNotifications.set(false);
        }
    }

    protected isNeedSideCheck(): void {
        this.isNeedSide.set(this.breakpointObserver.isMatched(this.sideMediaQueryToCheck));
        this.isShowMenu.set(this.isNeedSide());
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public toggleMenu(): void {
        if (!this.isNeedSide()) {
            this.isShowMenu.update(value => !value);
        }
    }

    public toggleNotifications(): void {
        this.isShowNotifications.update(value => !value);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.isNeedSide = null;
        this.isShowMenu = null;
        this.isShowNotifications = null;

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

    public get notificationItems(): Signal<Array<INotificationConfig>> {
        return this._notificationItems;
    }

    public get isHasNotifications(): Signal<boolean> {
        return this._isHasNotifications;
    }
}
