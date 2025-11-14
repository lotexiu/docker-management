"use client";

import { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ObjectUtils } from "@lotexiu/typescript/natives/object/generic/utils";
import { TColumn, TColumnTemplate, TListProps } from "./types";

export const List = ReactWrapper(
	class List<
		T,
		C extends TColumn<TCT>[],
		TCT extends TColumnTemplate<C>
	> extends ReactWrapper.Client<TListProps<T,C,TCT>> {

		setupHooks(): void {
			// type T = TMap

		}

		render(): ReactNode {
			const {columns, columnTemplate, rowTemplate, ...props } = this.props as any as TListProps<any,TColumn<null>[]>;

			return (
				<Table {...props}>
					<TableHeader>
						{columns.map((column) => (
							<TableRow key={column.id}>
								<TableHead key={column.id}>
									{
										columnTemplate?.(column) ||
										<div key={column.id}>{column.name}</div>
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
											rowTemplate?.(column, item) ||
											<div key={column.id}>
												{}
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
);
