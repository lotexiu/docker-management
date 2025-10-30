"use client";

import { TableVariations } from "@/components/ui/table-data/table-data";
import { ContainerInfo } from "dockerode";

interface DockerContainerPageContentProps {
	containers?: ContainerInfo[];
}

export function DockerContainerPageContent(props:DockerContainerPageContentProps) {
	const { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } = TableVariations['basic']


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