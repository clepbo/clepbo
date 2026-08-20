import { getContent } from "@/lib/content";
import ChannelStyles from "./ChannelStyles";
import Desk from "./Desk";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <ChannelStyles channels={content.channels} />
      <Desk content={content} />
    </>
  );
}
