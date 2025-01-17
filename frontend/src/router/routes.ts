export const routes = [
  // ----------------------------------------------------------------
  // ORDERS
  // ----------------------------------------------------------------
  {
    path: "/orders",
    component: () => import("@/views/Orders/ListOrders.vue"),
  },
  {
    path: "/orders/create",
    name: "createOrder",
    component: () => import("@/views/Orders/CreateOrder.vue"),
  },
  {
    path: "/orders/addInvoice",
    name: "addInvoice",
    component: () => import("@/views/Orders/CreateInvoice.vue"),
  },
  {
    path: "/orders/complete",
    component: () => import("@/views/Orders/CompleteOrder.vue"),
  },
  {
    path: "/orders/plan",
    component: () => import("@/views/Orders/PlanOrder.vue"),
  },
  {
    path: "/orders/:id",
    name: "singleOrder",
    component: () => import("@/views/Orders/SingleOrder.vue"),
  },
  //------------------------------------------------------------------
  //Dashboard
  //------------------------------------------------------------------
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    component: () => import("@/views/Dashboard.vue"),
  },
  //------------------------------------------------------------------
  //Timeout
  //------------------------------------------------------------------
  {
    path: "/timeout",
    component: () => import("@/views/Timeout.vue"),
  },
  //------------------------------------------------------------------
  //404
  //------------------------------------------------------------------
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
  },
  {
    path: "/invoices",
    name: "Invoices",
    component: () => import("@/views/Invoices/ListInvoices.vue"),
  },
  {
    path: "/invoices/:AufNr/:KunNr",
    name: "Invoice",
    component: () => import("@/views/Invoices/SingeInvoice.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/Settings.vue"),
  },
  {
    path: "/loading",
    name: "Loading",
    component: () => import("@/views/Startup/Load.vue"),
  },
  //------------------------------------------------------------------
  //Masterdata
  //------------------------------------------------------------------
  {
    path: "/startup",
    name: "startup",
    component: () => import("@/views/Startup/Start.vue"),
  },
  {
    path: "/startup/1",
    name: "startup1",
    component: () => import("@/views/Startup/Config.vue"),
  },
  // {
  //   path: "/masterdata/:entity/:id?",
  //   component: () => import("@/views/MasterData.vue"),
  // },
];
