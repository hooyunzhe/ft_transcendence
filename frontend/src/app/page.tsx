import ChannelHeader from '@/components/ChannelHeader';
import { ChannelMemberList } from '@/components/ChannelMemberList';
export default function Home() {
  return (
    <>
      <ChannelHeader></ChannelHeader>
      {/* @ts-expect-error Server Component  */}
      <ChannelMemberList></ChannelMemberList>
    </>
  );
}
