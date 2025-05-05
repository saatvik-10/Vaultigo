import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardContent from '@/components/DashboardContent';
import Navbar from '@/components/Navbar';

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  // Serialize the user data to avoid passing the Clerk User object directly
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <div className='min-h-screen flex flex-col bg-slate-50'>
      <Navbar user={serializedUser} />

      <main className='flex-1 container mx-auto py-8 px-6'>
        <DashboardContent
          userId={userId}
          userName={
            user?.firstName ||
            user?.fullName ||
            user?.emailAddresses?.[0]?.emailAddress ||
            ''
          }
        />
      </main>

      <footer
        className='bg-slate-50 border-t py-6'
        style={{ borderColor: '#2D71C9' }}
      >
        <div className='container mx-auto px-6'>
          <div className='flex flex-col md:flex-row justify-center items-center'>
            <p className='text-default-500 text-sm'>
              &copy; {new Date().getFullYear()} Vaultigo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
