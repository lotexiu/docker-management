'use client';

import { ReactWrapper } from '@lotexiu/react/components/implementations';
import { ReactNode } from 'react';
import '@lotexiu/typescript/global';
import { Property } from '@lotexiu/typescript/natives/object/proxy/types';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
	PlayIcon,
	PauseIcon,
	RefreshCwIcon,
	PowerIcon,
	TrashIcon,
	Container,
	AlertCircleIcon,
} from 'lucide-react';

// Tipos da API
interface ContainerData {
	id: string;
	name: string;
	image: string;
	status: string;
	state: string;
	created: number;
	ports?: Array<{
		IP?: string;
		PrivatePort: number;
		PublicPort?: number;
		Type: string;
	}>;
}

interface PaginationData {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

const DockerContainersListPage = ReactWrapper(
	class DockerContainersListPage extends ReactWrapper.ClientComponent {
		containers: ContainerData[] = [];
		pagination: PaginationData = {
			page: 1,
			pageSize: 10,
			total: 0,
			totalPages: 0,
		};
		loading: boolean = true;
		error: string | null = null;
		actionLoading: Record<string, boolean> = {};

		setupHooks(): void {
			const { useEffect } = require('react');

			useEffect(() => {
				this.fetchContainers();
			}, [this.pagination.page, this.pagination.pageSize]);
		}

		async fetchContainers() {
			this.loading = true;
			this.error = null;
			this.updateView();

			try {
				const response = await fetch(
					`/api/docker/containers/list?page=${this.pagination.page}&pageSize=${this.pagination.pageSize}&all=true`
				);
				const result: ApiResponse<{
					containers: ContainerData[];
					pagination: PaginationData;
				}> = await response.json();

				if (result.success && result.data) {
					this.containers = result.data.containers;
					this.pagination = result.data.pagination;
				} else {
					this.error = result.error || 'Erro ao carregar containers';
				}
			} catch (err) {
				this.error = 'Erro ao conectar com a API';
				console.error('Erro ao buscar containers:', err);
			} finally {
				this.loading = false;
				this.updateView();
			}
		}

		async performContainerAction(containerId: string, action: string) {
			this.actionLoading[containerId] = true;
			this.updateView();

			try {
				const response = await fetch(
					`/api/docker/containers/${containerId}/update`,
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ action }),
					}
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
				this.error = 'Erro ao executar ação no container';
				console.error('Erro na ação do container:', err);
				this.updateView();
			} finally {
				delete this.actionLoading[containerId];
				this.updateView();
			}
		}

		async deleteContainer(containerId: string) {
			if (
				!confirm(
					'Tem certeza que deseja deletar este container? Esta ação não pode ser desfeita.'
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
						method: 'DELETE',
					}
				);

				const result: ApiResponse = await response.json();

				if (result.success) {
					await this.fetchContainers();
				} else {
					this.error = result.error || 'Erro ao deletar container';
					this.updateView();
				}
			} catch (err) {
				this.error = 'Erro ao deletar container';
				console.error('Erro ao deletar container:', err);
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

		handlePageSizeChange(newSize: string) {
			this.pagination.pageSize = parseInt(newSize, 10);
			this.pagination.page = 1; // Resetar para primeira página
			this.updateView();
		}

		getStatusColor(state: string): string {
			const colors: Record<string, string> = {
				running: 'text-green-600',
				paused: 'text-yellow-600',
				exited: 'text-red-600',
				created: 'text-blue-600',
				restarting: 'text-orange-600',
			};
			return colors[state.toLowerCase()] || 'text-gray-600';
		}

		getStatusBadge(state: string): string {
			const badges: Record<string, string> = {
				running: 'bg-green-100 text-green-800 border-green-200',
				paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
				exited: 'bg-red-100 text-red-800 border-red-200',
				created: 'bg-blue-100 text-blue-800 border-blue-200',
				restarting: 'bg-orange-100 text-orange-800 border-orange-200',
			};
			return badges[state.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
		}

		formatPorts(ports?: ContainerData['ports']): string {
			if (!ports || ports.length === 0) return '-';
			return ports
				.map((p) => {
					if (p.PublicPort) {
						return `${p.PublicPort}:${p.PrivatePort}/${p.Type}`;
					}
					return `${p.PrivatePort}/${p.Type}`;
				})
				.join(', ');
		}

		formatDate(timestamp: number): string {
			const date = new Date(timestamp * 1000);
			return date.toLocaleString('pt-BR');
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
				</PaginationItem>
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
						</PaginationItem>
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
						</PaginationItem>
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
						</PaginationItem>
					);
				}
			}

			return items;
		}

		render(): ReactNode {
			return (
				<div className="container mx-auto py-8 px-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-left">
										<Container className="inline mr-2" />
										Docker Containers
									</CardTitle>
									<CardDescription className="text-left mt-2">
										Gerencie seus containers Docker
									</CardDescription>
								</div>
								<Button
									onClick={() => this.fetchContainers()}
									disabled={this.loading}
									variant="outline"
								>
									<RefreshCwIcon className={this.loading ? 'animate-spin' : ''} />
									Atualizar
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{/* Erro */}
							{this.error && (
								<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
									<AlertCircleIcon className="size-5" />
									<span>{this.error}</span>
								</div>
							)}

							{/* Controles */}
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground">
										Itens por página:
									</span>
									<Select
										value={String(this.pagination.pageSize)}
										onValueChange={(value) => this.handlePageSizeChange(value)}
									>
										<SelectTrigger size="sm">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="5">5</SelectItem>
											<SelectItem value="10">10</SelectItem>
											<SelectItem value="20">20</SelectItem>
											<SelectItem value="50">50</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<span className="text-sm text-muted-foreground">
									Total: {this.pagination.total} container(s)
								</span>
							</div>

							{/* Loading */}
							{this.loading && (
								<div className="flex items-center justify-center py-12">
									<Spinner className="size-8" />
									<span className="ml-2 text-muted-foreground">
										Carregando containers...
									</span>
								</div>
							)}

							{/* Tabela */}
							{!this.loading && this.containers.length > 0 && (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nome</TableHead>
											<TableHead>Imagem</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Portas</TableHead>
											<TableHead>Criado</TableHead>
											<TableHead className="text-right">Ações</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{this.containers.map((container) => (
											<TableRow key={container.id}>
												<TableCell className="font-medium">
													{container.name}
												</TableCell>
												<TableCell className="font-mono text-xs">
													{container.image}
												</TableCell>
												<TableCell>
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${this.getStatusBadge(
															container.state
														)}`}
													>
														{container.state}
													</span>
												</TableCell>
												<TableCell className="text-xs">
													{this.formatPorts(container.ports)}
												</TableCell>
												<TableCell className="text-xs text-muted-foreground">
													{this.formatDate(container.created)}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														{container.state === 'running' && (
															<>
																<Button
																	size="icon-sm"
																	variant="ghost"
																	onClick={() =>
																		this.performContainerAction(
																			container.id,
																			'pause'
																		)
																	}
																	disabled={!!this.actionLoading[container.id]}
																	title="Pausar"
																>
																	{this.actionLoading[container.id] ? (
																		<Spinner />
																	) : (
																		<PauseIcon />
																	)}
																</Button>
																<Button
																	size="icon-sm"
																	variant="ghost"
																	onClick={() =>
																		this.performContainerAction(
																			container.id,
																			'restart'
																		)
																	}
																	disabled={!!this.actionLoading[container.id]}
																	title="Reiniciar"
																>
																	{this.actionLoading[container.id] ? (
																		<Spinner />
																	) : (
																		<RefreshCwIcon />
																	)}
																</Button>
																<Button
																	size="icon-sm"
																	variant="ghost"
																	onClick={() =>
																		this.performContainerAction(
																			container.id,
																			'stop'
																		)
																	}
																	disabled={!!this.actionLoading[container.id]}
																	title="Parar"
																>
																	{this.actionLoading[container.id] ? (
																		<Spinner />
																	) : (
																		<PowerIcon />
																	)}
																</Button>
															</>
														)}
														{container.state === 'paused' && (
															<Button
																size="icon-sm"
																variant="ghost"
																onClick={() =>
																	this.performContainerAction(
																		container.id,
																		'unpause'
																	)
																}
																disabled={!!this.actionLoading[container.id]}
																title="Retomar"
															>
																{this.actionLoading[container.id] ? (
																	<Spinner />
																) : (
																	<PlayIcon />
																)}
															</Button>
														)}
														{(container.state === 'exited' ||
															container.state === 'created') && (
															<Button
																size="icon-sm"
																variant="ghost"
																onClick={() =>
																	this.performContainerAction(
																		container.id,
																		'start'
																	)
																}
																disabled={!!this.actionLoading[container.id]}
																title="Iniciar"
															>
																{this.actionLoading[container.id] ? (
																	<Spinner />
																) : (
																	<PlayIcon />
																)}
															</Button>
														)}
														<Button
															size="icon-sm"
															variant="ghost"
															onClick={() => this.deleteContainer(container.id)}
															disabled={!!this.actionLoading[container.id]}
															title="Deletar"
															className="text-red-600 hover:text-red-700 hover:bg-red-50"
														>
															{this.actionLoading[container.id] ? (
																<Spinner />
															) : (
																<TrashIcon />
															)}
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}

							{/* Vazio */}
							{!this.loading && this.containers.length === 0 && (
								<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
									<Container className="size-12 mb-4 opacity-50" />
									<p className="text-lg font-medium">Nenhum container encontrado</p>
									<p className="text-sm">
										Crie um novo container para começar
									</p>
								</div>
							)}

							{/* Paginação */}
							{!this.loading &&
								this.containers.length > 0 &&
								this.pagination.totalPages > 1 && (
									<div className="mt-6">
										<Pagination>
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														onClick={() =>
															this.handlePageChange(this.pagination.page - 1)
														}
														className={
															this.pagination.page === 1
																? 'pointer-events-none opacity-50'
																: 'cursor-pointer'
														}
													/>
												</PaginationItem>
												{this.renderPaginationItems()}
												<PaginationItem>
													<PaginationNext
														onClick={() =>
															this.handlePageChange(this.pagination.page + 1)
														}
														className={
															this.pagination.page ===
															this.pagination.totalPages
																? 'pointer-events-none opacity-50'
																: 'cursor-pointer'
														}
													/>
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									</div>
								)}
						</CardContent>
					</Card>
				</div>
			);
		}
	}
);

export default DockerContainersListPage;
