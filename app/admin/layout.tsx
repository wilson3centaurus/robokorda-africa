import { redirect } from 'next/navigation';

// The robokorda.africa admin has been moved to the RoboCore admin dashboard.
// Any visit to /admin/* is redirected to the homepage.
export default function AdminLayout() {
  redirect('/');
}

