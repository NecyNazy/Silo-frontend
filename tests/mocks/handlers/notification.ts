import { http, HttpResponse } from 'msw';
import { notifications } from '../db';

export const notificationHandlers = [
  http.get('/api/notifications/member/:memberId', ({ params }) => {
    const results = notifications.filter((n) => n.memberId === params.memberId).reverse();
    return HttpResponse.json(results);
  }),
];
