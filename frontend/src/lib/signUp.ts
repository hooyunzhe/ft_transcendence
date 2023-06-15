export function signUp(username: string, refresh_token: string) {
  fetch(`http://${process.env.NEXT_PUBLIC_HOST_URL}:4242/api/users`, {
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