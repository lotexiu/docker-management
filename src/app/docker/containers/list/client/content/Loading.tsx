import { ReactWrapper } from '@lotexiu/react/components/implementations';
import { ReactNode } from 'react';
import '@lotexiu/typescript/global';
import { Spinner } from '@/components/ui/spinner';

interface DockerContainersListLoadingProps {
	loading: boolean;
}

export const DockerContainersListLoading = ReactWrapper(
	class DockerContainersListLoading extends ReactWrapper.ClientComponent<DockerContainersListLoadingProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { loading } = this.props;

			return (
				<>
					{/* Loading */}
					{loading && (
						<div className="flex items-center justify-center py-12">
							<Spinner className="size-8" />
							<span className="ml-2 text-foreground">
								Carregando containers...
							</span>
						</div>
					)}
				</>
			)
		}
	}
)
