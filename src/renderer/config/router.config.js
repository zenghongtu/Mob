const pageArr = [
  { name: "find", icon: "global", routes: ["recommend", "rank", "category"] },
  {
    name: "my",
    icon: "user",
    routes: ["subscribed", "listened", "bought", "like"],
  },
  // "local",
  // "download",
  // "history",
];

const routes = pageArr.map(route => {
  if (typeof route === "object") {
    const { name, icon, routes: subRoutes } = route;
    const newRoute = {
      path: `/${name}`,
      name,
      icon,
      routes: subRoutes.map(subRoute => {
        const subComponent = subRoute[0].toUpperCase() + subRoute.slice(1);
        return {
          path: `/${name}/${subRoute}`,
          name: subRoute,
          component: `./${subComponent}`,
        };
      }),
    };
    if (name === "my") {
      newRoute.component = "../layouts/MyLayout";
    }
    return newRoute;
  }
  const component = route[0].toUpperCase() + route.slice(1);
  return {
    path: `/${route}`,
    name: route,
    component: `./${component}`,
  };
});
routes.unshift({ path: "/", redirect: "/find/recommend" });

routes.push(
  {
    path: "/login",
    component: "./Login",
  },
  {
    path: "/setting",
    component: "./Setting",
  },
  {
    path: "/search/:kw",
    component: "./SearchResult",
  },
  {
    path: "/category/:cat/:subCat",
    component: "./CategoryDetail",
  },
  {
    path: "/:category/:id",
    component: "./AlbumDetail",
  },
);

export default [
  {
    path: "/",
    component: "../layouts/BasicLayout",
    routes,
  },
];
