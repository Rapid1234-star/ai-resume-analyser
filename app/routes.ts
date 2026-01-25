import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/auth.tsx"),
    route("/dashboard", "routes/home.tsx"),
    route("/upload", "routes/upload.tsx"),
    route("/resume/:id", "routes/resume.tsx"),
    route("/wipe", "routes/wipe.tsx"),
    route("/hero", "routes/+hero.tsx"),
] satisfies RouteConfig;
