import { MatPaginatorIntl } from '@angular/material/paginator';
import { LanguageService } from '@ts-core/frontend';
import { Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { FinancePipe } from '@ts-core/angular';

@Injectable()
export class LanguageMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected subscription: Subscription;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected language: LanguageService) {
        super();

        this.commitLanguageProperties();
        this.subscription = this.language.completed.subscribe(() => this.commitLanguageProperties());
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitLanguageProperties(): void {
        this.getRangeLabel = this.languageRangeLabel;
        this.lastPageLabel = this.language.translate('paginator.lastPage');
        this.nextPageLabel = this.language.translate('paginator.nextPage');
        this.firstPageLabel = this.language.translate('paginator.firstPage');
        this.previousPageLabel = this.language.translate('paginator.previousPage');
        this.itemsPerPageLabel = this.language.translate('paginator.itemsPerPage');
    }

    protected languageRangeLabel = (page: number, pageSize: number, length: number): string => {
        let translation = { current: '0', total: '0' };
        if (length > 0 && pageSize > 0) {
            length = Math.max(length, 0);
            let startIndex = page * pageSize;
            let endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            translation.current = `${startIndex + 1} – ${endIndex}`;
        }
        translation.total = FinancePipe.format(length, FinancePipe.DEFAULT_FORMAT);
        return this.language.translate('paginator.pageRange', translation);
    };

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public ngOnDestroy(): void {
        if (!_.isNil(this.subscription)) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}
