import { CheckCircle, ShieldCheck, Star } from 'lucide-react';

const features = [
  {
    name: 'Verified and Authentic Art',
    description: 'Every piece of art is verified for authenticity by our team of experts, ensuring you are investing in genuine works.',
    icon: <ShieldCheck className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Exclusive Collections',
    description: 'Gain access to exclusive collections from world-renowned artists and rising stars in the digital art world.',
    icon: <Star className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Seamless Bidding Experience',
    description: 'Our intuitive platform provides a smooth and transparent bidding process from the first bid to the final sale.',
    icon: <CheckCircle className="w-12 h-12 text-primary" />,
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Why Choose Artsyl?
          </h2>
          <p className="mt-6 text-base leading-8 text-gray-600 dark:text-gray-300">
            We are dedicated to providing a premier experience for art collectors and enthusiasts.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center">
              <div className="p-4 bg-secondary bg-opacity-20 rounded-full">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-text">{feature.name}</h3>
              <p className="mt-4 text-base text-text opacity-70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
