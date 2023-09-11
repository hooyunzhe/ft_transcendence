import { APIResponse } from '@/types/UtilTypes';

export default async function callAPI(
  method: string,
  route: string,
  messageBody?: any,
): Promise<APIResponse> {
  const domain = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/';
  const response = await fetch(domain + route, {
    cache: 'no-store',
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageBody),
  });
  const bodyText = await response.text();
  const body = bodyText ? JSON.parse(bodyText) : bodyText;

  if (!response.ok) {
    console.log(body);
  }
  return {
    status: response.status,
    body: response.ok ? body : null,
  };
}
