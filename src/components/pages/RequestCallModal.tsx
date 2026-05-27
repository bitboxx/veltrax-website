import { useState } from 'react'
import { ElDialog, ElDialogPanel } from '@tailwindplus/elements/react'
import { Button } from '@/components/elements/button'
import { CheckmarkIcon } from '@/components/icons/checkmark-icon'
import { useMailerForm } from '@/components/hooks/useMailerForm'

type FormState = {
  fullName: string
  workEmail: string
  company: string
  phoneCountryCode: string
  phoneNumber: string
  message: string
  timing: string
}

const initialState: FormState = {
  fullName: '',
  workEmail: '',
  company: '',
  phoneCountryCode: '+31',
  phoneNumber: '',
  message: '',
  timing: 'Today',
}

export default function RequestCallModal() {
  const [formState, setFormState] = useState<FormState>(initialState)
  const { sending, sent, error, submit } = useMailerForm()

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault()
    const phone = formState.phoneNumber
      ? `${formState.phoneCountryCode} ${formState.phoneNumber}`
      : undefined
    const message = [
      'Request call enquiry',
      '',
      `Preferred timing: ${formState.timing}`,
      '',
      'Question or context:',
      formState.message,
    ].join('\n')

    await submit({
      name: formState.fullName,
      email: formState.workEmail,
      company: formState.company,
      phone,
      message,
    })
  }

  return (
    <ElDialog>
      <dialog id="request-call-modal" className="backdrop:bg-mist-950/40">
        <ElDialogPanel className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex min-h-full max-w-5xl items-center justify-center">
            <div className="grid w-full overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-2xl lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div className="bg-mist-950 p-6 text-white sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm/6 font-semibold uppercase tracking-[0.16em] text-mist-300">Request a call</p>
                    <h2 className="mt-2 font-display text-3xl/9 font-medium tracking-tight">
                      Speak with the DecAltra team
                    </h2>
                  </div>
                  <button
                    type="button"
                    command="close"
                    commandfor="request-call-modal"
                    aria-label="Close request a call modal"
                    className="inline-flex rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mt-5 text-base/7 text-mist-300">
                  If you want to learn more, ask a question, or reach out as an existing client, this is the easiest
                  way to request a call with the DecAltra team.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    'Suitable for questions, introductions, and client follow-up',
                    'Short and low-pressure - no demo commitment required',
                    'We will make sure it reaches the right person',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-base/7 text-mist-200">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/10">
                        <CheckmarkIcon className="size-3" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm/6 font-medium text-mist-950">Full name</span>
                      <input
                        required
                        value={formState.fullName}
                        onChange={(event) => updateField('fullName', event.target.value)}
                        className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                        placeholder="Jane Smith"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm/6 font-medium text-mist-950">Work email</span>
                      <input
                        required
                        type="email"
                        value={formState.workEmail}
                        onChange={(event) => updateField('workEmail', event.target.value)}
                        className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                        placeholder="jane@institution.eu"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm/6 font-medium text-mist-950">Company</span>
                    <input
                      required
                      value={formState.company}
                      onChange={(event) => updateField('company', event.target.value)}
                      className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                      placeholder="European Bank"
                    />
                  </label>

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-sm/6 font-medium text-mist-950">Phone number (optional)</span>
                    <div className="grid gap-3 sm:grid-cols-[14rem_minmax(0,0.85fr)]">
                      <select
                        value={formState.phoneCountryCode}
                        onChange={(event) => updateField('phoneCountryCode', event.target.value)}
                        className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                      >
                        <option value="+31">Netherlands (+31)</option>
                        <option value="+32">Belgium (+32)</option>
                        <option value="+33">France (+33)</option>
                        <option value="+34">Spain (+34)</option>
                        <option value="+39">Italy (+39)</option>
                        <option value="+41">Switzerland (+41)</option>
                        <option value="+44">United Kingdom (+44)</option>
                        <option value="+49">Germany (+49)</option>
                        <option value="+352">Luxembourg (+352)</option>
                        <option value="+353">Ireland (+353)</option>
                        <option value="+45">Denmark (+45)</option>
                        <option value="+46">Sweden (+46)</option>
                        <option value="+47">Norway (+47)</option>
                        <option value="+358">Finland (+358)</option>
                        <option value="+1">United States (+1)</option>
                        <option value="+Other">Other</option>
                      </select>
                      <input
                        type="tel"
                        value={formState.phoneNumber}
                        onChange={(event) => updateField('phoneNumber', event.target.value)}
                        className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                        placeholder="6 12345678"
                      />
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm/6 font-medium text-mist-950">What would you like to discuss?</span>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(event) => updateField('message', event.target.value)}
                      className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                      placeholder="For example: I would like to learn more about the solution, ask a specific question, or reach out as an existing client"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm/6 font-medium text-mist-950">When would you prefer to have the call?</span>
                    <select
                      value={formState.timing}
                      onChange={(event) => updateField('timing', event.target.value)}
                      className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This week</option>
                      <option>Next week</option>
                    </select>
                  </label>

                  <div className="rounded-2xl border border-mist-200 bg-mist-50 p-4 text-base/7 text-mist-700">
                    We&apos;ll use this only to arrange the right follow-up. No mailing list, no pressure.
                  </div>

                  {sent ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-base/7 text-emerald-800">
                      Thank you! Your call request has been received. We&apos;ll be in touch soon.
                    </div>
                  ) : null}

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-base/7 text-red-800">
                      Something went wrong. Please try again or email us at <strong>info@DecAltra.com</strong>.
                    </div>
                  ) : null}

                  {!sent ? (
                    <div className="flex">
                      <Button size="lg" type="submit" disabled={sending}>
                        {sending ? 'Sending\u2026' : 'Request my call'}
                      </Button>
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </ElDialogPanel>
      </dialog>
    </ElDialog>
  )
}
