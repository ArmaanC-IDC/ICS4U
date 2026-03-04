import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded views (best practice for bigger apps)
const HomeView = () => import('../views/HomeView.vue')
const ProductsView = () => import('../views/ProductsView.vue')
const ProductDetailsView = () => import('../views/ProductDetailsView.vue')
const CartView = () => import('../views/CartView.vue')
const CheckoutView = () => import('../views/CheckoutView.vue')
const ReviewsView = () => import('../views/ReviewsView.vue')
const AboutView = () => import('../views/AboutView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const SignInView = () => import('../views/SignInView.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { pageTitle: "Home" } },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      meta: { pageTitle: "Products" } // example meta
    },
    {
      path: '/products/:id',
      name: 'product-details',
      component: ProductDetailsView,
      props: true,
      meta: { pageTitle: "Product Details" }
    },
    { path: '/cart', name: 'cart', component: CartView, meta: { pageTitle: "Cart" } },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { requiresNonEmptyCart: true, requiresSignIn: true, pageTitle: "Checkout" },
    },
    { path: '/reviews', name: 'reviews', component: ReviewsView, meta: { pageTitle: "Reviews" } },
    { path: '/about', name: 'about', component: AboutView, meta: { pageTitle: "About" } },
    { path: '/signIn', name: 'signIn', component: SignInView, meta: { pageTitle: "Sign In"}},

    // 404 (must be last)
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ],
  scrollBehavior() {
    // Always scroll to top on route change
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  if (to.meta.requiresNonEmptyCart) {
    const count = Number(localStorage.getItem('cartCount') || '0')
    if (count <= 0) {
      return { name: 'cart' } // redirect
    }
  }

  if (to.meta.requiresSignIn) {
    if (!localStorage.getItem("username")) {
      return { name: "signIn" }
    }
  }
  return true;
});

router.afterEach((to) => {
  if (to.meta.pageTitle){
    document.title = to.meta.pageTitle;
  }
})


export default router
