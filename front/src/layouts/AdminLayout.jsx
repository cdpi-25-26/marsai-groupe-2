import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div>
      <div>Navbar</div>
      <aside>Sidebar</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
