import { ReactWrapper } from "@lotexiu/react/components/implementations"
import { ReactServerComponent } from "@lotexiu/react/components/ReactComponent/ReactServerComponent"
import { ReactNode } from "react"
import { LoginContainer } from "./client/LoginContainer"


const LoginPage = ReactWrapper(
  class LoginPage extends ReactServerComponent {
    
    render(): ReactNode {
      return (
        <div>
          <LoginContainer />
        </div>
      )
    }
  }
)

export default LoginPage;