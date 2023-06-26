import { ChannelMemberList } from '@/components/ChannelMemberList';
export default function Home() {
  return (
    <>
      {/* @ts-expect-error Server Component  */}
      <ChannelMemberList></ChannelMemberList>
    </>
  );
}
