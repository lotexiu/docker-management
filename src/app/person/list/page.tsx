import { List } from "@/components/list/list";
import { ReactWrapper } from "../../../../../../packages/react/dist/components/implementations";
import { ReactUI } from "@lotexiu/react/components/ReactUIComponent/ReactUI";
import { ReactUIServer } from "@lotexiu/react/components/ReactUIComponent/ReactUIServer";
import { ReactNode } from "react";


const PersonList = ReactWrapper(
	class PersonList extends ReactUI() {
		render(): ReactNode | Promise<ReactNode> {
			return (
				<>
					<List>
					</List>
				</>
			)
		}
	}
)

export default PersonList;
