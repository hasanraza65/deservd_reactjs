import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { SITE } from '@/data/site'
import { formatPrice } from '@/lib/money'
import { usePublicSettings } from '@/hooks/useCatalog'

export default function Shipping() {
  const { data: settings } = usePublicSettings()
  const freeShippingThreshold = (settings?.free_shipping_threshold_cents ?? SITE.freeShippingThreshold * 100) / 100

  return (
    <LegalPage
      title="Shipping & Delivery"
      updated="August 2026"
      description="How DESERV'D ships and delivers cookies — processing times, rates and local pickup."
      path="/shipping"
    >
      <LegalSection heading="Processing time">
        <p>
          Every cookie is baked to order in small batches. Orders placed by 2pm local time are typically
          baked and packed within 1–2 business days. During high-demand periods (holidays, restocks) this
          may extend slightly — we will always show current lead time at checkout.
        </p>
      </LegalSection>

      <LegalSection heading="Shipping rates">
        <p>
          Standard shipping is a flat $6.99 and typically arrives in 3–5 business days. Orders over{' '}
          {formatPrice(freeShippingThreshold)} ship free, automatically applied at checkout.
        </p>
      </LegalSection>

      <LegalSection heading="Local pickup">
        <p>
          Miami-area customers can select Local Pickup at checkout for same-day collection once an order
          is baked, at no charge. You will receive a notification when your order is ready.
        </p>
      </LegalSection>

      <LegalSection heading="Packaging">
        <p>
          Cookies ship in insulated, resealable packaging designed to keep them soft in transit. If
          anything arrives damaged, contact us at{' '}
          <a href={`mailto:${SITE.email}`} className="text-blush-600 underline underline-offset-2">
            {SITE.email}
          </a>{' '}
          within 48 hours of delivery and we will make it right.
        </p>
      </LegalSection>

      <p className="text-xs text-cocoa-500">
        This is a frontend demo — no real orders are shipped, and figures above are placeholders pending
        final confirmation.
      </p>
    </LegalPage>
  )
}
