import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { LoginContainer } from "./client/LoginContainer";

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
