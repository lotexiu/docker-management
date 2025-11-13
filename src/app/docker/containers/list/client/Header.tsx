import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { Container, RefreshCwIcon, PlusCircleIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DockerContainersListHeaderProps {
	fetchContainers: () => Promise<void>;
	loading: boolean;
}

export const DockerContainersListHeader = ReactWrapper(
	class DockerContainersListHeader extends ReactWrapper.Server<DockerContainersListHeaderProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { fetchContainers, loading } = this.props;

			return (
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
						<div className="flex items-center gap-2">
							<Link href="/docker/containers/create">
								<Button variant="default">
									<PlusCircleIcon />
									Criar Container
								</Button>
							</Link>
							<Button
								onClick={() => fetchContainers()}
								disabled={loading}
								variant="outline"
							>
								<RefreshCwIcon className={loading ? "animate-spin" : ""} />
								Atualizar
							</Button>
						</div>
					</div>
				</CardHeader>
			);
		}
	},
);
