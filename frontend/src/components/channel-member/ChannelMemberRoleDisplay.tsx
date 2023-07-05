// interface ChannelMemberRoleDisplayProps{

// }


// export function ChannelMemberRoleDisplay()
// {
//   return {
//      <>
//             <IconButton
//               onClick={() => {
//                 handleAction(channelMember, ChannelMemberAction.BAN);
//               }}
//             >
//               <GavelRoundedIcon />
//             </IconButton>

//             <IconButton
//               onClick={() => {
//                 handleAction(channelMember, ChannelMemberAction.KICK);
//               }}
//             >
//               <SportsMartialArtsIcon />
//             </IconButton>

//             <IconButton
//               onClick={() => {
//                 console.log('printing admin button click');
//                 // need to think on how to handle owner
//                 if (channelMember.role === ChannelMemberRole.MEMBER) {
//                   handleAction(channelMember, ChannelMemberAction.ADMIN);
//                 } else {
//                   handleAction(channelMember, ChannelMemberAction.UNADMIN);
//                 }
//               }}
//             >
//               {channelMember.role === ChannelMemberRole.MEMBER ? (
//                 <AddModeratorIcon />
//               ) : (
//                 <RemoveModeratorIcon />
//               )}
//             </IconButton>
//             <IconButton
//               onClick={() => {
//                 console.log('printing muted button click');

//                 if (channelMember.status === ChannelMemberStatus.MUTED) {
//                   handleAction(channelMember, ChannelMemberAction.UNMUTE);
//                 } else {
//                   handleAction(channelMember, ChannelMemberAction.MUTE);
//                 }
//               }}
//             >
//               {channelMember.status === ChannelMemberStatus.MUTED ? (
//                 <CommentsDisabledIcon />
//               ) : (
//                 <CommentIcon />
//               )}
//             </IconButton>
//           </>
//   }
// }