'use client';

import { ReactWrapper } from '@lotexiu/react/components/implementations';
import { ReactNode } from 'react';
import '@lotexiu/typescript/global';
import {
	Pagination,
	PaginationContent,
	PaginationItem, PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';
import { ContainerData, PaginationData } from '../../types';

interface DockerContainersListPaginationProps {
	pagination: PaginationData;
	loading: boolean;
	containers: ContainerData[];
	handlePageChange: (page: number) => void;
	renderPaginationItems: () => ReactNode;
}

export const DockerContainersListPagination = ReactWrapper(
	class DockerContainersListPagination extends ReactWrapper.ClientComponent<DockerContainersListPaginationProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { pagination, handlePageChange, loading, containers, renderPaginationItems } = this.props;

			return (
				<>
					{/* Paginação */}
					{!loading &&
						containers.length > 0 &&
						pagination.totalPages > 1 && (
							<div className="mt-6">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={() =>
													handlePageChange(pagination.page - 1)
												}
												className={
													pagination.page === 1
														? 'pointer-events-none opacity-50'
														: 'cursor-pointer'
												}
											/>
										</PaginationItem>
										{renderPaginationItems()}
										<PaginationItem>
											<PaginationNext
												onClick={() =>
													handlePageChange(pagination.page + 1)
												}
												className={
													pagination.page ===
													pagination.totalPages
														? 'pointer-events-none opacity-50'
														: 'cursor-pointer'
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
				</>
			)
		}
	}
)
