import { TMap } from "@lotexiu/typescript/natives/object/generic/types";
import { Key, ReactNode } from "react";

type TSortDirection = "asc" | "desc";

type TSelectMode = | "single" | "multiple";

type TColumnDirection = "left" | "right" | "center";

type TColumnTemplate<
	C extends TColumn<any>[],
> = (column: C[number]) => ReactNode

type TColumn<
	TCT=any
> = {
	id: Key;
	name: string;
	sortable?: boolean;
	hide?: boolean;
} & TMap<TCT, {
		direction?: TColumnDirection;
		valuePath: string;
	}, [
	[TColumnTemplate<[]> | true, {}],
]>;

type TSortColumn<
	C extends TColumn<any>
> = {
	column: C['id'];
	direction: TSortDirection;
}

type TSortColumns<
	C extends TColumn<any>[]
> = {
	[K in keyof C]: TSortColumn<C[K]>;
}

type TPagination = {
	page: number;
	pageSize: number;
	totalItems: number;
	infiniteScroll?: boolean;
	loadMore?: (page: number) => Promise<void>;
	loading?: boolean;
}

type TListProps<
	T,
	C extends TColumn<TCT>[],
	TCT extends TColumnTemplate<C> = any,
> = {
	/* Column Settings */
	columns: C,
	sort?: (sortColumns: TSortColumns<C>) => void,
	sortColumns?: TSortColumns<C>,
	/* Template */
	columnTemplate?: TCT,
	rowTemplate?: (column: C[number], item: T) => ReactNode,
	subContentTemplate?: (column: C[number], item: T) => ReactNode,
	/* Selection */
	selectMode?: TSelectMode,
	/* Item Settings */
	list: T[],
	itemsID: (item: T) => string | number,
	selectedItems?: T[],
	onSelectedItemsChange?: (items: T[]) => void,
	/* Fetching & Loading States */
	renderEmptyState?: () => ReactNode,
	pagination?: TPagination,
}

export type {
	TSortDirection,
	TSelectMode,
	TColumnTemplate,
	TColumn,
	TSortColumn,
	TSortColumns,
	TPagination,
	TListProps,
}
