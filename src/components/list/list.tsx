"use client";

import { ReactElement, ReactNode } from "react";
import { Table, TableHeader } from "../ui/table";
import { ReactWrapper } from "@lotexiu/react/components/implementations";


type SortDirection = "asc" | "desc";
type SelectMode = "single" | "multiple";

type ListProps<T> = {
	/* Column Settings */
	columns?: any[],
	columnTemplate?: (item: T) => ReactNode,
	sortColumnChange?: (column: any) => void,
	sortColumn?: any,
	sortDirectionChange?: (direction: SortDirection) => void,
	sortDirection?: SortDirection,
	selectMode?: SelectMode,
	/* Item Settings */
	list?: T[],
	rowTemplate?: (item: T) => ReactNode,
	itemsID?: (item: T) => string | number,
	subContentTemplate?: (item: T) => ReactNode,
	selectedItems?: T[],
	onSelectedItemsChange?: (items: T[]) => void,
	renderEmptyState?: () => ReactElement,
	/* Fetching & Loading States */
	infiniteScroll?: boolean,
	loadMore?: (page: number) => Promise<void>,
	page?: number,
	pageSize?: number,
	totalItems?: number,
	loading?: boolean,
}

export const List = ReactWrapper(
	class List<T> extends ReactWrapper.Client<ListProps<T>> {
		render(): ReactNode {
			const {...props } = this.props;

			return (
				<Table {...props}>
					<TableHeader>
					</TableHeader>
				</Table>
			);
		}
	}
)
