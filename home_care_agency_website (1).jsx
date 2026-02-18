import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Heart, PhoneCall, ShieldCheck, Users } from "lucide-react";

// NOTE: The intake form will show "Form not found" if FORMSPREE_ENDPOINT is not the exact endpoint for your form.

// --- Config (easy to reuse + test) ---
export const BUSINESS_NAME = "Deddeh & Tyler Homecare";
export const PHONE_TEL = "+12536914318";
export const DISPLAY_PHONE = "(253) 691-4318";
export const INTAKE_EMAIL = "deddeh@deddehtylerhomecare.com";

// Paste your Formspree endpoint here (from the form's "Integration" / "Endpoint" / "Copy code")
// It must look like: https://formspree.io/f/abcd1234
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvnlrwq";

// Set to true ONLY if your agency is licensed/authorized to provide skilled clinical services.
// If false, the site uses more compliant non-medical wording (care coordination + support).
export const SKILLED_CLINICAL_SERVICES = false as const;

// --- Lightweight tests (only run when NODE_ENV === 'test') ---
function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

if (process.env.NODE_ENV === "test") {
  assert(BUSINESS_NAME.length > 0, "BUSINESS_NAME should not be empty");
  assert(PHONE_TEL.startsWith("+1"), "PHONE_TEL should be E.164 and start with +1");
  assert(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(INTAKE_EMAIL), "INTAKE_EMAIL should look like an email address");
  assert(/^\(\d{3}\) \d{3}-\d{4}$/.test(DISPLAY_PHONE), "DISPLAY_PHONE should be (###) ###-####");
  assert(typeof SKILLED_CLINICAL_SERVICES === "boolean", "SKILLED_CLINICAL_SERVICES should be boolean");
}

export default function HomeCareAgencyWebsite() {
  const [intakeStatus, setIntakeStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [intakeError, setIntakeError] = useState<string>("");

  async function handleIntakeSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIntakeStatus("sending");
    setIntakeError("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.errors?.[0]?.message || "Something went wrong. Please try again.";
        throw new Error(msg);
      }

      form.reset();
      setIntakeStatus("success");
    } catch (err) {
      setIntakeStatus("error");
      setIntakeError(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Marketing Banner */}
          <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
            ⭐ Now Accepting New Clients • Free Consultation Available
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{BUSINESS_NAME}</h1>
          <p className="text-lg mb-6">
            With compassion and care, allowing you to thrive in your home while being taken care of.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <a href="#contact" aria-label="Request a free consultation">
                Request a Free Consultation
              </a>
            </Button>

            <Button asChild size="lg" className="bg-blue-800 hover:bg-blue-900">
              <a href={`tel:${PHONE_TEL}`} aria-label={`Call ${BUSINESS_NAME} at ${DISPLAY_PHONE}`}>
                <PhoneCall className="mr-2" /> Call {DISPLAY_PHONE}
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">Our Home Care Services</h2>
        <p className="text-center max-w-3xl mx-auto mb-4">
          We also provide dialysis support and additional in-home services when needed, ensuring
          continuity of care and comfort at home.
        </p>
        <p className="text-center text-sm text-gray-500 mb-12">
          *Services are provided based on individual care plans and assessed needs.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center">
              <Heart className="mx-auto mb-4" size={36} />
              <h3 className="font-semibold text-xl mb-2">Personal Care</h3>
              <p>Assistance with bathing, dressing, grooming, and daily activities.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center">
              <Users className="mx-auto mb-4" size={36} />
              <h3 className="font-semibold text-xl mb-2">Companion Care</h3>
              <p>Friendly companionship, meal prep, light housekeeping, and errands.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center">
              <ShieldCheck className="mx-auto mb-4" size={36} />
              <h3 className="font-semibold text-xl mb-2">
                {SKILLED_CLINICAL_SERVICES ? "Skilled Support" : "Supportive Care"}
              </h3>
              <p>
                {SKILLED_CLINICAL_SERVICES
                  ? "Support that may include clinician-directed services based on your care plan."
                  : "Medication reminders, mobility support, and safety supervision (non-medical)."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center">
              <Droplets className="mx-auto mb-4" size={36} />
              <h3 className="font-semibold text-xl mb-2">Dialysis &amp; Specialized Care</h3>
              <p>
                {SKILLED_CLINICAL_SERVICES
                  ? "Support for dialysis routines and specialized needs as outlined in the care plan."
                  : "Dialysis support through scheduling help, transportation coordination, and in-home assistance with daily needs."}
              </p>
              <p className="mt-3 text-sm text-gray-500">
                *We coordinate with your clinical team; medical treatments are provided only when authorized and licensed.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Why Families Choose Us</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>Licensed, bonded, and insured caregivers</li>
              <li>Customized care plans</li>
              <li>24/7 support and flexible scheduling</li>
              <li>Locally owned and community-focused</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl shadow-sm">
            <p className="text-lg italic">
              "The caregivers treated my mother like family. I finally had peace of mind."
            </p>
            <p className="mt-4 font-semibold">— Client Testimonial</p>
          </div>
        </div>
      </section>

      {/* Contact + Intake Section */}
      <section id="contact" className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-4">Get Started Today</h2>
            <p className="mb-2">Call us or request a consultation to discuss your care needs.</p>
            <p className="text-sm text-gray-600">New clients can also complete a quick intake request below.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Call Card */}
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Call for Immediate Help</h3>
                <p className="text-gray-700 mb-4">
                  Speak with our team to discuss care options, scheduling, and next steps.
                </p>
                <Button asChild size="lg" className="flex items-center gap-2">
                  <a href={`tel:${PHONE_TEL}`} aria-label={`Call ${BUSINESS_NAME} at ${DISPLAY_PHONE}`}>
                    <PhoneCall /> Call {DISPLAY_PHONE}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Client Intake Form */}
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Client Intake Request Form</h3>

                <form
                  className="space-y-4"
                  action={FORMSPREE_ENDPOINT}
                  method="POST"
                  onSubmit={handleIntakeSubmit}
                >
                  <input type="hidden" name="_subject" value={`New Client Intake Request — ${BUSINESS_NAME}`} />

                  <div>
                    <label className="block text-sm font-medium mb-1">Client / Family Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Full name"
                      className="w-full rounded-xl border px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="(###) ###-####"
                      className="w-full rounded-xl border px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email (optional)</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Care Needs</label>
                    <textarea
                      name="message"
                      placeholder="Tell us what kind of support is needed (personal care, companion care, dialysis support, etc.)"
                      className="w-full rounded-xl border px-3 py-2 min-h-[110px]"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    *Submitting this form does not guarantee services. All care is provided based on individual care plans and assessed needs.
                  </p>

                  <Button type="submit" className="w-full rounded-xl" disabled={intakeStatus === "sending"}>
                    {intakeStatus === "sending" ? "Sending..." : "Submit Intake Request"}
                  </Button>

                  {intakeStatus === "success" && (
                    <p className="text-sm text-green-700">
                      Thank you! We received your request and will contact you shortly.
                    </p>
                  )}

                  {intakeStatus === "error" && (
                    <p className="text-sm text-red-700">
                      {intakeError || "We couldn’t send your request. Please call us instead."}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 text-center">
        <p>
          © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
