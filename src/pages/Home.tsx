import { Hero } from '@/sections/home/Hero'
import { CookieCollection } from '@/sections/home/CookieCollection'
import { WhyDeservd } from '@/sections/home/WhyDeservd'
import { Ingredients } from '@/sections/home/Ingredients'
import { StoryTeaser } from '@/sections/home/StoryTeaser'
import { BakedFresh } from '@/sections/home/BakedFresh'
import { SocialProof } from '@/sections/home/SocialProof'
import { InstagramGrid } from '@/sections/home/InstagramGrid'
import { SITE } from '@/data/site'
import { organizationSchema, useSeo } from '@/lib/seo'

export default function Home() {
  useSeo({
    title: 'Premium Protein Cookies',
    description: SITE.description,
    path: '/',
    jsonLd: organizationSchema,
  })

  return (
    <>
      <Hero />
      <CookieCollection />
      <WhyDeservd />
      <Ingredients />
      <StoryTeaser />
      <BakedFresh />
      <SocialProof />
      <InstagramGrid />
    </>
  )
}
