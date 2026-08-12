import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { LanguageService } from '@ts-core/frontend';

export class LanguageMomentDateAdapter extends MomentDateAdapter {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService) {
        // В двадцать второй версии адаптер берёт локаль из внедрения, поэтому её ставим явно
        super();
        this.setLocale(language.locale);
        language.completed.subscribe(() => this.setLocale(language.locale));
    }
}
