export default async function call_API(
  route: string,
  method: string,
  messageBody?: any,
): Promise<any> {
  const domain = 'http://localhost:4242/api/';
  let response, text;

  await fetch(domain + route, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageBody),
  })
    .then((data) => (text = data.text()))
    .then((text) => (response = text.length ? JSON.parse(text) : null))
    .catch((error) => {
      console.log('Error :', error);
      response = error;
    });
  return response;
}
