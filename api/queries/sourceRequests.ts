import { sourceRequests } from "@db/schema";
import { getDb } from "./connection";

export async function createSourceRequest(data: {
  name: string;
  contact: string;
  comment?: string;
}) {
  const [{ id }] = await getDb().insert(sourceRequests).values({
    name: data.name,
    contact: data.contact,
    comment: data.comment || null,
  }).$returningId();
  return { id };
}
