import { IWindowContent, QuestionManager } from '@ts-core/angular';

export abstract class WindowQuestionBaseComponent extends IWindowContent<QuestionManager> {
    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitConfigProperties(): void {
        super.commitConfigProperties();
        this.data.closePromise.then(() => {
            if (!this.isDestroyed) {
                this.close();
            }
        });
    }
}
