"use client";

import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import "@lotexiu/typescript/global";
import {
	PaginationItem,
	PaginationLink,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { DockerContainersListHeader } from "./client/Header";
import { DockerContainersListContent } from "./client/content/Content";
import { ApiResponse, ContainerData, PaginationData } from "./types";

const DockerContainersListPage = ReactWrapper(
	class DockerContainersListPage extends ReactWrapper.ClientComponent {
		containers: ContainerData[] = [];
		pagination: PaginationData = {
			page: 1,
			pageSize: 10,
			total: 0,
			totalPages: 0,
		};
		loading: boolean = false;
		error: string | null = null;
		actionLoading: Record<string, boolean> = {};

		async fetchContainers() {
			this.loading = true;
			this.error = null;
			this.updateView();

			try {
				const response = await fetch(
					`/api/docker/containers/list?page=${this.pagination.page}&pageSize=${this.pagination.pageSize}&all=true`,
				);
				const result: ApiResponse<{
					containers: ContainerData[];
					pagination: PaginationData;
				}> = await response.json();

				if (result.success && result.data) {
					this.containers = result.data.containers;
					this.pagination = result.data.pagination;
				} else {
					this.error = result.error || "Erro ao carregar containers";
				}
			} catch (err) {
				this.error = "Erro ao conectar com a API";
				console.error("Erro ao buscar containers:", err);
			} finally {
				this.loading = false;
				this.updateView();
			}
		}

		handlePageSizeChange(newSize: string) {
			this.pagination.pageSize = parseInt(newSize, 10);
			this.pagination.page = 1; // Resetar para primeira página
			this.updateView();
		}

		async performContainerAction(containerId: string, action: string) {
			this.actionLoading[containerId] = true;
			this.updateView();

			try {
				const response = await fetch(
					`/api/docker/containers/${containerId}/update`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ action }),
					},
				);

				const result: ApiResponse = await response.json();

				if (result.success) {
					// Recarregar lista após ação
					await this.fetchContainers();
				} else {
					this.error = result.error || `Erro ao executar ação: ${action}`;
					this.updateView();
				}
			} catch (err) {
				this.error = "Erro ao executar ação no container";
				console.error("Erro na ação do container:", err);
				this.updateView();
			} finally {
				delete this.actionLoading[containerId];
				this.updateView();
			}
		}

		async deleteContainer(containerId: string) {
			if (
				!confirm(
					"Tem certeza que deseja deletar este container? Esta ação não pode ser desfeita.",
				)
			) {
				return;
			}

			this.actionLoading[containerId] = true;
			this.updateView();

			try {
				const response = await fetch(
					`/api/docker/containers/${containerId}/delete?force=true`,
					{
						method: "DELETE",
					},
				);

				const result: ApiResponse = await response.json();

				if (result.success) {
					await this.fetchContainers();
				} else {
					this.error = result.error || "Erro ao deletar container";
					this.updateView();
				}
			} catch (err) {
				this.error = "Erro ao deletar container";
				console.error("Erro ao deletar container:", err);
				this.updateView();
			} finally {
				delete this.actionLoading[containerId];
				this.updateView();
			}
		}

		handlePageChange(newPage: number) {
			if (newPage >= 1 && newPage <= this.pagination.totalPages) {
				this.pagination.page = newPage;
				this.updateView();
			}
		}

		renderPaginationItems(): ReactNode {
			const { page, totalPages } = this.pagination;
			const items: ReactNode[] = [];

			// Primeira página
			items.push(
				<PaginationItem key="page-1">
					<PaginationLink
						onClick={() => this.handlePageChange(1)}
						isActive={page === 1}
					>
						1
					</PaginationLink>
				</PaginationItem>,
			);

			if (totalPages <= 7) {
				// Mostrar todas as páginas
				for (let i = 2; i <= totalPages; i++) {
					items.push(
						<PaginationItem key={`page-${i}`}>
							<PaginationLink
								onClick={() => this.handlePageChange(i)}
								isActive={page === i}
							>
								{i}
							</PaginationLink>
						</PaginationItem>,
					);
				}
			} else {
				// Mostrar com elipses
				if (page > 3) {
					items.push(<PaginationEllipsis key="ellipsis-start" />);
				}

				const start = Math.max(2, page - 1);
				const end = Math.min(totalPages - 1, page + 1);

				for (let i = start; i <= end; i++) {
					items.push(
						<PaginationItem key={`page-${i}`}>
							<PaginationLink
								onClick={() => this.handlePageChange(i)}
								isActive={page === i}
							>
								{i}
							</PaginationLink>
						</PaginationItem>,
					);
				}

				if (page < totalPages - 2) {
					items.push(<PaginationEllipsis key="ellipsis-end" />);
				}

				if (totalPages > 1) {
					items.push(
						<PaginationItem key={`page-${totalPages}`}>
							<PaginationLink
								onClick={() => this.handlePageChange(totalPages)}
								isActive={page === totalPages}
							>
								{totalPages}
							</PaginationLink>
						</PaginationItem>,
					);
				}
			}

			return items;
		}

		render(): ReactNode {
			return (
				<div className="container mx-auto py-8 px-4">
					<DockerContainersListHeader
						fetchContainers={this.fetchContainers}
						loading={this.loading}
					/>
					<DockerContainersListContent
						error={this.error}
						handlePageSizeChange={this.handlePageSizeChange}
						pagination={this.pagination}
						loading={this.loading}
						performContainerAction={this.performContainerAction}
						actionLoading={this.actionLoading}
						containers={this.containers}
						deleteContainer={this.deleteContainer}
						handlePageChange={this.handlePageChange}
						renderPaginationItems={this.renderPaginationItems}
					/>
				</div>
			);
		}
	},
);

export default DockerContainersListPage;
