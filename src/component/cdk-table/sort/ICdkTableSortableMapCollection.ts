import { FilterableSort } from '@ts-core/common';

export interface ICdkTableSortableMapCollection<U, V, T = any> {
    getSortByColumn(name: string): FilterableSort<U | V>;

    get sort(): FilterableSort<U>;
    get sortExtras(): FilterableSort<T>;
}
