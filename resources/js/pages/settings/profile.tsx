import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';

type RoleItem = string | { name: string };

type LandlordData = {
    owner_type?: string;
    dob?: string;
    id_type?: string;
    id_number?: string;
    address?: string;
    city?: string;
    country?: string;
    legal_name?: string;
    entity_type?: string;
    tax_id?: string;
    years_operating?: number | string;
    portfolio_size?: number | string;
    website?: string;
    payout_method?: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    routing_number?: string;
    mpesa_number?: string;
    paypal_email?: string;
    currency?: string;
    proof_type?: string;
    tos_ack?: boolean;
    tax_ack?: boolean;
    signature?: string;
};

type TenantData = {
    dob?: string;
    nationality?: string;
    id_type?: string;
    id_number?: string;
    employment_status?: string;
    employer?: string;
    job_title?: string;
    monthly_income?: number | string;
    employed_since?: string;
    employer_phone?: string;
    prev_address?: string;
    prev_landlord?: string;
    prev_landlord_phone?: string;
    reason_leaving?: string;
    ref_name?: string;
    ref_phone?: string;
    ref_relation?: string;
    emergency_name?: string;
    emergency_phone?: string;
    property_name?: string;
    unit_label?: string;
    move_in?: string;
    lease_term?: string;
    occupants?: number | string;
    pets?: string;
    vehicle?: string;
    bg_consent?: boolean;
    deposit_ack?: boolean;
    rules_ack?: boolean;
    signature?: string;
};

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            account_type?: string;
            roles?: RoleItem[];
        };
    };
    profileData?: {
        account_type?: string;
        landlord?: LandlordData | null;
        tenant?: TenantData | null;
    };
};

export default function Profile({
    mustVerifyEmail,
}: {
    mustVerifyEmail?: boolean;
}) {
    const { auth, profileData } = usePage<PageProps>().props;

    const userRoles = (auth.user?.roles || []).map((r) =>
        typeof r === 'string' ? r : r.name
    );

    const landlord = profileData?.landlord;
    const tenant = profileData?.tenant;

    const isLandlord =
        userRoles.includes('landlord') ||
        auth.user?.account_type === 'landlord' ||
        Boolean(landlord);

    const isTenant =
        userRoles.includes('tenant') ||
        auth.user?.account_type === 'tenant' ||
        Boolean(tenant);

    const form = useForm({
        // 1. Core User Attributes
        name: auth.user?.name || '',
        email: auth.user?.email || '',

        // 2. Landlord Profile Attributes
        owner_type: landlord?.owner_type || '',
        dob: landlord?.dob || '',
        id_type: landlord?.id_type || '',
        id_number: landlord?.id_number || '',
        address: landlord?.address || '',
        city: landlord?.city || '',
        country: landlord?.country || '',
        legal_name: landlord?.legal_name || '',
        entity_type: landlord?.entity_type || '',
        tax_id: landlord?.tax_id || '',
        years_operating: landlord?.years_operating || '',
        portfolio_size: landlord?.portfolio_size || '',
        website: landlord?.website || '',
        payout_method: landlord?.payout_method || '',
        bank_name: landlord?.bank_name || '',
        account_name: landlord?.account_name || '',
        account_number: landlord?.account_number || '',
        routing_number: landlord?.routing_number || '',
        mpesa_number: landlord?.mpesa_number || '',
        paypal_email: landlord?.paypal_email || '',
        currency: landlord?.currency || '',
        proof_type: landlord?.proof_type || '',
        tos_ack: landlord?.tos_ack || false,
        tax_ack: landlord?.tax_ack || false,
        signature: landlord?.signature || '',

        // 3. Tenant Profile Attributes
        tenant_dob: tenant?.dob || '',
        nationality: tenant?.nationality || '',
        tenant_id_type: tenant?.id_type || '',
        tenant_id_number: tenant?.id_number || '',
        employment_status: tenant?.employment_status || '',
        employer: tenant?.employer || '',
        job_title: tenant?.job_title || '',
        monthly_income: tenant?.monthly_income || '',
        employed_since: tenant?.employed_since || '',
        employer_phone: tenant?.employer_phone || '',
        prev_address: tenant?.prev_address || '',
        prev_landlord: tenant?.prev_landlord || '',
        prev_landlord_phone: tenant?.prev_landlord_phone || '',
        reason_leaving: tenant?.reason_leaving || '',
        ref_name: tenant?.ref_name || '',
        ref_phone: tenant?.ref_phone || '',
        ref_relation: tenant?.ref_relation || '',
        emergency_name: tenant?.emergency_name || '',
        emergency_phone: tenant?.emergency_phone || '',
        property_name: tenant?.property_name || '',
        unit_label: tenant?.unit_label || '',
        move_in: tenant?.move_in || '',
        lease_term: tenant?.lease_term || '',
        occupants: tenant?.occupants || '',
        pets: tenant?.pets || '',
        vehicle: tenant?.vehicle || '',
        bg_consent: tenant?.bg_consent || false,
        deposit_ack: tenant?.deposit_ack || false,
        rules_ack: tenant?.rules_ack || false,
        tenant_signature: tenant?.signature || '',
    });

    useEffect(() => {
        if (!profileData && !auth.user) return;

        form.setData((prev) => ({
            ...prev,
            name: auth.user?.name || prev.name,
            email: auth.user?.email || prev.email,

            ...(landlord
                ? {
                      owner_type: landlord.owner_type || '',
                      dob: landlord.dob || '',
                      id_type: landlord.id_type || '',
                      id_number: landlord.id_number || '',
                      address: landlord.address || '',
                      city: landlord.city || '',
                      country: landlord.country || '',
                      legal_name: landlord.legal_name || '',
                      entity_type: landlord.entity_type || '',
                      tax_id: landlord.tax_id || '',
                      years_operating: landlord.years_operating || '',
                      portfolio_size: landlord.portfolio_size || '',
                      website: landlord.website || '',
                      payout_method: landlord.payout_method || '',
                      bank_name: landlord.bank_name || '',
                      account_name: landlord.account_name || '',
                      account_number: landlord.account_number || '',
                      routing_number: landlord.routing_number || '',
                      mpesa_number: landlord.mpesa_number || '',
                      paypal_email: landlord.paypal_email || '',
                      currency: landlord.currency || '',
                      proof_type: landlord.proof_type || '',
                      tos_ack: landlord.tos_ack || false,
                      tax_ack: landlord.tax_ack || false,
                      signature: landlord.signature || '',
                  }
                : {}),

            ...(tenant
                ? {
                      tenant_dob: tenant.dob || '',
                      nationality: tenant.nationality || '',
                      tenant_id_type: tenant.id_type || '',
                      tenant_id_number: tenant.id_number || '',
                      employment_status: tenant.employment_status || '',
                      employer: tenant.employer || '',
                      job_title: tenant.job_title || '',
                      monthly_income: tenant.monthly_income || '',
                      employed_since: tenant.employed_since || '',
                      employer_phone: tenant.employer_phone || '',
                      prev_address: tenant.prev_address || '',
                      prev_landlord: tenant.prev_landlord || '',
                      prev_landlord_phone: tenant.prev_landlord_phone || '',
                      reason_leaving: tenant.reason_leaving || '',
                      ref_name: tenant.ref_name || '',
                      ref_phone: tenant.ref_phone || '',
                      ref_relation: tenant.ref_relation || '',
                      emergency_name: tenant.emergency_name || '',
                      emergency_phone: tenant.emergency_phone || '',
                      property_name: tenant.property_name || '',
                      unit_label: tenant.unit_label || '',
                      move_in: tenant.move_in || '',
                      lease_term: tenant.lease_term || '',
                      occupants: tenant.occupants || '',
                      pets: tenant.pets || '',
                      vehicle: tenant.vehicle || '',
                      bg_consent: tenant.bg_consent || false,
                      deposit_ack: tenant.deposit_ack || false,
                      rules_ack: tenant.rules_ack || false,
                      tenant_signature: tenant.signature || '',
                  }
                : {}),
        }));
    }, [profileData, auth.user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/profile', { preserveScroll: true });
    };

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Profile Settings"
                description="Update your account details and profile information"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Account Identity */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            required
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                            required
                        />
                        <InputError message={form.errors.email} />
                    </div>
                </div>

                {/* 2. Full Landlord Section */}
                {isLandlord && (
                    <div className="mt-8 border-t pt-6 space-y-6">
                        <Heading
                            variant="small"
                            title="Landlord Profile Details"
                            description="Legal, operational, and payout preferences"
                        />

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="legal_name">Legal / Entity Name</Label>
                                <Input
                                    id="legal_name"
                                    value={form.data.legal_name}
                                    onChange={(e) => form.setData('legal_name', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="owner_type">Owner Type</Label>
                                <Input
                                    id="owner_type"
                                    value={form.data.owner_type}
                                    onChange={(e) => form.setData('owner_type', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="entity_type">Entity Type</Label>
                                <Input
                                    id="entity_type"
                                    value={form.data.entity_type}
                                    onChange={(e) => form.setData('entity_type', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tax_id">Tax ID / KRA PIN</Label>
                                <Input
                                    id="tax_id"
                                    value={form.data.tax_id}
                                    onChange={(e) => form.setData('tax_id', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={form.data.dob}
                                    onChange={(e) => form.setData('dob', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="id_type">ID Type</Label>
                                <Input
                                    id="id_type"
                                    value={form.data.id_type}
                                    onChange={(e) => form.setData('id_type', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="id_number">ID Number</Label>
                                <Input
                                    id="id_number"
                                    value={form.data.id_number}
                                    onChange={(e) => form.setData('id_number', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={form.data.city}
                                    onChange={(e) => form.setData('city', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={form.data.country}
                                    onChange={(e) => form.setData('country', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="years_operating">Years Operating</Label>
                                <Input
                                    id="years_operating"
                                    type="number"
                                    value={form.data.years_operating}
                                    onChange={(e) => form.setData('years_operating', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="portfolio_size">Portfolio Size</Label>
                                <Input
                                    id="portfolio_size"
                                    type="number"
                                    value={form.data.portfolio_size}
                                    onChange={(e) => form.setData('portfolio_size', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={form.data.website}
                                    onChange={(e) => form.setData('website', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="payout_method">Payout Method</Label>
                                <Input
                                    id="payout_method"
                                    value={form.data.payout_method}
                                    onChange={(e) => form.setData('payout_method', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bank_name">Bank Name</Label>
                                <Input
                                    id="bank_name"
                                    value={form.data.bank_name}
                                    onChange={(e) => form.setData('bank_name', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="account_name">Bank Account Name</Label>
                                <Input
                                    id="account_name"
                                    value={form.data.account_name}
                                    onChange={(e) => form.setData('account_name', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="account_number">Bank Account Number</Label>
                                <Input
                                    id="account_number"
                                    value={form.data.account_number}
                                    onChange={(e) => form.setData('account_number', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="routing_number">Routing / SWIFT Code</Label>
                                <Input
                                    id="routing_number"
                                    value={form.data.routing_number}
                                    onChange={(e) => form.setData('routing_number', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="mpesa_number">M-Pesa Number</Label>
                                <Input
                                    id="mpesa_number"
                                    value={form.data.mpesa_number}
                                    onChange={(e) => form.setData('mpesa_number', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="paypal_email">Payout PayPal Email</Label>
                                <Input
                                    id="paypal_email"
                                    type="email"
                                    value={form.data.paypal_email}
                                    onChange={(e) => form.setData('paypal_email', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    value={form.data.currency}
                                    onChange={(e) => form.setData('currency', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Full Tenant Section */}
                {isTenant && (
                    <div className="mt-8 border-t pt-6 space-y-6">
                        <Heading
                            variant="small"
                            title="Tenant Profile Details"
                            description="Personal background, employment, and rental preferences"
                        />

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="tenant_dob">Date of Birth</Label>
                                <Input
                                    id="tenant_dob"
                                    type="date"
                                    value={form.data.tenant_dob}
                                    onChange={(e) => form.setData('tenant_dob', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    value={form.data.nationality}
                                    onChange={(e) => form.setData('nationality', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tenant_id_type">ID Type</Label>
                                <Input
                                    id="tenant_id_type"
                                    value={form.data.tenant_id_type}
                                    onChange={(e) => form.setData('tenant_id_type', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tenant_id_number">ID Number</Label>
                                <Input
                                    id="tenant_id_number"
                                    value={form.data.tenant_id_number}
                                    onChange={(e) => form.setData('tenant_id_number', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="employment_status">Employment Status</Label>
                                <Input
                                    id="employment_status"
                                    value={form.data.employment_status}
                                    onChange={(e) => form.setData('employment_status', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="employer">Employer</Label>
                                <Input
                                    id="employer"
                                    value={form.data.employer}
                                    onChange={(e) => form.setData('employer', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="job_title">Job Title</Label>
                                <Input
                                    id="job_title"
                                    value={form.data.job_title}
                                    onChange={(e) => form.setData('job_title', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="monthly_income">Monthly Income</Label>
                                <Input
                                    id="monthly_income"
                                    type="number"
                                    value={form.data.monthly_income}
                                    onChange={(e) => form.setData('monthly_income', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="employer_phone">Employer Phone</Label>
                                <Input
                                    id="employer_phone"
                                    value={form.data.employer_phone}
                                    onChange={(e) => form.setData('employer_phone', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="prev_address">Previous Address</Label>
                                <Input
                                    id="prev_address"
                                    value={form.data.prev_address}
                                    onChange={(e) => form.setData('prev_address', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="prev_landlord">Previous Landlord Name</Label>
                                <Input
                                    id="prev_landlord"
                                    value={form.data.prev_landlord}
                                    onChange={(e) => form.setData('prev_landlord', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="prev_landlord_phone">Previous Landlord Phone</Label>
                                <Input
                                    id="prev_landlord_phone"
                                    value={form.data.prev_landlord_phone}
                                    onChange={(e) => form.setData('prev_landlord_phone', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ref_name">Reference Name</Label>
                                <Input
                                    id="ref_name"
                                    value={form.data.ref_name}
                                    onChange={(e) => form.setData('ref_name', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ref_phone">Reference Phone</Label>
                                <Input
                                    id="ref_phone"
                                    value={form.data.ref_phone}
                                    onChange={(e) => form.setData('ref_phone', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ref_relation">Reference Relation</Label>
                                <Input
                                    id="ref_relation"
                                    value={form.data.ref_relation}
                                    onChange={(e) => form.setData('ref_relation', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                                <Input
                                    id="emergency_name"
                                    value={form.data.emergency_name}
                                    onChange={(e) => form.setData('emergency_name', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                                <Input
                                    id="emergency_phone"
                                    value={form.data.emergency_phone}
                                    onChange={(e) => form.setData('emergency_phone', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="move_in">Move-in Date</Label>
                                <Input
                                    id="move_in"
                                    type="date"
                                    value={form.data.move_in}
                                    onChange={(e) => form.setData('move_in', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="occupants">Occupants</Label>
                                <Input
                                    id="occupants"
                                    type="number"
                                    value={form.data.occupants}
                                    onChange={(e) => form.setData('occupants', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="pets">Pets Details</Label>
                                <Input
                                    id="pets"
                                    value={form.data.pets}
                                    onChange={(e) => form.setData('pets', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="vehicle">Vehicle Info</Label>
                                <Input
                                    id="vehicle"
                                    value={form.data.vehicle}
                                    onChange={(e) => form.setData('vehicle', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <Button disabled={form.processing}>Save Profile</Button>
                </div>
            </form>

            <DeleteUser />
        </div>
    );
}

Profile.layout = {
    breadcrumbs: [{ title: 'Profile settings', href: edit() }],
};