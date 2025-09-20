import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  },
  port: 5173,
})

console.log("🚀 Server running at http://localhost:5173")
