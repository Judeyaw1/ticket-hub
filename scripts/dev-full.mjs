import http from 'node:http';
import { parse as parseUrl } from 'node:url';
import { createServer as createViteServer } from 'vite';

function createResponse(response) {
  return {
    status(code) {
      response.statusCode = code;
      return this;
    },
    json(payload) {
      if (!response.headersSent) {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      response.end(JSON.stringify(payload));
    },
    send(payload) {
      response.end(payload);
    },
    end(payload) {
      response.end(payload);
    },
  };
}

function matchApiRoute(pathname) {
  const staticRoutes = {
    '/api/events': '/api/events/index.ts',
    '/api/dashboard': '/api/dashboard.ts',
    '/api/tickets': '/api/tickets.ts',
    '/api/profile': '/api/profile.ts',
    '/api/db-status': '/api/db-status.ts',
    '/api/purchase-ticket': '/api/purchase-ticket.ts',
    '/api/auth/login': '/api/auth/login.ts',
    '/api/auth/signup': '/api/auth/signup.ts',
    '/api/organizer/dashboard': '/api/organizer/dashboard.ts',
    '/api/organizer/events': '/api/organizer/events.ts',
    '/api/organizer/check-in': '/api/organizer/check-in.ts',
  };

  if (staticRoutes[pathname]) {
    return { modulePath: staticRoutes[pathname], query: {} };
  }

  const eventMatch = pathname.match(/^\/api\/events\/([^/]+)$/);
  if (eventMatch) {
    return {
      modulePath: '/api/events/[id].ts',
      query: { id: decodeURIComponent(eventMatch[1]) },
    };
  }

  return null;
}

const port = Number(process.env.PORT || 3000);

const vite = await createViteServer({
  server: {
    middlewareMode: true,
  },
  appType: 'spa',
});

const server = http.createServer(async (request, response) => {
  const parsedUrl = parseUrl(request.url || '/', true);
  const pathname = parsedUrl.pathname || '/';
  const route = matchApiRoute(pathname);

  if (route) {
    try {
      const mod = await vite.ssrLoadModule(route.modulePath);
      const handler = mod.default;

      request.query = {
        ...parsedUrl.query,
        ...route.query,
      };

      await handler(request, createResponse(response));
    } catch (error) {
      vite.ssrFixStacktrace(error);
      response.statusCode = 500;
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }));
    }
    return;
  }

  vite.middlewares(request, response, () => {
    response.statusCode = 404;
    response.end('Not found');
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Full stack dev server running at http://127.0.0.1:${port}`);
});
