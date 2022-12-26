import HomePage from '../pages/home.vue';
import Dashboard from '../pages/dashboard.vue';
import RequestAndLoad from '../pages/request-and-load.vue';

function checkAuth({ to, from, resolve, reject }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (['Register', 'Login', 'Home'].includes(to.name) && token && user) {
    reject();
    this.navigate('/dashboard/');
  } else if (!['Register', 'Login', 'Home'].includes(to.name) && (!token || !user)) {
    reject();
    this.navigate('/login/');
  } else {
    resolve();
  }
}

const routes = [
  {
    path: '/',
    async({ resolve }) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        resolve({
          name: 'Dashboard',
          component: Dashboard
        })
      } else {
        resolve({
          name: "Home",
          component: HomePage,
        })
      }
    }
  },
  {
    path: '/home',
    name: "Home",
    component: HomePage,
    beforeEnter: checkAuth,
  },
  {
    path: '/login/',
    name: 'Login',
    asyncComponent: () => import('../pages/login.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/register/',
    name: 'Register',
    asyncComponent: () => import('../pages/register.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/dashboard/',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: checkAuth,
  },
  {
    path: '/categories/',
    name: 'Categories',
    asyncComponent: () => import('../pages/categories.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/categories/:categoryID/questions',
    name: 'Question',
    asyncComponent: () => import('../pages/question.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/profile/',
    name: 'Profile',
    asyncComponent: () => import('../pages/profile.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/my-stats/',
    name: 'MyStats',
    asyncComponent: () => import('../pages/my-stats.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/top-lists/',
    name: 'TopLists',
    asyncComponent: () => import('../pages/top-lists.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/top-list/:filterName/list',
    name: 'TopList',
    asyncComponent: () => import('../pages/top-list.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings/',
    name: 'Settings',
    asyncComponent: () => import('../pages/settings.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings/terms',
    name: 'Terms of services',
    asyncComponent: () => import('../pages/terms.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings/privacy',
    name: 'Privacy',
    asyncComponent: () => import('../pages/privacy.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings/imprint',
    name: 'Imprint',
    asyncComponent: () => import('../pages/imprint.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings/licenses',
    name: 'Licenses',
    asyncComponent: () => import('../pages/licenses.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings/release-notes',
    name: 'Release notes',
    asyncComponent: () => import('../pages/release-notes.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings/feedback',
    name: 'Write a review',
    asyncComponent: () => import('../pages/feedback.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/start/',
    asyncComponent: () => import('../pages/start.vue'),
  },
  {
    path: '/about/',
    asyncComponent: () => import('../pages/about.vue'),
  },
  {
    path: '/form/',
    asyncComponent: () => import('../pages/form.vue'),
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    asyncComponent: () => import('../pages/dynamic-route.vue'),
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      const app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      const userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        const user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    asyncComponent: () => import('../pages/not-found.vue'),
  },
];

export default routes;
