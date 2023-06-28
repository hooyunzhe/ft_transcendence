import { ChannelMemberList } from '@/components/channel-member/ChannelMemberList';
export default function Home() {
  return (
    <>
      {/* @ts-expect-error Server Component  */}
      <ChannelMemberList></ChannelMemberList>
    </>
  );
}
