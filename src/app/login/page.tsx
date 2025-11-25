import { ReactNode } from "react";
import { LoginContainer } from "./client/LoginContainer";
import { ReactWrapper } from "@lotexiu/react";

const LoginPage = ReactWrapper(
	class LoginPage extends ReactWrapper.Server {
		render(): ReactNode {
			return (
				<div>
					<LoginContainer />
				</div>
			);
		}
	},
);

export default LoginPage;
