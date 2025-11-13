"use client";

import { Component, ReactElement, ReactNode } from "react";
import { Table, TableHeader } from "../ui/table";
import { TInstanceType } from "@lotexiu/typescript/natives/function/generic/types";
import { ReactUI, ReactUIInst } from "@lotexiu/react/components/ReactUIComponent/ReactUI";
import { TClazz } from "@lotexiu/typescript/natives/class/generic/types";
import { ReactWrapper } from "@lotexiu/react/components/implementations";


type SortDirection = "asc" | "desc";
type SelectMode = "single" | "multiple";

class Testx {
	id = 1
}

const BComp = ReactWrapper(
	class D<T> extends ReactUI(Testx)<ListProps<T>> {
		render(): ReactNode | Promise<ReactNode> {
			throw new Error("Method not implemented.");

			this.id
		}
	}
)

function Test() {
	return (
		<>
			<BComp
				list={['']}
				rowTemplate={()=>{return <></>}}

			>
			</BComp>
		</>
	)
}



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

// export const List = ReactWrapper(
// 	class List<T> extends ReactWrapper.Client<ListProps<T>> {
// 		render(): ReactNode {
// 			const { children, ...props } = this.props;

// 			return (
// 				<Table {...props}>
// 					<TableHeader>
// 						{children}
// 					</TableHeader>
// 				</Table>
// 			);
// 		}
// 	}
// )
