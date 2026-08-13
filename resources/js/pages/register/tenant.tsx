import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import RegisterLayout from "@/layouts/register-layout";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Stepper, Field, inputCls, selectCls } from "@/components/register/Stepper";
import { SecureIdUpload, type StoredDoc } from "@/components/register/SecureIdUpload";

const steps = ["Personal", "Employment", "History", "Apartment", "Agreement"];

type Form = {
  // personal
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  password: string;
  phone: string;
  nationality: string;
  idType: string;
  idNumber: string;
  // employment
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  monthlyIncome: string;
  employedSince: string;
  employerPhone: string;
  // history
  prevAddress: string;
  prevLandlord: string;
  prevLandlordPhone: string;
  reasonLeaving: string;
  refName: string;
  refPhone: string;
  refRelation: string;
  emergencyName: string;
  emergencyPhone: string;
  // apartment
  property: string;
  unit: string;
  moveIn: string;
  leaseTerm: string;
  occupants: string;
  pets: string;
  vehicle: string;
  // agreement
  bgConsent: boolean;
  depositAck: boolean;
  rulesAck: boolean;
  signature: string;
};

const initial: Form = {
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  password: "",
  phone: "",
  nationality: "",
  idType: "passport",
  idNumber: "",
  employmentStatus: "employed",
  employer: "",
  jobTitle: "",
  monthlyIncome: "",
  employedSince: "",
  employerPhone: "",
  prevAddress: "",
  prevLandlord: "",
  prevLandlordPhone: "",
  reasonLeaving: "",
  refName: "",
  refPhone: "",
  refRelation: "",
  emergencyName: "",
  emergencyPhone: "",
  property: "",
  unit: "",
  moveIn: "",
  leaseTerm: "12",
  occupants: "1",
  pets: "none",
  vehicle: "",
  bgConsent: false,
  depositAck: false,
  rulesAck: false,
  signature: "",
};

function TenantRegister() {
  const { honeypot } = usePage<{ honeypot?: any }>().props;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState<Form>(initial);
  const [idDocs, setIdDocs] = useState<Record<string, StoredDoc | undefined>>({});
  const [incomeDocs, setIncomeDocs] = useState<Record<string, StoredDoc | undefined>>({});
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

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
  const incomeComplete = !!incomeDocs.payslip;

  const canNext = () => {
    if (step === 0) return f.firstName && f.lastName && f.dob && f.email && f.password.length >= 8 && f.phone && f.idNumber && idComplete;
    if (step === 1) return f.employmentStatus && f.monthlyIncome && incomeComplete;
    if (step === 2) return f.emergencyName && f.emergencyPhone;
    if (step === 3) return f.property && f.unit && f.moveIn;
    if (step === 4) return f.bgConsent && f.depositAck && f.rulesAck && f.signature;
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
      incomeDocs,
    };

    router.post("/register/tenant", payload, {
      onSuccess: () => {
        setDone(true);
        toast.success("Application submitted");
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
        <h1 className="font-display text-3xl font-medium tracking-tight mt-6">
          Application received
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          Your landlord will review your details and run a background check. You'll get an email at{" "}
          <span className="text-foreground font-medium">{f.email}</span> within 48 hours.
        </p>
        <button
          onClick={() => router.visit("/tenant")}
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90"
        >
          Enter tenant portal <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-reveal">
      {/* Anti-Spam Honeypot Fields */}
      {honeypot?.enabled && (
        <div style={{ display: "none" }} aria-hidden="true">
          <input type="text" name={honeypot.nameFieldName} tabIndex={-1} autoComplete="off" />
          <input type="text" name={honeypot.validFromFieldName} value={honeypot.validFrom} readOnly tabIndex={-1} />
        </div>
      )}

      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Tenant application
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight mt-2">
          Let's get you into your new home.
        </h1>
      </div>

      <div className="mt-8">
        <Stepper steps={steps} current={step} />
      </div>

      <div className="mt-8 bg-surface ring-1 ring-border rounded-2xl p-5 md:p-8">
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First name" required>
              <input className={inputCls} value={f.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </Field>
            <Field label="Last name" required>
              <input className={inputCls} value={f.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </Field>
            <Field label="Date of birth" required hint="Must be 18+">
              <input type="date" className={inputCls} value={f.dob} onChange={(e) => set("dob", e.target.value)} />
            </Field>
            <Field label="Nationality">
              <input className={inputCls} placeholder="e.g. Kenyan" value={f.nationality} onChange={(e) => set("nationality", e.target.value)} />
            </Field>
            <Field label="Email" required>
              <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Password" required>
              <input type="password" minLength={8} placeholder="At least 8 characters" className={inputCls} value={f.password} onChange={(e) => set("password", e.target.value)} />
            </Field>
            <Field label="Phone" required>
              <input type="tel" className={inputCls} placeholder="+254 …" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="ID type" required>
              <select className={selectCls} value={f.idType} onChange={(e) => set("idType", e.target.value)}>
                <option value="passport">Passport</option>
                <option value="national">National ID</option>
                <option value="drivers">Driver's license</option>
              </select>
            </Field>
            <Field label="ID number" required>
              <input className={inputCls} value={f.idNumber} onChange={(e) => set("idNumber", e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <SecureIdUpload
                slots={idSlots}
                kind="tenant_id"
                value={idDocs}
                onChange={setIdDocs}
                title="Verify your identity"
                description="Files are AES-256 encrypted at rest, tied to your signed-in account, and only visible to reviewers. Match the ID type you selected above."
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Employment status" required>
              <select className={selectCls} value={f.employmentStatus} onChange={(e) => set("employmentStatus", e.target.value)}>
                <option value="employed">Employed</option>
                <option value="self">Self-employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Monthly income (USD)" required hint="Gross">
              <input type="number" className={inputCls} value={f.monthlyIncome} onChange={(e) => set("monthlyIncome", e.target.value)} />
            </Field>
            <Field label="Employer / Business">
              <input className={inputCls} value={f.employer} onChange={(e) => set("employer", e.target.value)} />
            </Field>
            <Field label="Job title">
              <input className={inputCls} value={f.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
            </Field>
            <Field label="Employed since">
              <input type="date" className={inputCls} value={f.employedSince} onChange={(e) => set("employedSince", e.target.value)} />
            </Field>
            <Field label="Employer phone">
              <input type="tel" className={inputCls} value={f.employerPhone} onChange={(e) => set("employerPhone", e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <SecureIdUpload
                slots={[
                  { key: "payslip", label: "Latest payslip", hint: "PDF or image", icon: "doc" },
                  { key: "bank", label: "Bank statement (3 mo)", hint: "Optional but recommended", icon: "doc" },
                ]}
                kind="tenant_proof_of_income"
                value={incomeDocs}
                onChange={setIncomeDocs}
                title="Proof of income"
                description="At least one payslip is required. Everything is encrypted and auditable."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Previous residence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Previous address" className="md:col-span-2">
                  <input className={inputCls} value={f.prevAddress} onChange={(e) => set("prevAddress", e.target.value)} />
                </Field>
                <Field label="Previous landlord">
                  <input className={inputCls} value={f.prevLandlord} onChange={(e) => set("prevLandlord", e.target.value)} />
                </Field>
                <Field label="Landlord phone">
                  <input type="tel" className={inputCls} value={f.prevLandlordPhone} onChange={(e) => set("prevLandlordPhone", e.target.value)} />
                </Field>
                <Field label="Reason for leaving" className="md:col-span-2">
                  <textarea rows={2} className={inputCls} value={f.reasonLeaving} onChange={(e) => set("reasonLeaving", e.target.value)} />
                </Field>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Personal reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Name"><input className={inputCls} value={f.refName} onChange={(e) => set("refName", e.target.value)} /></Field>
                <Field label="Phone"><input type="tel" className={inputCls} value={f.refPhone} onChange={(e) => set("refPhone", e.target.value)} /></Field>
                <Field label="Relationship"><input className={inputCls} placeholder="Friend, coworker…" value={f.refRelation} onChange={(e) => set("refRelation", e.target.value)} /></Field>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Emergency contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full name" required><input className={inputCls} value={f.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} /></Field>
                <Field label="Phone" required><input type="tel" className={inputCls} value={f.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} /></Field>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Property" required>
              <select className={selectCls} value={f.property} onChange={(e) => set("property", e.target.value)}>
                <option value="">Select property…</option>
                <option>Skyline Heights</option>
                <option>Timber Loft</option>
                <option>Harbor View</option>
                <option>Cedar & Co.</option>
              </select>
            </Field>
            <Field label="Unit / Apartment #" required>
              <input className={inputCls} placeholder="e.g. 402" value={f.unit} onChange={(e) => set("unit", e.target.value)} />
            </Field>
            <Field label="Preferred move-in" required>
              <input type="date" className={inputCls} value={f.moveIn} onChange={(e) => set("moveIn", e.target.value)} />
            </Field>
            <Field label="Lease term (months)">
              <select className={selectCls} value={f.leaseTerm} onChange={(e) => set("leaseTerm", e.target.value)}>
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="month">Month-to-month</option>
              </select>
            </Field>
            <Field label="Number of occupants">
              <input type="number" min={1} className={inputCls} value={f.occupants} onChange={(e) => set("occupants", e.target.value)} />
            </Field>
            <Field label="Pets">
              <select className={selectCls} value={f.pets} onChange={(e) => set("pets", e.target.value)}>
                <option value="none">None</option>
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Vehicle (plate)" hint="Optional" className="md:col-span-2">
              <input className={inputCls} value={f.vehicle} onChange={(e) => set("vehicle", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Please review and acknowledge before we submit your application.
            </p>
            <label className="flex items-start gap-3 p-4 bg-background rounded-lg ring-1 ring-border cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-primary size-4" checked={f.bgConsent} onChange={(e) => set("bgConsent", e.target.checked)} />
              <span className="text-sm">
                I authorize EstateOS and my prospective landlord to run a <b>background and credit check</b>.
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 bg-background rounded-lg ring-1 ring-border cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-primary size-4" checked={f.depositAck} onChange={(e) => set("depositAck", e.target.checked)} />
              <span className="text-sm">
                I understand a <b>security deposit equal to one month's rent</b> is due before move-in.
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 bg-background rounded-lg ring-1 ring-border cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-primary size-4" checked={f.rulesAck} onChange={(e) => set("rulesAck", e.target.checked)} />
              <span className="text-sm">
                I have read the <b>house rules and lease terms</b> and agree to abide by them.
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
          {submitting ? "Submitting..." : step === steps.length - 1 ? "Submit application" : "Continue"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

TenantRegister.layout = (page: React.ReactNode) => <RegisterLayout isGuest>{page}</RegisterLayout>;

export default TenantRegister;