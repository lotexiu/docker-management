"use client";

import { TableCell } from "@/components/ui/table-data/TableCell";
import { TableHead } from "@/components/ui/table-data/TableHead";
import { TableRow } from "@/components/ui/table-data/TableRow";
import { TableBody } from "@/components/ui/table-data/TableBody";
import { TableHeader } from "@/components/ui/table-data/TableHeader";
import { Table } from "@/components/ui/table-data/Table";
import { ContainerInfo } from "dockerode";

interface DockerContainerPageContentProps {
	containers?: ContainerInfo[];
}

export function DockerContainerPageContent(props:DockerContainerPageContentProps) {
	const fakeData = new Array(5).fill(null).map((_,index)=>`data-${index}`)
	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						{fakeData.map((id, column) => (
							<TableHead key={id}>
								{column}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{fakeData.map((id, row) => (
						<TableRow key={id}>
							{fakeData.map((_, column) => (
								<TableCell key={`cell-${row}-${column}`}>
									<div>row:{row} -- col:{column}</div>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);


	// return (
	// 	<div>
	// 		<h2>Conteúdo do Docker Container (Client Rendering)</h2>
	// 		{props.containers && props.containers.length > 0 ? (
	// 			<ul>
	// 				{props.containers.map(container => (
	// 					<li key={container.Id}>{container.Names.join(", ")}</li>
	// 				))}
	// 			</ul>
	// 		) : (
	// 			<p>Nenhum container encontrado.</p>
	// 		)}
	// 	</div>
	// );
}