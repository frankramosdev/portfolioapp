'use client';

import PlaidLinkButton from "./components/PlaidLink";
import DashboardPreview from "./components/DashboardPreview";
import LoopMessageForm from "./components/LoopMessageForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 font-[family-name:var(--font-geist-sans)]">
      {/* Hero */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
          <div>
            <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
              Manage your <span className="text-blue-600 dark:text-blue-500">investments</span> with confidence
            </h1>
            <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">
              Connect your bank accounts, track your investments, and get insights into your financial portfolio all in one place.
            </p>

            {/* Buttons */}
            <div className="mt-7 grid gap-3 w-full sm:inline-flex">
              <PlaidLinkButton />
              <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="/dashboard">
                View Dashboard
              </a>
            </div>
            {/* End Buttons */}

            {/* Review */}
            <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
              {/* Review */}
              <div className="py-5">
                <div className="flex gap-x-1">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className="size-4 text-gray-800 dark:text-neutral-200" width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z" fill="currentColor"/>
                    </svg>
                  ))}
                </div>

                <p className="mt-3 text-sm text-gray-800 dark:text-neutral-200">
                  <span className="font-bold">4.8</span> /5 - from our users
                </p>

                <div className="mt-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    &ldquo;I can finally see all my investments in one place!&rdquo;
                  </p>
                </div>
              </div>
              {/* End Review */}

              {/* Review */}
              <div className="py-5">
                <div className="flex gap-x-1">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className="size-4 text-gray-800 dark:text-neutral-200" width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z" fill="currentColor"/>
                    </svg>
                  ))}
                </div>

                <p className="mt-3 text-sm text-gray-800 dark:text-neutral-200">
                  <span className="font-bold">4.9</span> /5 - secure & reliable
                </p>

                <div className="mt-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    &ldquo;Tracking my 401k and IRA has never been easier!&rdquo;
                  </p>
                </div>
              </div>
              {/* End Review */}
            </div>
            {/* End Review */}
          </div>
          {/* End Col */}

          <div className="relative ms-4">
            <div className="relative z-10 overflow-hidden rounded-md">
              <DashboardPreview />
            </div>
            <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0"></div>

            {/* SVG Pattern */}
            <div className="absolute bottom-0 start-0">
              <svg className="w-2/3 ms-auto h-auto text-white dark:text-neutral-900" width="630" height="451" viewBox="0 0 630 451" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="531" y="352" width="99" height="99" fill="currentColor"/>
                <rect x="140" y="352" width="106" height="99" fill="currentColor"/>
                <rect x="482" y="402" width="64" height="49" fill="currentColor"/>
                <rect x="433" y="402" width="63" height="49" fill="currentColor"/>
                <rect x="384" y="352" width="49" height="50" fill="currentColor"/>
                <rect x="531" y="328" width="50" height="50" fill="currentColor"/>
                <rect x="99" y="303" width="49" height="58" fill="currentColor"/>
                <rect x="99" y="352" width="49" height="50" fill="currentColor"/>
                <rect x="99" y="392" width="49" height="59" fill="currentColor"/>
                <rect x="44" y="402" width="66" height="49" fill="currentColor"/>
                <rect x="234" y="402" width="62" height="49" fill="currentColor"/>
                <rect x="334" y="303" width="50" height="49" fill="currentColor"/>
                <rect x="581" width="49" height="49" fill="currentColor"/>
                <rect x="581" width="49" height="64" fill="currentColor"/>
                <rect x="482" y="123" width="49" height="49" fill="currentColor"/>
                <rect x="507" y="124" width="49" height="24" fill="currentColor"/>
                <rect x="531" y="49" width="99" height="99" fill="currentColor"/>
              </svg>
            </div>
            {/* End SVG Pattern */}
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Hero */}

      <footer className="flex flex-col gap-6 items-center justify-center py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Connect with <span className="text-blue-600 dark:text-blue-500">LoopMessage</span>
          </h2>
          <LoopMessageForm />
        </div>
      </footer>
    </div>
  );
}
