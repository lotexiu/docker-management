"use client";

import * as React from "react";
import { ReactWrapper } from "@lotexiu/react/components/implementations";
import "@lotexiu/typescript/global";
import {
	useReactTable,
	getCoreRowModel,
	ColumnDef,
	flexRender,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Users, RefreshCw, AlertCircle } from "lucide-react";
import { PersonListColumns, UserListItem } from "./columns";

type PersonListProps = {};

export const PersonList = ReactWrapper(
	class PersonList extends ReactWrapper.Client<PersonListProps> {
		users: UserListItem[] = [];
		isLoading: boolean = true;
		error: string | null = null;
		table: ReturnType<typeof useReactTable<UserListItem>> | null = null;

		onInit(): void {
			this.loadUsers();
		}

		setupHooks(): void {
			const { useMemo } = require("react");

			// Definindo colunas usando useMemo
			const columns: ColumnDef<UserListItem>[] = useMemo(
				() => PersonListColumns(),
				[],
			);

			this.table = useReactTable({
				data: this.users,
				columns,
				getCoreRowModel: getCoreRowModel(),
			});
		}

		async loadUsers() {
			this.isLoading = true;
			this.error = null;
			this.updateView();

			try {
				const response = await fetch("/api/person/register", {
					method: "GET",
				});

				if (!response.ok) {
					throw new Error("Erro ao carregar usuários");
				}

				const data = await response.json();
				this.users = data.users || [];
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Erro desconhecido ao carregar usuários";
				console.error("Erro ao carregar usuários:", error);
			} finally {
				this.isLoading = false;
				this.updateView();
			}
		}

		render(): React.ReactNode {
			return (
				<div className="container mx-auto py-8 px-4">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Users className="h-6 w-6" />
								<CardTitle>Lista de Usuários</CardTitle>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="secondary">
									{this.users.length} usuário
									{this.users.length !== 1 ? "s" : ""}
								</Badge>
								<Button
									variant="outline"
									size="sm"
									onClick={this.loadUsers}
									disabled={this.isLoading}
								>
									<RefreshCw
										className={`h-4 w-4 mr-2 ${
											this.isLoading ? "animate-spin" : ""
										}`}
									/>
									Atualizar
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{this.isLoading && (
							<div className="flex justify-center items-center py-12">
								<Spinner className="h-6 w-6" />
								<span className="ml-3 text-foreground">
									Carregando usuários...
								</span>
							</div>
						)}

						{this.error && !this.isLoading && (
							<div className="flex items-center justify-center py-12 text-destructive">
								<AlertCircle className="h-5 w-5 mr-2" />
								<span>{this.error}</span>
							</div>
						)}

						{!this.isLoading && !this.error && this.users.length === 0 && (
							<div className="text-center py-12 text-foreground">
								<Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Nenhum usuário cadastrado</p>
							</div>
						)}

						{!this.isLoading && !this.error && this.users.length > 0 && this.table && (
							<div className="rounded-md">
								<Table>
									<TableHeader>
										{this.table.getHeaderGroups().map((headerGroup) => (
											<TableRow key={headerGroup.id}>
												{headerGroup.headers.map((header) => (
													<TableHead key={header.id}>
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
													</TableHead>
												))}
											</TableRow>
										))}
									</TableHeader>
									<TableBody>
										{this.table.getRowModel().rows.map((row) => (
											<TableRow key={row.id}>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</div>
			);
		}
	},
);

export default PersonList;
