import { FilterableSort } from '@ts-core/common';

export interface ICdkTableSortableMapCollection<U, T = any> {
    getSortByColumn(name: string): FilterableSort<U | T>;

    get sort(): FilterableSort<U>;
    get sortExtras(): FilterableSort<T>;
}
