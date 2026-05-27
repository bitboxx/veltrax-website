import { useState } from 'react'
import { ElDialog, ElDialogPanel } from '@tailwindplus/elements/react'
import { Button } from '@/components/elements/button'
import { CheckmarkIcon } from '@/components/icons/checkmark-icon'
import { useMailerForm } from '@/components/hooks/useMailerForm'

type FormState = {
  fullName: string
  workEmail: string
  company: string
  feedback: string
}

const initialState: FormState = {
  fullName: '',
  workEmail: '',
  company: '',
  feedback: '',
}

export default function FeedbackModal() {
  const [formState, setFormState] = useState<FormState>(initialState)
  const { sending, sent, error, submit } = useMailerForm()

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault()
    await submit({
      name: formState.fullName,
      email: formState.workEmail,
      company: formState.company || undefined,
      message: formState.feedback,
    })
  }

  return (
    <ElDialog>
      <dialog id="feedback-modal" className="backdrop:bg-mist-950/40">
        <ElDialogPanel className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex min-h-full max-w-5xl items-center justify-center">
            <div className="grid w-full overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-2xl lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div className="bg-mist-950 p-6 text-white sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm/6 font-semibold uppercase tracking-[0.16em] text-mist-300">Share feedback</p>
                    <h2 className="mt-2 font-display text-3xl/9 font-medium tracking-tight">
                      Tell us what feels strong, unclear, or missing
                    </h2>
                  </div>
                  <button
                    type="button"
                    command="close"
                    commandfor="feedback-modal"
                    aria-label="Close feedback modal"
                    className="inline-flex rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mt-5 text-base/7 text-mist-300">
                  We welcome feedback of any kind. If something works well, feels unclear, or seems to be missing, we
                  would genuinely like to hear it.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    'Share what we do right',
                    'Point out what feels weak, unclear, or missing',
                    'Tell us what you were hoping to find and we will try to build it next',
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
                      <span className="text-sm/6 font-medium text-mist-950">Email</span>
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
                    <span className="text-sm/6 font-medium text-mist-950">Company (optional)</span>
                    <input
                      value={formState.company}
                      onChange={(event) => updateField('company', event.target.value)}
                      className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                      placeholder="European Bank"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm/6 font-medium text-mist-950">Your feedback</span>
                    <textarea
                      required
                      rows={6}
                      value={formState.feedback}
                      onChange={(event) => updateField('feedback', event.target.value)}
                      className="rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm/6 text-mist-950 outline-none transition focus:border-mist-400"
                      placeholder="Tell us what feels strong, what feels weak, what seems missing, or anything else you think we should know"
                    />
                  </label>

                  <div className="rounded-2xl border border-mist-200 bg-mist-50 p-4 text-base/7 text-mist-700">
                    We read feedback carefully and use it to improve. Thank you for taking the time to share it.
                  </div>

                  {sent ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-base/7 text-emerald-800">
                      Thank you for your feedback! We read every submission carefully.
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
                        {sending ? 'Sending\u2026' : 'Send feedback'}
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
