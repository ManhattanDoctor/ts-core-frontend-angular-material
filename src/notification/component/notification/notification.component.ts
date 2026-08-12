import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { LanguageService } from '@ts-core/frontend';
import { NotificationService, ViewUtil } from '@ts-core/angular';
import { NotificationQuestionBaseComponent } from '../NotificationQuestionBaseComponent';
import * as _ from 'lodash';

@Component({
    imports: [CommonModule, MatButtonModule, MatDialogModule],
    selector: 'vi-notification',
    styleUrl: 'notification.component.scss',
    templateUrl: 'notification.component.html'
})
export class NotificationComponent extends NotificationQuestionBaseComponent {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public textSignal: WritableSignal<string>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private language: LanguageService,
        private notifications: NotificationService
    ) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-block');

        this.textSignal = signal(null);
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitConfigProperties(): void {
        super.commitConfigProperties();

        if (!_.isNil(this.data.text)) {
            this.textSignal.set(this.data.text.replace(/(?:\r\n|\r|\n)/g, `<br/>`));
        }
        if (this.language.isHasTranslation(this.data.options.yesTextId)) {
            this.data.yesText = this.language.translate(this.data.options.yesTextId);
        }
        if (this.language.isHasTranslation(this.data.options.notTextId)) {
            this.data.notText = this.language.translate(this.data.options.notTextId);
        }
        if (this.language.isHasTranslation(this.data.options.checkTextId)) {
            this.data.checkText = this.language.translate(this.data.options.checkTextId);
        }
        if (this.language.isHasTranslation(this.data.options.closeTextId)) {
            this.data.closeText = this.language.translate(this.data.options.closeTextId);
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public remove(): void {
        super.remove();
        if (_.isNil(this.notification)) {
            this.notifications.remove(this.config);
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.textSignal = null;
    }
}
