import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { SITE } from '@/data/site'

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="August 2026"
      description="The terms that govern using the DESERV'D website and placing an order."
      path="/terms"
    >
      <p className="text-xs uppercase tracking-[0.08em] text-blush-600">
        Placeholder template — this is a frontend demo. No real orders, payments or accounts exist.
      </p>

      <LegalSection heading="Orders">
        <p>
          By placing an order you confirm the delivery details you provide are accurate. We reserve the
          right to limit or cancel quantities that appear to be placed in error.
        </p>
      </LegalSection>

      <LegalSection heading="Pricing">
        <p>
          Prices are listed in USD and may change without notice. The price shown at checkout is the
          price charged for that order.
        </p>
      </LegalSection>

      <LegalSection heading="Allergens">
        <p>
          Our kitchen handles milk, eggs, wheat, soy and tree nuts. Every product page lists known
          allergens for that flavour — please check before ordering if you have an allergy.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms can be sent to{' '}
          <a href={`mailto:${SITE.email}`} className="text-blush-600 underline underline-offset-2">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
