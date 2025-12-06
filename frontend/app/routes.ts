import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("user", "./components/user.tsx"),
  route("admin", "./components/admin.tsx"),
  route("reviews", "./components/reviews.tsx"),
] satisfies RouteConfig;