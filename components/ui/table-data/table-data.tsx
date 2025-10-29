import { cva } from "class-variance-authority";
import { getTable } from "./Table";
import { getTableHeader } from "./TableHeader";
import { getTableRow } from "./TableRow";
import { getTableFooter } from "./TableFooter";
import { getTableHead } from "./TableHead";
import { getTableBody } from "./TableBody";
import { getTableCell } from "./TableCell";
import { getTableCaption } from "./TableCaption";

export const variations = {
	basic: {
		Table: getTable("rounded-2xl border-2 p-0"),
		TableHeader: getTableHeader(""),
		TableHead: getTableHead("border-b-2 p-1"),
		TableBody: getTableBody(""),
		TableCell: getTableCell("p-1"),
		TableRow: getTableRow("border-b-2 last:border-b-0 hover:bg-primary/30"),
		TableFooter: getTableFooter("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"),
		TableCaption: getTableCaption(""),
	}
}