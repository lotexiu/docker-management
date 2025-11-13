import { CardContent } from "@/components/ui/card";
import { ReactWrapper } from "../../../../../../../../../packages/react/dist/components/implementations";
import { ReactNode } from "react";
import { DockerContainersListError } from "./Error";
import { DockerContainersListControllers } from "./Controllers";
import { ContainerData, PaginationData } from "../../types";
import { DockerContainersListLoading } from "./Loading";
import { DockerContainersListTable } from "./Table/Table";
import { DockerContainersListEmpty } from "./Empty";
import { DockerContainersListPagination } from "./Pagination";

interface DockerContainersListContentProps {
	error: string | null;
	pagination: PaginationData;
	handlePageSizeChange: (value: string) => void;
	loading: boolean;
	containers: ContainerData[];
	actionLoading: Record<string, boolean>;
	performContainerAction: (
		containerId: string,
		action: string,
	) => Promise<void>;
	deleteContainer: (containerId: string) => Promise<void>;
	handlePageChange: (page: number) => void;
	renderPaginationItems: () => ReactNode;
}

export const DockerContainersListContent = ReactWrapper(
	class DockerContainersListContent extends ReactWrapper.Client<DockerContainersListContentProps> {
		render(): ReactNode | Promise<ReactNode> {
			const {
				error,
				pagination,
				handlePageSizeChange,
				loading,
				containers,
				actionLoading,
				performContainerAction,
				deleteContainer,
				handlePageChange,
				renderPaginationItems,
			} = this.props;

			return (
				<CardContent>
					<DockerContainersListError error={error} />
					<DockerContainersListControllers
						pagination={pagination}
						handlePageSizeChange={handlePageSizeChange}
					/>
					<DockerContainersListLoading loading={loading} />
					<DockerContainersListTable
						loading={loading}
						containers={containers}
						actionLoading={actionLoading}
						performContainerAction={performContainerAction}
						deleteContainer={deleteContainer}
					/>
					<DockerContainersListEmpty
						containers={containers}
						loading={loading}
					/>
					<DockerContainersListPagination
						containers={containers}
						pagination={pagination}
						loading={loading}
						handlePageChange={handlePageChange}
						renderPaginationItems={renderPaginationItems}
					/>
				</CardContent>
			);
		}
	},
);
