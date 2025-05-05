import { Button } from '@heroui/button';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { Card, CardBody } from '@heroui/card';
import {
  CloudUpload,
  Shield,
  Folder,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-slate-50'>
      {/* Use the unified Navbar component */}
      <Navbar />

      {/* Main content */}
      <main className='flex-1'>
        {/* Hero section */}
        <section className='py-12 md:py-20 px-4 md:px-6'>
          <div className='container mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
              <div className='space-y-6 text-center lg:text-left'>
                <div>
                  <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue leading-tight'>
                    Store your <span className='text-pink'>images</span> with
                    ease
                  </h1>
                  <p className='text-lg md:text-xl text-pink'>
                    Simple. Secure. Fast.
                  </p>
                </div>

                <div className='flex flex-wrap gap-4 pt-4 justify-center lg:justify-start'>
                  <SignedOut>
                    <Link href='/sign-up'>
                      <Button size='lg' className='bg-pink'>
                        Get Started
                      </Button>
                    </Link>
                    <Link href='/sign-in'>
                      <Button size='lg' className='bg-blue'>
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href='/dashboard'>
                      <Button
                        size='lg'
                        className='bg-pink'
                        endContent={<ArrowRight className='h-4 w-4' />}
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>

              <div className='flex justify-center order-first lg:order-last'>
                <div className='relative w-64 h-64 md:w-80 md:h-80'>
                  <div className='absolute inset-0 bg-pink/20 rounded-full blur-3xl'></div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <ImageIcon className='h-24 md:h-32 w-24 md:w-32 text-pink/90' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className='py-12 md:py-16 px-4 md:px-6 bg-slate-50'>
          <div className='container mx-auto'>
            <div className='text-center mb-8 md:mb-12'>
              <h2 className='text-2xl md:text-3xl font-bold mb-4 text-blue'>
                What You Get
              </h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8'>
              <Card className='border border-pink bg-slate-50 shadow-sm hover:shadow-md transition-shadow'>
                <CardBody className='p-6 text-center'>
                  <CloudUpload className='h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-blue' />
                  <h3 className='text-lg md:text-xl font-semibold mb-2 text-blue'>
                    Quick Uploads
                  </h3>
                  <p className='text-pink'>Drag, drop, done.</p>
                </CardBody>
              </Card>

              <Card className='border border-pink bg-slate-50 shadow-sm hover:shadow-md transition-shadow'>
                <CardBody className='p-6 text-center'>
                  <Folder className='h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-blue' />
                  <h3 className='text-lg md:text-xl font-semibold mb-2 text-blue'>
                    Smart Organization
                  </h3>
                  <p className='text-pink'>
                    Keep it tidy, find it fast.
                  </p>
                </CardBody>
              </Card>

              <Card className='border border-pink bg-slate-50 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-md sm:max-w-full'>
                <CardBody className='p-6 text-center'>
                  <Shield className='h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-blue' />
                  <h3 className='text-lg md:text-xl font-semibold mb-2 text-blue'>
                    Locked Down
                  </h3>
                  <p className='text-pink'>
                    Your images, your eyes only.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className='py-12 md:py-20 px-4 md:px-6 bg-slate-50'>
          <div className='container mx-auto text-center'>
            <h2 className='text-2xl md:text-3xl font-bold mb-4 text-blue'>
              Ready?
            </h2>
            <SignedOut>
              <div className='flex flex-wrap justify-center gap-4 mt-8'>
                <Link href='/sign-up'>
                  <Button
                    size='lg'
                    className='bg-pink'
                    endContent={<ArrowRight className='h-4 w-4' />}
                  >
                    Let's Go
                  </Button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href='/dashboard'>
                <Button
                  size='lg'
                  className='bg-pink'
                  endContent={<ArrowRight className='h-4 w-4' />}
                >
                  Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Simple footer */}
      <footer className='bg-slate-50 border-t py-4 md:py-6' style={{borderColor: '#2D71C9'}}>
        <div className='container mx-auto px-4 md:px-6'>
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
