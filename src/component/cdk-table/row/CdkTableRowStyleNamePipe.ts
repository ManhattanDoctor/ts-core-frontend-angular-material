import { Pipe, PipeTransform } from '@angular/core';
import { ICdkTableRow } from './ICdkTableRow';
import * as _ from 'lodash';

@Pipe({
    name: 'viCdkTableRowStyleName',
    standalone: false
})
export class CdkTableRowStyleNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, row: ICdkTableRow<U>, selectedRows: Array<U>): { [key: string]: any } {
        return !_.isNil(row) && !_.isNil(row.styleName) ? row.styleName(item, selectedRows) : null;
    }
}
