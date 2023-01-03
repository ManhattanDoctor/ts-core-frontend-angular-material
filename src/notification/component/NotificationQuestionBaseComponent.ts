import { Component, HostListener } from '@angular/core';
import { INotificationContent } from '../../notification/INotificationContent';
import { ViewUtil, QuestionManager } from '@ts-core/angular';

@Component({ template: '' })
export abstract class NotificationQuestionBaseComponent extends INotificationContent<QuestionManager> {
    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitConfigProperties(): void {
        super.commitConfigProperties();

        if (this.isInfo) {
            ViewUtil.addClass(this.container, 'mouse-active');
        }

        this.data.closePromise.then(() => {
            if (!this.isDestroyed) {
                this.remove();
            }
        });
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    @HostListener('click')
    public clickHandler(): void {
        if (this.isInfo) {
            this.data.closeClickHandler();
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get isInfo(): boolean {
        return this.data ? this.data.isInfo : false;
    }
}
