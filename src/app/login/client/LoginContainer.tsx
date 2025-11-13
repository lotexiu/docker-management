"use client";

import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

export const LoginContainer = ReactWrapper(
	class LoginContainer extends ReactWrapper.Client {
		isSignUp: boolean = false;

		setupHooks(): void {
			// Nenhum hook necessário no momento
		}

		onInit(): void {}

		switchToSignUp() {
			this.isSignUp = true;
			this.updateView();
		}

		switchToSignIn() {
			this.isSignUp = false;
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div>
					{this.isSignUp ? (
						<SignUp onSwitchToSignIn={this.switchToSignIn} />
					) : (
						<SignIn onSwitchToSignUp={this.switchToSignUp} />
					)}
				</div>
			);
		}
	},
);
