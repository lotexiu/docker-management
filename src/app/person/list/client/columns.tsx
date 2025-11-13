import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type UserListItem = {
	username: string;
	email: string;
};

export function PersonListColumns(): ColumnDef<UserListItem>[] {
	return [
		{
			id: "index",
			header: "#",
			cell: ({ row }) => (
				<div className="font-medium w-[50px]">{row.index + 1}</div>
			),
		},
		{
			id: "username",
			header: "Usuário",
			accessorKey: "username",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.username}</div>
			),
		},
		{
			id: "email",
			header: "Email",
			accessorKey: "email",
			cell: ({ row }) => (
				<div className="text-sm text-foreground">
					{row.original.email}
				</div>
			),
		},
	];
}
