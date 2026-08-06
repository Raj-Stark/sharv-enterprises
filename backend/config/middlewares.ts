import type { Core } from '@strapi/strapi';

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const frontendOrigins = env.array('FRONTEND_URLS', [
    'http://localhost:3000',
  ]);

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: frontendOrigins,
        credentials: false,
        methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeadersOnError: true,
      },
    },
    'strapi::query',
    {
      name: 'strapi::body',
      config: {
        jsonLimit: '1mb',
        formLimit: '100kb',
        textLimit: '100kb',
      },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
