import { HeroParallax } from "@/components/global/connect-parallax"
import { ContainerScroll } from "@/components/global/container-scroll-animation"
import Navbar from "@/components/global/navbar"
import { CardContainer, CardBody, CardItem } from "@/components/global/3d-card"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/constant"
import { CheckIcon } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Connect your apps",
    body: "Link Google Drive, Discord, Slack, and Notion in a couple of clicks.",
  },
  {
    step: "02",
    title: "Drag to build",
    body: "Compose workflows visually on the canvas — triggers, actions, no code.",
  },
  {
    step: "03",
    title: "Let it run",
    body: "Flowly fires automatically the moment something happens. You do nothing.",
  },
]

const plans = [
  {
    name: "Hobby",
    price: "$0",
    cadence: "forever",
    description: "For trying things out and automating your personal tasks.",
    features: ["3 active workflows", "100 tasks per month", "Two-step actions"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    description: "For professionals running automations that actually matter.",
    features: [
      "Unlimited workflows",
      "10,000 tasks per month",
      "Multi-step actions",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Unlimited",
    price: "$99",
    cadence: "per month",
    description: "For teams that need scale, speed, and no limits.",
    features: [
      "Everything in Pro",
      "Unlimited tasks",
      "Advanced integrations",
      "Dedicated support",
    ],
    highlighted: false,
  },
]

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center bg-neutral-950">
      <Navbar />
      <section className="relative flex h-screen w-full flex-col items-center !overflow-visible rounded-md bg-neutral-950 antialiased">
        <div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>

        <div className="mt-[-100px] flex flex-col md:mt-[-50px]">
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center">
                <Button
                  size={"lg"}
                  className="group mb-8 flex w-full items-center justify-center gap-4 rounded-full border-t-2 border-[#4D4D4D] bg-[#1F1F1F] p-8 text-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-neutral-500 sm:w-fit md:mb-0"
                >
                  <span className="goup-hover:to-black bg-gradient-to-r from-neutral-500 to-neutral-600 bg-clip-text font-sans text-transparent group-hover:bg-gradient-to-r group-hover:from-black md:text-center">
                    Start For Free Today
                  </span>
                </Button>
                <h1 className="bg-gradient-to-b from-white to-neutral-600 bg-clip-text font-sans text-5xl font-bold text-transparent md:text-8xl">
                  Automate Your Work With Flowly
                </h1>
                <p className="mt-6 max-w-xl text-center text-base text-neutral-400 md:text-lg">
                  Connect your favorite apps and let Flowly handle the
                  repetitive work — no code, just flows.
                </p>
              </div>
            }
          />
        </div>
      </section>

      <section className="bg-neutral-950">
        <HeroParallax products={products}></HeroParallax>
      </section>

      {/* How it works */}
      <section className="w-full bg-neutral-950 py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 flex flex-col items-center text-center">
            <span className="mb-4 text-sm font-medium tracking-widest text-neutral-500 uppercase">
              How it works
            </span>
            <h2 className="max-w-2xl bg-gradient-to-b from-white to-neutral-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Build once, run on autopilot
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="group bg-neutral-950 p-8 transition-colors hover:bg-neutral-900"
              >
                <span className="text-sm font-medium text-neutral-600">
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full bg-neutral-950 pb-32">
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center px-6 text-center">
          <h2 className="bg-gradient-to-b from-white to-neutral-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-neutral-400">
            Start free. Upgrade when your automations outgrow you.
          </p>
        </div>

        <div className="flex flex-col flex-wrap items-center justify-center gap-8 md:flex-row md:items-stretch">
          {plans.map((plan) => (
            <CardContainer key={plan.name} className="inter-var">
              <CardBody
                className={`group/card relative h-auto w-full rounded-2xl border bg-black p-6 md:!w-[340px] ${
                  plan.highlighted
                    ? "border-white/60 shadow-2xl shadow-white/10"
                    : "border-white/[0.15] hover:border-white/30"
                }`}
              >
                {plan.highlighted && (
                  <CardItem
                    translateZ="40"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-white px-3 py-1 text-xs font-medium text-black"
                  >
                    Most Popular
                  </CardItem>
                )}

                <CardItem
                  translateZ="50"
                  className="text-lg font-semibold text-white"
                >
                  {plan.name}
                </CardItem>

                <CardItem
                  translateZ="60"
                  as="div"
                  className="mt-2 flex items-end gap-2"
                >
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-neutral-500">
                    {plan.cadence}
                  </span>
                </CardItem>

                <CardItem
                  translateZ="50"
                  as="p"
                  className="mt-3 max-w-sm text-sm text-neutral-400"
                >
                  {plan.description}
                </CardItem>

                <CardItem translateZ="60" as="div" className="w-full">
                  <ul className="my-6 flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-neutral-300"
                      >
                        <CheckIcon className="h-4 w-4 text-white" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardItem>

                <CardItem
                  translateZ={20}
                  as="button"
                  className={`mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  Get Started
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>
    </main>
  )
}
