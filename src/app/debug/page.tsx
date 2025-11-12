import { Label } from "@/components/ui/label";
import { ReactWrapper } from "@lotexiu/react/components/implementations";

const DebugPage = ReactWrapper(
	class DebugPage extends ReactWrapper.ServerComponent {
		async render(): Promise<React.ReactNode> {
			// Busca os dados via fetch (força re-fetch a cada acesso)
			const response = await fetch(
				"http://localhost:3002/api/person/register",
				{
					cache: "no-store", // Importante: desabilita cache
				},
			);
			const data = await response.json();
			const users = data.users || [];

			return (
				<div className="p-4">
					<div id="register-users" className="">
						<Label>Contas registradas ({data.count})</Label>
						{users.length === 0 ? (
							<p>Nenhum usuário registrado.</p>
						) : (
							<ul className="list-disc list-inside">
								{users.map((user: any, index: number) => (
									<li key={index}>
										<strong>Username:</strong> {user.username} |{" "}
										<strong>Email:</strong> {user.email}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			);
		}
	},
);

export default DebugPage;
