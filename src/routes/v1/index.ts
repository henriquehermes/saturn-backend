import express from 'express';
import authRoute from './auth.route';
import adminRoute from './admin.route';
import userRoute from './user.route';
import uploadRoute from './upload.route';
import docsRoute from './docs.route';
import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/admin/users',
    route: adminRoute
  },
  {
    path: '/user',
    route: userRoute
  },
  {
    path: '/upload',
    route: uploadRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
