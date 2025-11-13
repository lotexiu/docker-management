import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import "@lotexiu/typescript/global";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PaginationData } from "../../types";

interface DockerContainersListControllersProps {
	pagination: PaginationData;
	handlePageSizeChange: (value: string) => void;
}

export const DockerContainersListControllers = ReactWrapper(
	class DockerContainersListControllers extends ReactWrapper.Client<DockerContainersListControllersProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { pagination, handlePageSizeChange } = this.props;

			return (
				<>
					{/* Controles */}
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-sm text-foreground">Itens por página:</span>
							<Select
								value={String(pagination.pageSize)}
								onValueChange={(value) => handlePageSizeChange(value)}
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
						<span className="text-sm text-foreground">
							Total: {pagination.total} container(s)
						</span>
					</div>
				</>
			);
		}
	},
);
