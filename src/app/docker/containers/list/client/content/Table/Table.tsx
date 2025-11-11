import { ReactWrapper } from '@lotexiu/react/components/implementations';
import { ReactNode } from 'react';
import '@lotexiu/typescript/global';
import {
	useReactTable,
	getCoreRowModel,
	ColumnDef,
	flexRender,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
	PlayIcon,
	PauseIcon,
	RefreshCwIcon,
	PowerIcon,
	TrashIcon,
} from 'lucide-react';
import { ContainerData } from '../../../types';
import { DockerContainerColumns } from './columns';

interface DockerContainersListTableProps {
	loading: boolean;
	containers: ContainerData[];
	actionLoading: Record<string, boolean>;
	performContainerAction: (containerId: string, action: string) => Promise<void>;
	deleteContainer: (containerId: string) => Promise<void>;
}

export const DockerContainersListTable = ReactWrapper(
	class DockerContainersListTable extends ReactWrapper.ClientComponent<DockerContainersListTableProps> {
		table: ReturnType<typeof useReactTable<ContainerData>> | null = null;

		setupHooks(): void {
			const { useMemo } = require('react');
			// Definindo colunas usando useMemo
			const columns: ColumnDef<ContainerData>[] = useMemo(() => DockerContainerColumns(this.renderActions.bind(this)), []);

			this.table = useReactTable({
				data: this.props.containers,
				columns,
				getCoreRowModel: getCoreRowModel(),
			});
		}

		renderActions(container: ContainerData): ReactNode {
			const { actionLoading, performContainerAction, deleteContainer } =
				this.props;

			return (
				<div className="flex items-center justify-end gap-1">
					{container.state === 'running' && (
						<>
							<Button
								size="icon-sm"
								variant="ghost"
								onClick={() => performContainerAction(container.id, 'pause')}
								disabled={!!actionLoading[container.id]}
								title="Pausar"
							>
								{actionLoading[container.id] ? <Spinner /> : <PauseIcon />}
							</Button>
							<Button
								size="icon-sm"
								variant="ghost"
								onClick={() => performContainerAction(container.id, 'restart')}
								disabled={!!actionLoading[container.id]}
								title="Reiniciar"
							>
								{actionLoading[container.id] ? <Spinner /> : <RefreshCwIcon />}
							</Button>
							<Button
								size="icon-sm"
								variant="ghost"
								onClick={() => performContainerAction(container.id, 'stop')}
								disabled={!!actionLoading[container.id]}
								title="Parar"
							>
								{actionLoading[container.id] ? <Spinner /> : <PowerIcon />}
							</Button>
						</>
					)}
					{container.state === 'paused' && (
						<Button
							size="icon-sm"
							variant="ghost"
							onClick={() => performContainerAction(container.id, 'unpause')}
							disabled={!!actionLoading[container.id]}
							title="Retomar"
						>
							{actionLoading[container.id] ? <Spinner /> : <PlayIcon />}
						</Button>
					)}
					{(container.state === 'exited' || container.state === 'created') && (
						<Button
							size="icon-sm"
							variant="ghost"
							onClick={() => performContainerAction(container.id, 'start')}
							disabled={!!actionLoading[container.id]}
							title="Iniciar"
						>
							{actionLoading[container.id] ? <Spinner /> : <PlayIcon />}
						</Button>
					)}
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => deleteContainer(container.id)}
						disabled={!!actionLoading[container.id]}
						title="Deletar"
						className="text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						{actionLoading[container.id] ? <Spinner /> : <TrashIcon />}
					</Button>
				</div>
			);
		}

		render(): ReactNode | Promise<ReactNode> {
			const { loading, containers } = this.props;

			if (loading || !this.table) {
				return null;
			}

			if (containers.length === 0) {
				return null;
			}

			return (
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
													header.getContext()
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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
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
