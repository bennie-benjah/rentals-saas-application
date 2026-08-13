import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import RegisterLayout from "@/layouts/register-layout";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Stepper, Field, inputCls, selectCls } from "@/components/register/Stepper";
import { SecureIdUpload, type StoredDoc } from "@/components/register/SecureIdUpload";

const steps = ["Owner", "Business", "Property", "Payouts", "Verify"];

type Form = {
  // owner
  ownerType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  idType: string;
  idNumber: string;
  address: string;
  city: string;
  country: string;
  // business
  legalName: string;
  entityType: string;
  taxId: string;
  yearsOperating: string;
  portfolioSize: string;
  website: string;
  // property
  propName: string;
  propType: string;
  propAddress: string;
  units: string;
  yearBuilt: string;
  monthlyRent: string;
  amenities: string[];
  // payouts
  payoutMethod: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  mpesaNumber: string;
  paypalEmail: string;
  currency: string;
  // verify
  proofType: string;
  tosAck: boolean;
  taxAck: boolean;
  signature: string;
};

const initial: Form = {
  ownerType: "individual",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  dob: "",
  idType: "national",
  idNumber: "",
  address: "",
  city: "",
  country: "",
  legalName: "",
  entityType: "sole",
  taxId: "",
  yearsOperating: "",
  portfolioSize: "1-10",
  website: "",
  propName: "",
  propType: "multi",
  propAddress: "",
  units: "",
  yearBuilt: "",
  monthlyRent: "",
  amenities: [],
  payoutMethod: "bank",
  bankName: "",
  accountName: "",
  accountNumber: "",
  routingNumber: "",
  mpesaNumber: "",
  paypalEmail: "",
  currency: "USD",
  proofType: "deed",
  tosAck: false,
  taxAck: false,
  signature: "",
};

const AMENITIES = ["Parking", "Elevator", "Gym", "Pool", "Laundry", "Security", "Wi-Fi", "Backup power"];

function LandlordRegister() {
  const { honeypot } = usePage<{ honeypot?: any }>().props;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState<Form>(initial);
  const [idDocs, setIdDocs] = useState<Record<string, StoredDoc | undefined>>({});
  const [ownershipDocs, setOwnershipDocs] = useState<Record<string, StoredDoc | undefined>>({});
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  
  const toggleAmenity = (a: string) =>
    set("amenities", f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a]);

  const idSlots = f.idType === "passport"
    ? [
        { key: "front", label: "Passport photo page", hint: "Photo & MRZ visible", icon: "doc" as const },
        { key: "selfie", label: "Selfie holding ID", hint: "Face & ID clearly visible", icon: "selfie" as const },
      ]
    : [
        { key: "front", label: "ID front", hint: "All corners visible", icon: "front" as const },
        { key: "back", label: "ID back", hint: "All corners visible", icon: "back" as const },
        { key: "selfie", label: "Selfie holding ID", hint: "Face & ID clearly visible", icon: "selfie" as const },
      ];

  const idComplete = idSlots.every((s) => idDocs[s.key]);
  const ownershipComplete = !!ownershipDocs.proof;

  const canNext = () => {
    if (step === 0) return f.firstName && f.lastName && f.email && f.password.length >= 8 && f.phone && f.idNumber && f.country && idComplete;
    if (step === 1) return f.legalName && f.entityType && f.taxId;
    if (step === 2) return f.propName && f.propAddress && f.units && f.monthlyRent;
    if (step === 3) {
      if (f.payoutMethod === "bank") return f.bankName && f.accountName && f.accountNumber;
      if (f.payoutMethod === "mpesa") return f.mpesaNumber;
      if (f.payoutMethod === "paypal") return f.paypalEmail;
    }
    if (step === 4) return f.tosAck && f.taxAck && f.signature && ownershipComplete;
    return true;
  };

  const [submitting, setSubmitting] = useState(false);

  const next = () => {
    if (!canNext()) return toast.error("Please complete the required fields");
    if (step < steps.length - 1) return setStep(step + 1);

    setSubmitting(true);

    const payload = {
      ...f,
      idDocs,
      ownershipDocs,
    };

    router.post("/register/landlord", payload, {
      onSuccess: () => {
        setDone(true);
        toast.success("Account created successfully");
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0];
        toast.error(typeof firstError === "string" ? firstError : "Please check your details and try again");
      },
      onFinish: () => setSubmitting(false),
    });
  };

  if (done) {
    return (
      <div className="animate-reveal max-w-lg mx-auto text-center py-10">
        <div className="size-14 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center">
          <CheckCircle2 className="size-7" />
        </div>
        <h1 className="font-display text-3xl font-medium tracking-tight mt-6">You're all set</h1>
        <p className="text-sm text-muted-foreground mt-3">
          <span className="text-foreground font-medium">{f.propName}</span> is ready to go. We'll verify your
          documents in the background — you can start inviting tenants right away.
        </p>
        <button
          onClick={() => router.visit("/dashboard")}
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90"
        >
          Open your dashboard <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-reveal">
      {/* Spatie Honeypot Anti-Spam Fields */}
      {honeypot?.enabled && (
        <div style={{ display: "none" }} aria-hidden="true">
          <input type="text" name={honeypot.nameFieldName} tabIndex={-1} autoComplete="off" />
          <input type="text" name={honeypot.validFromFieldName} value={honeypot.validFrom} readOnly tabIndex={-1} />
        </div>
      )}

      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Landlord onboarding
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight mt-2">
          Get your portfolio live on EstateOS.
        </h1>
      </div>

      <div className="mt-8">
        <Stepper steps={steps} current={step} />
      </div>

      <div className="mt-8 bg-surface ring-1 ring-border rounded-2xl p-5 md:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <Field label="Owner type" required>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "individual", l: "Individual" },
                  { v: "company", l: "Company / Trust" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => set("ownerType", o.v)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium ring-1 transition-all ${
                      f.ownerType === o.v
                        ? "bg-primary/10 text-primary ring-primary"
                        : "bg-background ring-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First name" required><input className={inputCls} value={f.firstName} onChange={(e) => set("firstName", e.target.value)} /></Field>
              <Field label="Last name" required><input className={inputCls} value={f.lastName} onChange={(e) => set("lastName", e.target.value)} /></Field>
              <Field label="Email" required><input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Password" required><input type="password" minLength={8} placeholder="At least 8 characters" className={inputCls} value={f.password} onChange={(e) => set("password", e.target.value)} /></Field>
              <Field label="Phone" required><input type="tel" className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Date of birth"><input type="date" className={inputCls} value={f.dob} onChange={(e) => set("dob", e.target.value)} /></Field>
              <Field label="Country" required><input className={inputCls} placeholder="Kenya" value={f.country} onChange={(e) => set("country", e.target.value)} /></Field>
              <Field label="ID type" required>
                <select className={selectCls} value={f.idType} onChange={(e) => set("idType", e.target.value)}>
                  <option value="national">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="drivers">Driver's license</option>
                </select>
              </Field>
              <Field label="ID number" required><input className={inputCls} value={f.idNumber} onChange={(e) => set("idNumber", e.target.value)} /></Field>
              <Field label="Home address" className="md:col-span-2"><input className={inputCls} value={f.address} onChange={(e) => set("address", e.target.value)} /></Field>
              <Field label="City"><input className={inputCls} value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
            </div>
            <SecureIdUpload
              slots={idSlots}
              kind="landlord_id"
              value={idDocs}
              onChange={setIdDocs}
              title="Verify your identity"
              description="Required for KYC and to authorize payouts. Encrypted at rest with full audit trail."
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Legal / business name" required className="md:col-span-2">
              <input className={inputCls} value={f.legalName} onChange={(e) => set("legalName", e.target.value)} />
            </Field>
            <Field label="Entity type" required>
              <select className={selectCls} value={f.entityType} onChange={(e) => set("entityType", e.target.value)}>
                <option value="sole">Sole proprietor</option>
                <option value="llc">LLC</option>
                <option value="corp">Corporation</option>
                <option value="trust">Trust</option>
                <option value="partnership">Partnership</option>
              </select>
            </Field>
            <Field label="Tax ID / KRA PIN" required>
              <input className={inputCls} value={f.taxId} onChange={(e) => set("taxId", e.target.value)} />
            </Field>
            <Field label="Years operating">
              <input type="number" className={inputCls} value={f.yearsOperating} onChange={(e) => set("yearsOperating", e.target.value)} />
            </Field>
            <Field label="Portfolio size">
              <select className={selectCls} value={f.portfolioSize} onChange={(e) => set("portfolioSize", e.target.value)}>
                <option value="1-10">1 – 10 units</option>
                <option value="11-50">11 – 50 units</option>
                <option value="51-200">51 – 200 units</option>
                <option value="200+">200+ units</option>
              </select>
            </Field>
            <Field label="Website" className="md:col-span-2">
              <input className={inputCls} placeholder="https://" value={f.website} onChange={(e) => set("website", e.target.value)} />
            </Field>
            <Field label="Business registration doc" hint="Cert. of incorporation / DBA" className="md:col-span-2">
              <div className="border border-dashed border-border rounded-lg px-4 py-6 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-background/50 hover:border-foreground/30 cursor-pointer">
                <Upload className="size-4" /> Upload document
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Add your first property. You can add more from the dashboard later.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Property name" required>
                <input className={inputCls} placeholder="Skyline Heights" value={f.propName} onChange={(e) => set("propName", e.target.value)} />
              </Field>
              <Field label="Property type" required>
                <select className={selectCls} value={f.propType} onChange={(e) => set("propType", e.target.value)}>
                  <option value="single">Single-family</option>
                  <option value="multi">Multi-family</option>
                  <option value="condo">Condo / Apartment</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed">Mixed use</option>
                </select>
              </Field>
              <Field label="Full address" required className="md:col-span-2">
                <input className={inputCls} value={f.propAddress} onChange={(e) => set("propAddress", e.target.value)} />
              </Field>
              <Field label="Number of units" required>
                <input type="number" min={1} className={inputCls} value={f.units} onChange={(e) => set("units", e.target.value)} />
              </Field>
              <Field label="Year built">
                <input type="number" className={inputCls} value={f.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} />
              </Field>
              <Field label="Avg. monthly rent per unit" required>
                <input type="number" className={inputCls} placeholder="2500" value={f.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} />
              </Field>
            </div>
            <div>
              <p className="text-xs font-medium mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const on = f.amenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ring-1 transition-all ${
                        on
                          ? "bg-primary text-primary-foreground ring-primary"
                          : "bg-background ring-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field label="Property photos" hint="Up to 10 images">
              <div className="border border-dashed border-border rounded-lg px-4 py-6 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-background/50 hover:border-foreground/30 cursor-pointer">
                <Upload className="size-4" /> Upload photos
              </div>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Field label="Payout method" required>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "bank", l: "Bank" },
                  { v: "mpesa", l: "M-Pesa" },
                  { v: "paypal", l: "PayPal" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => set("payoutMethod", o.v)}
                    className={`px-3 py-3 rounded-lg text-sm font-medium ring-1 transition-all ${
                      f.payoutMethod === o.v
                        ? "bg-primary/10 text-primary ring-primary"
                        : "bg-background ring-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </Field>

            {f.payoutMethod === "bank" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Bank name" required><input className={inputCls} value={f.bankName} onChange={(e) => set("bankName", e.target.value)} /></Field>
                <Field label="Account holder" required><input className={inputCls} value={f.accountName} onChange={(e) => set("accountName", e.target.value)} /></Field>
                <Field label="Account number" required><input className={inputCls} value={f.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} /></Field>
                <Field label="Routing / SWIFT"><input className={inputCls} value={f.routingNumber} onChange={(e) => set("routingNumber", e.target.value)} /></Field>
              </div>
            )}
            {f.payoutMethod === "mpesa" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="M-Pesa till / paybill number" required><input className={inputCls} value={f.mpesaNumber} onChange={(e) => set("mpesaNumber", e.target.value)} /></Field>
                <Field label="Account name"><input className={inputCls} value={f.accountName} onChange={(e) => set("accountName", e.target.value)} /></Field>
              </div>
            )}
            {f.payoutMethod === "paypal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="PayPal email" required><input type="email" className={inputCls} value={f.paypalEmail} onChange={(e) => set("paypalEmail", e.target.value)} /></Field>
              </div>
            )}

            <Field label="Payout currency">
              <select className={selectCls} value={f.currency} onChange={(e) => set("currency", e.target.value)}>
                <option>USD</option>
                <option>KES</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </Field>

            <div className="p-4 bg-background rounded-lg ring-1 ring-border text-xs text-muted-foreground">
              Payouts settle within 1–3 business days after rent is received. You can add multiple payout accounts later.
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <Field label="Proof of ownership" required>
              <select className={selectCls} value={f.proofType} onChange={(e) => set("proofType", e.target.value)}>
                <option value="deed">Title deed</option>
                <option value="mgmt">Property management agreement</option>
                <option value="poa">Power of attorney</option>
              </select>
            </Field>
            <SecureIdUpload
              slots={[
                { key: "proof", label: "Proof of ownership", hint: "Deed / agreement / PoA", icon: "doc" },
              ]}
              kind="landlord_ownership_proof"
              value={ownershipDocs}
              onChange={setOwnershipDocs}
              title="Property ownership document"
              description="Encrypted at rest. Only reviewers with the admin or reviewer role can open it, and every view is logged."
            />

            <label className="flex items-start gap-3 p-4 bg-background rounded-lg ring-1 ring-border cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-primary size-4" checked={f.taxAck} onChange={(e) => set("taxAck", e.target.checked)} />
              <span className="text-sm">
                I certify the tax information provided is <b>true and correct</b>, and I'll issue tenant receipts as required by law.
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 bg-background rounded-lg ring-1 ring-border cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-primary size-4" checked={f.tosAck} onChange={(e) => set("tosAck", e.target.checked)} />
              <span className="text-sm">
                I agree to the EstateOS <b>Terms of Service</b>, <b>Payment Processing Agreement</b>, and Privacy Policy.
              </span>
            </label>
            <Field label="Digital signature (type your full legal name)" required>
              <input className={inputCls} placeholder="Full legal name" value={f.signature} onChange={(e) => set("signature", e.target.value)} />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <button
          onClick={next}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating..." : step === steps.length - 1 ? "Create account" : "Continue"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

LandlordRegister.layout = (page: React.ReactNode) => <RegisterLayout isGuest>{page}</RegisterLayout>;

export default LandlordRegister;