import HomePage from '../pages/home.vue';
import LoginPage from '../pages/login.vue';
import RegisterPage from '../pages/register.vue';
import DashboardPage from '../pages/dashboard.vue';
import CategoriesPage from '../pages/categories.vue';
import Question from '../pages/question.vue';
import Home1Page from '../pages/home1.vue';
import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';

import DynamicRoutePage from '../pages/dynamic-route.vue';
import RequestAndLoad from '../pages/request-and-load.vue';
import NotFoundPage from '../pages/404.vue';

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

var routes = [
  {
    path: '/',
    async({ resolve }) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        resolve({
          name: 'Dashboard',
          component: DashboardPage,
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
    component: LoginPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/register/',
    name: 'Register',
    component: RegisterPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/dashboard/',
    name: 'Dashboard',
    component: DashboardPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/categories/',
    name: 'Categories',
    component: CategoriesPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/categories/:categoryID/questions',
    name: 'Question',
    component: Question,
    beforeEnter: checkAuth,
  },
  {
    path: '/home1',
    component: Home1Page,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },


  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
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
    component: NotFoundPage,
  },
];

export default routes;
