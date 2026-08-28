import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { SITE } from '@/data/site'

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Returns & Refunds"
      updated="August 2026"
      description="DESERV'D's returns and refund policy for damaged, incorrect or unsatisfactory orders."
      path="/refund-policy"
    >
      <LegalSection heading="Freshly baked, made to order">
        <p>
          Because every cookie is baked fresh for your order, we cannot accept returns of opened food
          products. We stand behind quality — if something is wrong, we want to know.
        </p>
      </LegalSection>

      <LegalSection heading="Damaged or incorrect orders">
        <p>
          If your order arrives damaged, incomplete or different from what you ordered, email{' '}
          <a href={`mailto:${SITE.email}`} className="text-blush-600 underline underline-offset-2">
            {SITE.email}
          </a>{' '}
          with your order number and a photo within 48 hours of delivery. We will send a replacement or
          issue a refund to your original payment method.
        </p>
      </LegalSection>

      <LegalSection heading="Not satisfied with a flavour?">
        <p>
          Let us know within 7 days of delivery. We would rather adjust your next box than have you eat
          something you didn't love.
        </p>
      </LegalSection>

      <LegalSection heading="Cancellations">
        <p>
          Orders can be cancelled free of charge before they enter baking (usually within 2 hours of
          placing the order). Once baking has started, the order cannot be cancelled.
        </p>
      </LegalSection>

      <p className="text-xs text-cocoa-500">
        This is a frontend demo — no real refunds are processed, and this policy is a placeholder pending
        legal review.
      </p>
    </LegalPage>
  )
}
