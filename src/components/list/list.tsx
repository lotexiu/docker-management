"use client";

import { ReactElement, ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ReactWrapper } from "@lotexiu/react/components/implementations";


type SortDirection = "asc" | "desc";
type SelectMode = "single" | "multiple";

type ListProps<T> = {
	/* Column Settings */
	columns: any[],
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
			const {columns, columnTemplate, ...props } = this.props;

			return (
				<Table {...props}>
					<TableHeader>
						{columns.map((column) => (
							<TableRow key={column.id}>
								<TableHead key={column.id}>
									{
										columnTemplate?.(column) ||
										<div key={column.id}>{column.header}</div>
									}
								</TableHead>
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{props.list?.map((item) => (
							<TableRow >
								{columns.map((column) => (
									<TableCell key={column.id}>
										{
											columnTemplate?.(item) ||
											<div key={column.id}>
												{item[column.name]}
											</div>
										}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			);
		}
	}
)
