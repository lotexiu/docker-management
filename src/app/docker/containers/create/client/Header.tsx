import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { ReactWrapper } from "../../../../../../../../packages/react/dist/components/implementations";
import { PlusCircleIcon, ArrowLeftIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DockerContainerCreateHeader = ReactWrapper(
	class DockerContainerCreateHeader extends ReactWrapper.Client {
		render(): ReactNode {
			return (
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-left">
									<PlusCircleIcon className="inline mr-2" />
									Criar Novo Container
								</CardTitle>
								<CardDescription className="text-left mt-2">
									Configure e crie um novo container Docker
								</CardDescription>
							</div>
							<Link href="/docker/containers/list">
								<Button variant="outline">
									<ArrowLeftIcon />
									Voltar
								</Button>
							</Link>
						</div>
					</CardHeader>
				</Card>
			);
		}
	},
);
