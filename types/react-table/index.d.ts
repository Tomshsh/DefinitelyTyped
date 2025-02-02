// Type definitions for react-table 7.7
// Project: https://github.com/tannerlinsley/react-table
// Definitions by: Guy Gascoigne-Piggford <https://github.com/ggascoigne>,
//                 Michael Stramel <https://github.com/stramel>
//                 Rohit Garg <https://github.com/gargroh>
//                 Jason Clark <https://github.com/riceboyler>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.5
// reflects react-table@7.7.0

// tslint:disable:no-empty-interface
// no-empty-interface is disabled to allow easy extension with declaration merging

// tslint:disable:no-unnecessary-generics
// no-unnecessary-generics is disabled because many of these definitions are either used in a generic
// context or the signatures are required to match for declaration merging

// The changelog for the important changes is located in the Readme.md

import {
    ChangeEvent,
    ComponentType,
    CSSProperties,
    DependencyList,
    EffectCallback,
    MouseEvent,
    ReactElement,
    ReactFragment,
    ReactNode,
    ReactText,
} from 'react';

export { };

/**
 * The empty definitions of below provides a base definition for the parts used by useTable, that can then be extended in the users code.
 *
 * @example
 *  export interface TableOptions<D extends Record<string, unknown> = Record<string, unknown>}>
 *    extends
 *      UseExpandedOptions<D>,
 *      UseFiltersOptions<D> {}
 * see https://gist.github.com/ggascoigne/646e14c9d54258e40588a13aabf0102d for more details
 */
export interface TableOptions<D extends Record<string, unknown>> extends UseTableOptions<D> { }

export interface TableInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseColumnOrderInstanceProps<D>,
    UseExpandedInstanceProps<D>,
    UseFiltersInstanceProps<D>,
    UseGlobalFiltersInstanceProps<D>,
    UseGroupByInstanceProps<D>,
    UsePaginationInstanceProps<D>,
    UseRowSelectInstanceProps<D>,
    UseRowStateInstanceProps<D>,
    UseSortByInstanceProps<D>,
    UseTableInstanceProps<D> { }

export interface TableState<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseColumnOrderState<D>,
    UseExpandedState<D>,
    UseFiltersState<D>,
    UseGlobalFiltersState<D>,
    UseGroupByState<D>,
    UsePaginationState<D>,
    UseResizeColumnsState<D>,
    UseRowSelectState<D>,
    UseRowStateState<D>,
    UseSortByState<D> { }

export interface Hooks<D extends Record<string, unknown> = Record<string, unknown>> extends UseTableHooks<D> { }

export interface Cell<D extends Record<string, unknown> = Record<string, unknown>, V = any> extends UseTableCellProps<D, V> { }

export interface ColumnInterface<D extends Record<string, unknown> = Record<string, unknown>> extends UseTableColumnOptions<D> { }

export interface ColumnInterfaceBasedOnValue<D extends Record<string, unknown> = Record<string, unknown>, V = any> {
    Cell?: Renderer<CellProps<D, V>> | undefined;
}

export interface ColumnGroupInterface<D extends Record<string, unknown>> {
    columns: Array<Column<D>>;
}

export type ColumnGroup<D extends Record<string, unknown> = Record<string, unknown>> =
    & ColumnInterface<D>
    & ColumnGroupInterface<D>
    & (
        | { Header: string; }
        | ({ id: IdType<D>; } & {
            Header: Renderer<HeaderProps<D>>;
        })
    )
    // Not used, but needed for backwards compatibility
    & { accessor?: Accessor<D> | undefined; };

type ValueOf<T> = T[keyof T];

// The accessors like `foo.bar` are not supported, use functions instead
export type ColumnWithStrictAccessor<D extends Record<string, unknown> = Record<string, unknown>> =
    & ColumnInterface<D>
    & ValueOf<{
        [K in keyof D]: {
            accessor: K;
        } & ColumnInterfaceBasedOnValue<D, D[K]>;
    }>;

export type ColumnWithLooseAccessor<D extends Record<string, unknown> = Record<string, unknown>> =
    & ColumnInterface<D>
    & ColumnInterfaceBasedOnValue<D>
    & (
        | { Header: string }
        | { id: IdType<D> }
        | { accessor: keyof D extends never ? IdType<D> : never }
    )
    & { accessor?: (keyof D extends never ? IdType<D> | Accessor<D> : Accessor<D>) | undefined; };

export type Column<D extends Record<string, unknown> = Record<string, unknown>> =
    | ColumnGroup<D>
    | ColumnWithLooseAccessor<D>
    | ColumnWithStrictAccessor<D>;

export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseFiltersColumnProps<D>,
    UseGroupByColumnProps<D>,
    UseResizeColumnsColumnProps<D>,
    UseSortByColumnProps<D>,
    UseTableColumnProps<D> { }

export interface HeaderGroup<D extends Record<string, unknown> = Record<string, unknown>> extends ColumnInstance<D>, UseTableHeaderGroupProps<D> { }

export interface Row<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseExpandedRowProps<D>,
    UseGroupByRowProps<D>,
    UseRowSelectRowProps<D>,
    UseRowStateRowProps<D>,
    UseTableRowProps<D> { }

export interface TableCommonProps {
    style?: CSSProperties | undefined;
    className?: string | undefined;
    role?: string | undefined;
}

export interface TableProps extends TableCommonProps { }

export interface TableBodyProps extends TableCommonProps { }

export interface TableKeyedProps extends TableCommonProps {
    key: React.Key;
}

export interface TableHeaderGroupProps extends TableKeyedProps { }

export interface TableFooterGroupProps extends TableKeyedProps { }

export interface TableHeaderProps extends TableKeyedProps { }

export interface TableFooterProps extends TableKeyedProps { }

export interface TableRowProps extends TableKeyedProps { }

export interface TableCellProps extends TableKeyedProps { }

export interface TableToggleCommonProps extends TableCommonProps {
    onChange?: ((e: ChangeEvent) => void) | undefined;
    checked?: boolean | undefined;
    title?: string | undefined;
    indeterminate?: boolean | undefined;
}

export interface MetaBase<D extends Record<string, unknown>> {
    instance: TableInstance<D>;
    userProps: any;
}

// inspired by ExtendState in  https://github.com/reduxjs/redux/blob/master/src/types/store.ts
export type Meta<D extends Record<string, unknown>, Extension = never, M = MetaBase<D>> = [Extension] extends [never]
    ? M
    : M & Extension;

//#region useTable
export function useTable<D extends Record<string, unknown> = Record<string, unknown>>(
    options: TableOptions<D>,
    ...plugins: Array<PluginHook<D>>
): TableInstance<D>;

/**
 * NOTE: To use custom options, use "Interface Merging" to add the custom options
 */
export type UseTableOptions<D extends object> = {
    columns: ReadonlyArray<Column<D>>;
    data: readonly D[];
} & Partial<{
    initialState: Partial<TableState<D>>;
    stateReducer: (newState: TableState<D>, action: ActionType, previousState: TableState<D>, instance?: TableInstance<D>) => TableState<D>;
    useControlledState: (state: TableState<D>, meta: Meta<D>) => TableState<D>;
    defaultColumn: Partial<Column<D>>;
    getSubRows: (originalRow: D, relativeIndex: number) => D[];
    getRowId: (originalRow: D, relativeIndex: number, parent?: Row<D>) => string;
    autoResetHiddenColumns: boolean;
}>;

export type PropGetter<D extends Record<string, unknown>, Props, T extends Record<string, unknown> = never, P = Partial<Props>> =
    | ((props: P, meta: Meta<D, T>) => P | P[])
    | P
    | P[];

export type TablePropGetter<D extends Record<string, unknown>> = PropGetter<D, TableProps>;

export type TableBodyPropGetter<D extends Record<string, unknown>> = PropGetter<D, TableBodyProps>;

export type HeaderPropGetter<D extends Record<string, unknown>> = PropGetter<D, TableHeaderProps, { column: HeaderGroup<D> }>;

export type FooterGroupPropGetter<D extends Record<string, unknown>> = PropGetter<D, TableFooterGroupProps, { column: HeaderGroup<D> }>;

export type HeaderGroupPropGetter<D extends Record<string, unknown>> = PropGetter<D, TableHeaderGroupProps, { column: HeaderGroup<D> }>;

export type FooterPropGetter<D extends Record<string, unknown>> = PropGetter<D, TableFooterProps, { column: HeaderGroup<D> }>;

export type RowPropGetter<D extends Record<string, unknown>> = PropGetter<D, TableRowProps, { row: Row<D> }>;

export type CellPropGetter<D extends Record<string, unknown>> = PropGetter<D, TableCellProps, { cell: Cell<D> }>;

export interface ReducerTableState<D extends Record<string, unknown>> extends TableState<D>, Record<string, any> { }

export interface UseTableHooks<D extends Record<string, unknown>> extends Record<string, any> {
    useOptions: Array<(options: TableOptions<D>, args: TableOptions<D>) => TableOptions<D>>;
    stateReducers: Array<
        (
            newState: TableState<D>,
            action: ActionType,
            previousState?: TableState<D>,
            instance?: TableInstance<D>,
        ) => ReducerTableState<D> | undefined
    >;
    columns: Array<(columns: Array<Column<D>>, meta: Meta<D>) => Array<Column<D>>>;
    columnsDeps: Array<(deps: any[], meta: Meta<D>) => any[]>;
    allColumns: Array<(allColumns: Array<ColumnInstance<D>>, meta: Meta<D>) => Array<Column<D>>>;
    allColumnsDeps: Array<(deps: any[], meta: Meta<D>) => any[]>;
    visibleColumns: Array<(allColumns: Array<ColumnInstance<D>>, meta: Meta<D>) => Array<Column<D>>>;
    visibleColumnsDeps: Array<(deps: any[], meta: Meta<D>) => any[]>;
    headerGroups: Array<(allColumns: Array<HeaderGroup<D>>, meta: Meta<D>) => Array<HeaderGroup<D>>>;
    headerGroupsDeps: Array<(deps: any[], meta: Meta<D>) => any[]>;
    useInstanceBeforeDimensions: Array<(instance: TableInstance<D>) => void>;
    useInstance: Array<(instance: TableInstance<D>) => void>;
    prepareRow: Array<(row: Row<D>, meta: Meta<D>) => void>;
    useControlledState: Array<(state: TableState<D>, meta: Meta<D>) => TableState<D>>;

    getTableProps: Array<TablePropGetter<D>>;
    getTableBodyProps: Array<TableBodyPropGetter<D>>;
    getHeaderGroupProps: Array<HeaderGroupPropGetter<D>>;
    getFooterGroupProps: Array<FooterGroupPropGetter<D>>;
    getHeaderProps: Array<HeaderPropGetter<D>>;
    getFooterProps: Array<FooterPropGetter<D>>;
    getRowProps: Array<RowPropGetter<D>>;
    getCellProps: Array<CellPropGetter<D>>;
    useFinalInstance: Array<(instance: TableInstance<D>) => void>;
}

export interface UseTableColumnOptions<D extends Record<string, unknown>> {
    id?: IdType<D> | undefined;
    Header?: Renderer<HeaderProps<D>> | undefined;
    Footer?: Renderer<FooterProps<D>> | undefined;
    width?: number | string | undefined;
    minWidth?: number | undefined;
    maxWidth?: number | undefined;
}

type UpdateHiddenColumns<D extends Record<string, unknown>> = (oldHidden: Array<IdType<D>>) => Array<IdType<D>>;

export interface TableToggleHideAllColumnProps extends TableToggleCommonProps { }

export interface UseTableInstanceProps<D extends Record<string, unknown>> {
    state: TableState<D>;
    plugins: Array<PluginHook<D>>;
    dispatch: TableDispatch;
    columns: Array<ColumnInstance<D>>;
    allColumns: Array<ColumnInstance<D>>;
    visibleColumns: Array<ColumnInstance<D>>;
    headerGroups: Array<HeaderGroup<D>>;
    footerGroups: Array<HeaderGroup<D>>;
    headers: Array<ColumnInstance<D>>;
    flatHeaders: Array<ColumnInstance<D>>;
    rows: Array<Row<D>>;
    rowsById: Record<string, Row<D>>;
    getTableProps: (propGetter?: TablePropGetter<D>) => TableProps;
    getTableBodyProps: (propGetter?: TableBodyPropGetter<D>) => TableBodyProps;
    prepareRow: (row: Row<D>) => void;
    flatRows: Array<Row<D>>;
    totalColumnsWidth: number;
    allColumnsHidden: boolean;
    toggleHideColumn: (columnId: IdType<D>, value?: boolean) => void;
    setHiddenColumns: (param: Array<IdType<D>> | UpdateHiddenColumns<D>) => void;
    toggleHideAllColumns: (value?: boolean) => void;
    getToggleHideAllColumnsProps: (props?: Partial<TableToggleHideAllColumnProps>) => TableToggleHideAllColumnProps;
    getHooks: () => Hooks<D>;
}

export interface UseTableHeaderGroupProps<D extends Record<string, unknown>> {
    headers: Array<HeaderGroup<D>>;
    getHeaderGroupProps: (propGetter?: HeaderGroupPropGetter<D>) => TableHeaderProps;
    getFooterGroupProps: (propGetter?: FooterGroupPropGetter<D>) => TableFooterProps;
    totalHeaderCount: number; // not documented
}

export interface UseTableColumnProps<D extends Record<string, unknown>> {
    id: IdType<D>;
    columns?: Array<ColumnInstance<D>> | undefined;
    isVisible: boolean;
    render: (type: 'Header' | 'Footer' | string, props?: object) => ReactNode;
    totalLeft: number;
    totalWidth: number;
    getHeaderProps: (propGetter?: HeaderPropGetter<D>) => TableHeaderProps;
    getFooterProps: (propGetter?: FooterPropGetter<D>) => TableFooterProps;
    toggleHidden: (value?: boolean) => void;
    parent?: ColumnInstance<D> | undefined; // not documented
    getToggleHiddenProps: (userProps?: any) => any;
    depth: number; // not documented
    placeholderOf?: ColumnInstance | undefined;
}

export interface UseTableRowProps<D extends Record<string, unknown>> {
    cells: Array<Cell<D>>;
    allCells: Array<Cell<D>>;
    values: Record<IdType<D>, CellValue>;
    getRowProps: (propGetter?: RowPropGetter<D>) => TableRowProps;
    index: number;
    original: D;
    id: string;
    subRows: Array<Row<D>>;
}

export interface UseTableCellProps<D extends Record<string, unknown>, V = any> {
    column: ColumnInstance<D>;
    row: Row<D>;
    value: CellValue<V>;
    getCellProps: (propGetter?: CellPropGetter<D>) => TableCellProps;
    render: (type: 'Cell' | string, userProps?: object) => ReactNode;
}

export type HeaderProps<D extends Record<string, unknown>> = TableInstance<D> & {
    column: ColumnInstance<D>;
};

export type FooterProps<D extends Record<string, unknown>> = TableInstance<D> & {};

export type CellProps<D extends Record<string, unknown>, V = any> = TableInstance<D> & {
    column: ColumnInstance<D>;
    row: Row<D>;
    cell: Cell<D, V>;
    value: CellValue<V>;
};

export type Accessor<D extends Record<string, unknown>> = (
    originalRow: D,
    index: number,
    sub: {
        subRows: D[];
        depth: number;
        data: D[];
    },
) => CellValue;

//#endregion

// Plugins

//#region useAbsoluteLayout
export function useAbsoluteLayout<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useAbsoluteLayout {
    const pluginName = 'useAbsoluteLayout';
}
//#endregion

//#region useBlockLayout
export function useBlockLayout<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useBlockLayout {
    const pluginName = 'useBlockLayout';
}
//#endregion

//#region useColumnOrder
export function useColumnOrder<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useColumnOrder {
    const pluginName = 'useColumnOrder';
}

export interface UseColumnOrderState<D extends Record<string, unknown>> {
    columnOrder: Array<IdType<D>>;
}

export interface UseColumnOrderInstanceProps<D extends Record<string, unknown>> {
    setColumnOrder: (updater: ((columnOrder: Array<IdType<D>>) => Array<IdType<D>>) | Array<IdType<D>>) => void;
}

//#endregion

//#region useExpanded
export function useExpanded<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useExpanded {
    const pluginName = 'useExpanded';
}

export interface TableExpandedToggleProps extends TableKeyedProps { }

export type UseExpandedOptions<D extends Record<string, unknown>> = Partial<{
    manualExpandedKey: IdType<D>;
    paginateExpandedRows: boolean;
    expandSubRows: boolean;
    autoResetExpanded?: boolean | undefined;
}>;

export interface UseExpandedHooks<D extends Record<string, unknown>> {
    getToggleRowsExpandedProps: Array<PropGetter<D, TableCommonProps>>;
    getToggleAllRowsExpandedProps: Array<PropGetter<D, TableCommonProps>>;
}

export interface UseExpandedState<D extends Record<string, unknown>> {
    expanded: Record<IdType<D>, boolean>;
}

export interface UseExpandedInstanceProps<D extends Record<string, unknown>> {
    preExpandedRows: Array<Row<D>>;
    expandedRows: Array<Row<D>>;
    rows: Array<Row<D>>;
    expandedDepth: number;
    isAllRowsExpanded: boolean;
    toggleRowExpanded: (id: Array<IdType<D>>, value?: boolean) => void;
    toggleAllRowsExpanded: (value?: boolean) => void;
}

export interface UseExpandedRowProps<D extends Record<string, unknown>> {
    isExpanded: boolean;
    canExpand: boolean;
    subRows: Array<Row<D>>;
    toggleRowExpanded: (value?: boolean) => void;
    getToggleRowExpandedProps: (props?: Partial<TableExpandedToggleProps>) => TableExpandedToggleProps;
    depth: number;
}

//#endregion

//#region useFilters
export function useFilters<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useFilters {
    const pluginName = 'useFilters';
}

export type UseFiltersOptions<D extends Record<string, unknown>> = Partial<{
    manualFilters: boolean;
    disableFilters: boolean;
    defaultCanFilter: boolean;
    filterTypes: FilterTypes<D>;
    autoResetFilters?: boolean | undefined;
}>;

export interface UseFiltersState<D extends Record<string, unknown>> {
    filters: Filters<D>;
}

export type UseFiltersColumnOptions<D extends Record<string, unknown>> = Partial<{
    Filter: Renderer<FilterProps<D>>;
    disableFilters: boolean;
    defaultCanFilter: boolean;
    filter: FilterType<D> | DefaultFilterTypes | string;
}>;

export interface UseFiltersInstanceProps<D extends Record<string, unknown>> {
    preFilteredRows: Array<Row<D>>;
    preFilteredFlatRows: Array<Row<D>>;
    preFilteredRowsById: Record<string, Row<D>>;
    filteredRows: Array<Row<D>>;
    filteredFlatRows: Array<Row<D>>;
    filteredRowsById: Record<string, Row<D>>;
    rows: Array<Row<D>>;
    flatRows: Array<Row<D>>;
    rowsById: Record<string, Row<D>>;
    setFilter: (columnId: IdType<D>, updater: ((filterValue: FilterValue) => FilterValue) | FilterValue) => void;
    setAllFilters: (updater: Filters<D> | ((filters: Filters<D>) => Filters<D>)) => void;
}

export interface UseFiltersColumnProps<D extends Record<string, unknown>> {
    canFilter: boolean;
    setFilter: (updater: ((filterValue: FilterValue) => FilterValue) | FilterValue) => void;
    filterValue: FilterValue;
    preFilteredRows: Array<Row<D>>;
    filteredRows: Array<Row<D>>;
}

export type FilterProps<D extends object> = HeaderProps<D>;
export type FilterValue = any;
export type Filters<D extends object> = Array<{ id: IdType<D>; value: FilterValue }>;
export type FilterTypes<D extends object> = Record<string, FilterType<D>>;

export type DefaultFilterTypes =
    | 'text'
    | 'exactText'
    | 'exactTextCase'
    | 'includes'
    | 'includesAll'
    | 'exact'
    | 'equals'
    | 'between';

export interface FilterType<D extends Record<string, unknown>> {
    (rows: Array<Row<D>>, columnIds: Array<IdType<D>>, filterValue: FilterValue): Array<Row<D>>;

    autoRemove?: ((filterValue: FilterValue) => boolean) | undefined;
}

//#endregion

//#region useFlexLayout
export function useFlexLayout<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useFlexLayout {
    const pluginName = 'useFlexLayout';
}
//#endregion

//#region useGridLayout
export function useGridLayout<D extends object = {}>(hooks: Hooks<D>): void;

export namespace useGridLayout {
    const pluginName = 'useGridLayout';
}
//#endregion

//#region useGlobalFilter
export function useGlobalFilter<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useGlobalFilter {
    const pluginName = 'useGlobalFilter';
}

export type UseGlobalFiltersOptions<D extends Record<string, unknown>> = Partial<{
    globalFilter: ((rows: Array<Row<D>>, columnIds: Array<IdType<D>>, filterValue: any) => Array<Row<D>>) | string;
    manualGlobalFilter: boolean;
    filterTypes: FilterTypes<D>;
    autoResetGlobalFilter?: boolean | undefined;
    disableGlobalFilter?: boolean | undefined;
}>;

export interface UseGlobalFiltersState<D extends Record<string, unknown>> {
    globalFilter: any;
}

export type UseGlobalFiltersColumnOptions<D extends Record<string, unknown>> = Partial<{
    disableGlobalFilter?: boolean | undefined;
}>;

export interface UseGlobalFiltersInstanceProps<D extends Record<string, unknown>> {
    preGlobalFilteredRows: Array<Row<D>>;
    preGlobalFilteredFlatRows: Array<Row<D>>;
    preGlobalFilteredRowsById: Record<string, Row<D>>;
    globalFilteredRows: Array<Row<D>>;
    globalFilteredFlatRows: Array<Row<D>>;
    globalFilteredRowsById: Record<string, Row<D>>;
    rows: Array<Row<D>>;
    flatRows: Array<Row<D>>;
    rowsById: Record<string, Row<D>>;
    setGlobalFilter: (filterValue: FilterValue) => void;
}

//#endregion

//#region useGroupBy
export function useGroupBy<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useGroupBy {
    const pluginName = 'useGroupBy';
}

export interface TableGroupByToggleProps {
    title?: string | undefined;
    style?: CSSProperties | undefined;
    onClick?: ((e: MouseEvent) => void) | undefined;
}

export type UseGroupByOptions<D extends object> = Partial<{
    manualGroupBy: boolean;
    disableGroupBy: boolean;
    defaultCanGroupBy: boolean;
    aggregations: Record<string, AggregatorFn<D>>;
    groupByFn: (rows: Array<Row<D>>, columnId: IdType<D>) => Record<string, Array<Row<D>>>;
    autoResetGroupBy?: boolean | undefined;
}>;

export interface UseGroupByHooks<D extends Record<string, unknown>> {
    getGroupByToggleProps: Array<HeaderGroupPropGetter<D>>;
}

export interface UseGroupByState<D extends Record<string, unknown>> {
    groupBy: Array<IdType<D>>;
}

export type UseGroupByColumnOptions<D extends Record<string, unknown>> = Partial<{
    aggregate: Aggregator<D>;
    Aggregated: Renderer<CellProps<D>>;
    disableGroupBy: boolean;
    defaultCanGroupBy: boolean;
}>;

export interface UseGroupByInstanceProps<D extends Record<string, unknown>> {
    preGroupedRows: Array<Row<D>>;
    preGroupedFlatRows: Array<Row<D>>;
    preGroupedRowsById: Record<string, Row<D>>;
    groupedRows: Array<Row<D>>;
    groupedFlatRows: Array<Row<D>>;
    groupedRowsById: Record<string, Row<D>>;
    onlyGroupedFlatRows: Array<Row<D>>;
    onlyGroupedRowsById: Record<string, Row<D>>;
    nonGroupedFlatRows: Array<Row<D>>;
    nonGroupedRowsById: Record<string, Row<D>>;
    rows: Array<Row<D>>;
    flatRows: Array<Row<D>>;
    rowsById: Record<string, Row<D>>;
    toggleGroupBy: (columnId: IdType<D>, value?: boolean) => void;
}

export interface UseGroupByColumnProps<D extends Record<string, unknown>> {
    canGroupBy: boolean;
    isGrouped: boolean;
    groupedIndex: number;
    toggleGroupBy: () => void;
    getGroupByToggleProps: (props?: Partial<TableGroupByToggleProps>) => TableGroupByToggleProps;
}

export interface UseGroupByRowProps<D extends Record<string, unknown>> {
    isGrouped: boolean;
    groupByID: IdType<D>;
    groupByVal: string;
    values: Record<IdType<D>, AggregatedValue>;
    subRows: Array<Row<D>>;
    leafRows: Array<Row<D>>;
    depth: number;
    id: string;
    index: number;
}

export interface UseGroupByCellProps<D extends Record<string, unknown>> {
    isGrouped: boolean;
    isPlaceholder: boolean;
    isAggregated: boolean;
}

export type DefaultAggregators = 'sum' | 'average' | 'median' | 'uniqueCount' | 'count';

export type AggregatorFn<D extends Record<string, unknown>> = (
    columnValues: CellValue[],
    rows: Array<Row<D>>,
    isAggregated: boolean,
) => AggregatedValue;
export type Aggregator<D extends Record<string, unknown>> = AggregatorFn<D> | DefaultAggregators | string;
export type AggregatedValue = any;
//#endregion

//#region usePagination
export function usePagination<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace usePagination {
    const pluginName = 'usePagination';
}

export type UsePaginationOptions<D extends Record<string, unknown>> = Partial<{
    pageCount: number;
    manualPagination: boolean;
    autoResetPage?: boolean | undefined;
    paginateExpandedRows: boolean;
}>;

export interface UsePaginationState<D extends Record<string, unknown>> {
    pageSize: number;
    pageIndex: number;
}

export interface UsePaginationInstanceProps<D extends Record<string, unknown>> {
    page: Array<Row<D>>;
    pageCount: number;
    pageOptions: number[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    gotoPage: (updater: ((pageIndex: number) => number) | number) => void;
    previousPage: () => void;
    nextPage: () => void;
    setPageSize: (pageSize: number) => void;
}

//#endregion

//#region useResizeColumns
export function useResizeColumns<D extends object = {}>(hooks: Hooks<D>): void;

export namespace useResizeColumns {
    const pluginName = 'useResizeColumns';
}

export interface UseResizeColumnsOptions<D extends object> {
    disableResizing?: boolean | undefined;
    autoResetResize?: boolean | undefined;
}

export interface UseResizeColumnsState<D extends object> {
    columnResizing: {
        startX?: number | undefined;
        columnWidth: number;
        headerIdWidths: Record<string, number>;
        columnWidths: any;
        isResizingColumn?: string | undefined;
    };
}

export interface UseResizeColumnsColumnOptions<D extends Record<string, unknown>> {
    disableResizing?: boolean | undefined;
}

export interface TableResizerProps { }

export interface UseResizeColumnsColumnProps<D extends Record<string, unknown>> {
    getResizerProps: (props?: Partial<TableResizerProps>) => TableResizerProps;
    canResize: boolean;
    isResizing: boolean;
}

//#endregion

//#region useRowSelect
export function useRowSelect<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useRowSelect {
    const pluginName = 'useRowSelect';
}

export interface TableToggleAllRowsSelectedProps extends TableToggleCommonProps { }

export interface TableToggleRowsSelectedProps extends TableToggleCommonProps { }

export type UseRowSelectOptions<D extends Record<string, unknown>> = Partial<{
    manualRowSelectedKey: IdType<D>;
    autoResetSelectedRows: boolean;
    selectSubRows: boolean;
}>;

export interface UseRowSelectHooks<D extends Record<string, unknown>> {
    getToggleRowSelectedProps: Array<PropGetter<D, TableToggleRowsSelectedProps>>;
    getToggleAllRowsSelectedProps: Array<PropGetter<D, TableToggleAllRowsSelectedProps>>;
    getToggleAllPageRowsSelectedProps: Array<PropGetter<D, TableToggleAllRowsSelectedProps>>;
}

export interface UseRowSelectState<D extends Record<string, unknown>> {
    selectedRowIds: Record<IdType<D>, boolean>;
}

export interface UseRowSelectInstanceProps<D extends Record<string, unknown>> {
    toggleRowSelected: (rowId: IdType<D>, set?: boolean) => void;
    toggleAllRowsSelected: (value?: boolean) => void;
    getToggleAllRowsSelectedProps: (
        props?: Partial<TableToggleAllRowsSelectedProps>,
    ) => TableToggleAllRowsSelectedProps;
    getToggleAllPageRowsSelectedProps: (
        props?: Partial<TableToggleAllRowsSelectedProps>,
    ) => TableToggleAllRowsSelectedProps;
    isAllRowsSelected: boolean;
    selectedFlatRows: Array<Row<D>>;
}

export interface UseRowSelectRowProps<D extends Record<string, unknown>> {
    isSelected: boolean;
    isSomeSelected: boolean;
    toggleRowSelected: (set?: boolean) => void;
    getToggleRowSelectedProps: (props?: Partial<TableToggleRowsSelectedProps>) => TableToggleRowsSelectedProps;
}

//#endregion

//#region useRowState
export function useRowState<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useRowState {
    const pluginName = 'useRowState';
}

export type UseRowStateOptions<D extends Record<string, unknown>> = Partial<{
    initialRowStateAccessor: (row: Row<D>) => UseRowStateLocalState<D>;
    getResetRowStateDeps: (instance: TableInstance<D>) => any[];
    autoResetRowState?: boolean | undefined;
}>;

export interface UseRowStateState<D extends Record<string, unknown>> {
    rowState: Record<string, { cellState: UseRowStateLocalState<D> }>;
}

export interface UseRowStateInstanceProps<D extends Record<string, unknown>> {
    setRowState: (rowPath: string[], updater: UseRowUpdater) => void;
    setCellState: (rowPath: string[], columnId: IdType<D>, updater: UseRowUpdater) => void;
}

export interface UseRowStateRowProps<D extends Record<string, unknown>> {
    state: UseRowStateLocalState<D>;
    setState: (updater: UseRowUpdater) => void;
}

export interface UseRowStateCellProps<D extends Record<string, unknown>> {
    state: UseRowStateLocalState<D>;
    setState: (updater: UseRowUpdater) => void;
}

export type UseRowUpdater<T = unknown> = T | ((prev: T) => T);
export type UseRowStateLocalState<D extends Record<string, unknown>, T = unknown> = Record<IdType<D>, T>;
//#endregion

//#region useSortBy
export function useSortBy<D extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks<D>): void;

export namespace useSortBy {
    const pluginName = 'useSortBy';
}

export interface TableSortByToggleProps {
    title?: string | undefined;
    style?: CSSProperties | undefined;
    onClick?: ((e: MouseEvent) => void) | undefined;
}

export type UseSortByOptions<D extends object> = Partial<{
    manualSortBy: boolean;
    disableSortBy: boolean;
    defaultCanSort: boolean;
    disableMultiSort: boolean;
    isMultiSortEvent: (e: MouseEvent) => boolean;
    maxMultiSortColCount: number;
    disableSortRemove: boolean;
    disabledMultiRemove: boolean;
    orderByFn: (rows: Array<Row<D>>, sortFns: Array<SortByFn<D>>, directions: boolean[]) => Array<Row<D>>;
    sortTypes: Record<string, SortByFn<D>>;
    autoResetSortBy?: boolean | undefined;
}>;

export interface UseSortByHooks<D extends Record<string, unknown>> {
    getSortByToggleProps: Array<PropGetter<D, TableCommonProps>>;
}

export interface UseSortByState<D extends Record<string, unknown>> {
    sortBy: Array<SortingRule<D>>;
}

export type UseSortByColumnOptions<D extends Record<string, unknown>> = Partial<{
    defaultCanSort: boolean;
    disableSortBy: boolean;
    sortDescFirst: boolean;
    sortInverted: boolean;
    sortType: SortByFn<D> | DefaultSortTypes | string;
}>;

export interface UseSortByInstanceProps<D extends Record<string, unknown>> {
    rows: Array<Row<D>>;
    preSortedRows: Array<Row<D>>;
    setSortBy: (sortBy: Array<SortingRule<D>>) => void;
    toggleSortBy: (columnId: IdType<D>, descending?: boolean, isMulti?: boolean) => void;
}

export interface UseSortByColumnProps<D extends Record<string, unknown>> {
    canSort: boolean;
    toggleSortBy: (descending?: boolean, multi?: boolean) => void;
    getSortByToggleProps: (props?: Partial<TableSortByToggleProps>) => TableSortByToggleProps;
    clearSortBy: () => void;
    isSorted: boolean;
    sortedIndex: number;
    isSortedDesc: boolean | undefined;
}

export type SortByFn<D extends Record<string, unknown>> = (rowA: Row<D>, rowB: Row<D>, columnId: IdType<D>, desc?: boolean) => number;

export type DefaultSortTypes = 'alphanumeric' | 'datetime' | 'basic' | 'string' | 'number';

export interface SortingRule<D> {
    id: IdType<D>;
    desc?: boolean | undefined;
}

//#endregion

// Additional API
export const actions: Record<string, string>;
export type ActionType = { type: string } & Record<string, any>;
export const defaultColumn: Partial<Column> & Record<string, any>;

// Helpers
export type StringKey<D> = Extract<keyof D, string>;
export type IdType<D> = StringKey<D> | string;
export type CellValue<V = any> = V;

export type Renderer<Props> = ComponentType<Props> | ReactElement | ReactText | ReactFragment;

export interface PluginHook<D extends Record<string, unknown>> {
    (hooks: Hooks<D>): void;
    pluginName?: string | undefined;
}

export type TableDispatch<A = any> = (action: A) => void;

// utils
export function defaultOrderByFn<D extends Record<string, unknown> = Record<string, unknown>>(
    arr: Array<Row<D>>,
    funcs: Array<SortByFn<D>>,
    dirs: boolean[],
): Array<Row<D>>;

export function defaultGroupByFn<D extends Record<string, unknown> = Record<string, unknown>>(
    rows: Array<Row<D>>,
    columnId: IdType<D>,
): Record<string, Array<Row<D>>>;

export function makePropGetter(hooks: Hooks, ...meta: any[]): any;

export function reduceHooks<T extends Record<string, unknown> = Record<string, unknown>>(hooks: Hooks, initial: T, ...args: any[]): T;

export function loopHooks(hooks: Hooks, ...args: any[]): void;

export function ensurePluginOrder<D extends Record<string, unknown> = Record<string, unknown>>(
    plugins: Array<PluginHook<D>>,
    befores: string[],
    pluginName: string,
): void;

export function functionalUpdate<D extends Record<string, unknown> = Record<string, unknown>>(
    updater: any,
    old: Partial<TableState<D>>,
): Partial<TableState<D>>;

export function useGetLatest<T>(obj: T): () => T;

export function safeUseLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;

export function useMountedLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;

export function useAsyncDebounce<F extends (...args: any[]) => any>(defaultFn: F, defaultWait?: number): F;

export function makeRenderer(instance: TableInstance, column: ColumnInstance, meta?: any): ReactElement;
