import { Link } from '@inertiajs/react';
import { CheckCircle2, CreditCard, Calendar, FileText } from 'lucide-react';
import type { ReactNode } from 'react';

import TenantLayout from '@/layouts/tenant-layout';

interface InvoiceItem {
    id: number;
    reference: string;
    amount_due: string;
    amount_paid: string;
    due_date: string;
    status: string;
    lease?: {
        unit?: {
            name: string;
            property?: {
                name: string;
            };
        };
    };
}

interface PayProps {
    invoices?: InvoiceItem[];
}

function Pay({ invoices = [] }: PayProps) {
    // Filter for actionable invoices (unpaid, partial, or overdue)
    const pendingInvoices = invoices.filter((inv) =>
        ['unpaid', 'partial', 'overdue'].includes(inv.status),
    );

    return (
        <div className="space-y-6">
            <header>
                <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                    Pay Rent
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your outstanding balance and payment history
                </p>
            </header>

            {pendingInvoices.length === 0 ? (
                <div className="space-y-3 rounded-2xl bg-surface p-8 text-center ring-1 ring-border">
                    <CheckCircle2 className="mx-auto size-10 text-success" />
                    <h2 className="font-display text-xl font-medium">
                        All caught up!
                    </h2>
                    <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                        You have no outstanding invoices or pending payments.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                        Outstanding Invoices
                    </h2>
                    <div className="grid gap-4">
                        {pendingInvoices.map((inv) => {
                            const due =
                                parseFloat(inv.amount_due) -
                                parseFloat(inv.amount_paid);

                            return (
                                <div
                                    key={inv.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl bg-surface p-5 ring-1 ring-border sm:flex-row sm:items-center"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                                                #{inv.reference}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                                                    inv.status === 'overdue'
                                                        ? 'bg-destructive/10 text-destructive'
                                                        : 'bg-warning/10 text-warning'
                                                }`}
                                            >
                                                {inv.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {inv.lease?.unit?.property?.name ??
                                                'Property'}{' '}
                                            · {inv.lease?.unit?.name ?? 'Unit'}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3.5" />{' '}
                                                Due {inv.due_date}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-border pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                                        <div className="text-left sm:text-right">
                                            <p className="text-xs text-muted-foreground">
                                                Amount Due
                                            </p>
                                            <p className="font-display text-xl font-medium text-foreground">
                                                ${due.toFixed(2)}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/tenant/invoices/${inv.id}/checkout`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                        >
                                            <CreditCard className="size-3.5" />{' '}
                                            Pay Now
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pay;

Pay.layout = (page: ReactNode) => <TenantLayout>{page}</TenantLayout>;
