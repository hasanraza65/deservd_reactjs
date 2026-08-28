import { useState } from 'react'
import type { FormEvent } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Field, TextAreaField } from '@/components/ui/Field'
import { IconCheck, IconMail, IconPhone } from '@/components/ui/Icon'
import { SITE } from '@/data/site'
import { useSeo } from '@/lib/seo'

type FormState = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (form.message.trim().length < 10) errors.message = 'Tell us a little more (at least 10 characters).'
  return errors
}

export default function Contact() {
  useSeo({
    title: 'Contact Us',
    description: "Get in touch with DESERV'D about orders, wholesale enquiries and collaborations.",
    path: '/contact',
  })

  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSent(true)
  }

  return (
    <section className="bg-cream-200 py-14 sm:py-20">
      <Container size="narrow">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Say Hello"
            title="Contact Us"
            subtitle="Questions about an order, wholesale or a collaboration? We read everything."
          />
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-10 rounded-lg border border-cocoa-900/12 bg-cream-50 p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush-500">
                  <IconCheck className="h-6 w-6 text-white" />
                </span>
                <p className="font-display text-lg font-extrabold uppercase text-cocoa-900">
                  Message sent.
                </p>
                <p className="max-w-sm text-sm text-cocoa-600">
                  Thanks for reaching out — we typically reply within 1 business day.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', email: '', message: '' })
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <Field
                  label="Name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors.name}
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  error={errors.email}
                />
                <TextAreaField
                  label="Message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  error={errors.message}
                />
                <Button type="submit" size="lg" className="self-start">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-8">
            {SITE.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 text-sm font-medium text-cocoa-700 transition-colors hover:text-blush-600"
              >
                <IconPhone className="h-4.5 w-4.5 text-blush-500" />
                {phone}
              </a>
            ))}
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-2 text-sm font-medium text-cocoa-700 transition-colors hover:text-blush-600"
            >
              <IconMail className="h-4.5 w-4.5 text-blush-500" />
              {SITE.email}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
