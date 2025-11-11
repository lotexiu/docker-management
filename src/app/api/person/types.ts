import z from "zod";
import { personSchema } from "./validation";

export type Person = z.infer<typeof personSchema>
