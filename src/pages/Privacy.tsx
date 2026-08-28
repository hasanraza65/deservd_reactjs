import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { SITE } from '@/data/site'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 2026"
      description="How DESERV'D handles the information you share with us."
      path="/privacy"
    >
      <p className="text-xs uppercase tracking-[0.08em] text-blush-600">
        Placeholder template — this is a frontend demo with no real data collection.
      </p>

      <LegalSection heading="Information we collect">
        <p>
          When you place an order or contact us, we collect the details you provide — name, email,
          delivery address and phone number — solely to fulfil and communicate about your order.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          Order information is used to bake, package and ship your cookies, and to send order updates.
          We do not sell customer information to third parties.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies & local storage">
        <p>
          This site uses browser local storage to remember your cart between visits. No tracking cookies
          are set in this demo build.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can request a copy of the information we hold about you, or ask us to delete it, at{' '}
          <a href={`mailto:${SITE.email}`} className="text-blush-600 underline underline-offset-2">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
