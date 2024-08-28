import { CardBody, CardContainer, CardItem } from '@/components/global/3d-card';
import { ContainerScroll } from '@/components/global/container-scroll-animation';
import { LampComponent } from '@/components/global/lamp';
import Navbar from '@/components/global/navbar';
import { CheckIcon } from 'lucide-react';
import { Cover } from '@/components/ui/cover';
import { FeaturesSection } from '@/components/global/features';

const PLANS = [
  {
    title: 'Free',
    price: 0,
    features: ['3 Workflows', '2 step actions'],
  },
  {
    title: 'Pro',
    price: 149,
    features: ['Unlimited Workflows', 'Unlimited steps', 'Unlimited support'],
  },
  {
    title: 'Annual',
    price: 999,
    features: ['Unlimited Workflows', 'Unlimited steps', 'Unlimited support'],
  },
];

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col pb-20">
      <Navbar />
      <section className="h-screen w-full bg-white rounded-md !overflow-visible relative flex flex-col items-center antialiased">
        <div className="absolute inset-0  h-full w-full items-center px-5 py-24"></div>
        <div className="flex flex-col mt-[-100px] md:mt-[-50px]">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col">
                <h1 className="text-4xl md:text-8xl pb-12 bg-clip-text text-transparent bg-gradient-to-b text-black to-white from-black font-sans font-bold">
                  Build <Cover>Blazingly Fast</Cover> Workflows on Solana
                </h1>
              </div>
            }
          />
        </div>
      </section>
      <section className="w-full">
        <FeaturesSection />
      </section>
      <section className="w-full">
        <LampComponent />
        <div className="flex flex-wrap items-center justify-center flex-col md:flex-row gap-8 -mt-[400px]">
          {PLANS.map((plan) => (
            <CardContainer key={plan.title} className="inter-var">
              <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-background dark:border-white/[0.2] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white "
                >
                  {plan.title}
                  <h2 className="text-6xl ">${plan.price}</h2>
                </CardItem>
                <CardItem
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  <ul className="my-4 flex flex-col gap-2">
                    {plan.features.map((feature) => (
                      <li className="flex items-center gap-2" key={feature}>
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardItem>
                <div className="flex justify-between items-center mt-8">
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-background dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Get Started Now
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>
    </main>
  );
}
