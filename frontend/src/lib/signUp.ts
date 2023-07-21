<<<<<<< HEAD
export function signUp(username: string, refresh_token: string) {
  fetch(`http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/api/users`, {
=======
export default function signUp(username: string, refresh_token: string) {
  fetch('http://localhost:4242/api/users', {
>>>>>>> 47abc119b3eb50e5874a2010d07e291fce0dacb5
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      refresh_token: refresh_token,
    }),
  }).catch((error) => console.log(error));
}
