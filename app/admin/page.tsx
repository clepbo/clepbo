import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getContentFresh } from "@/lib/content";
import Editor from "./Editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const content = await getContentFresh();
  return <Editor initial={content} />;
}
