import { Link, Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

interface Property {
    id: number;
    name: string;
    address: string;
    cover_image: string;
    description?: string;
    available_units_count: number;
    min_rent?: number;
}

interface Props {
    landlord: {
        company_name: string;
        logo_url?: string;
        welcome_message: string;
        support_email?: string;
        support_phone?: string;
    };
    properties: Property[];
}

export default function LandlordHome({ landlord, properties }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Head title={`${landlord.company_name} - Resident Portal`} />

            {/* Navigation Bar */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {landlord.logo_url ? (
                            <img src={landlord.logo_url} alt={landlord.company_name} className="h-9 w-auto" />
                        ) : (
                            <span className="font-bold text-xl text-gray-900">{landlord.company_name}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            Apply as Tenant
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero & Landlord Message Section */}
            <section className="bg-white border-b border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Welcome to {landlord.company_name}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                        "{landlord.welcome_message}"
                    </p>
                </div>
            </section>

            {/* Property Portfolio Grid */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Properties</h2>

                {properties.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-200">
                        No properties listed yet. Please check back later.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <div key={property.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col">
                                <div className="h-52 w-full relative bg-gray-100">
                                    <img
                                        src={property.cover_image}
                                        alt={property.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {property.available_units_count > 0 && (
                                        <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                                            {property.available_units_count} Vacancies Available
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{property.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                                        {property.min_rent && (
                                            <p className="mt-3 text-emerald-700 font-semibold text-sm">
                                                From KES {property.min_rent.toLocaleString()} / mo
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <Link
                                            href={`/register?property_id=${property.id}`}
                                            className="w-full text-center text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 py-2.5 rounded-xl transition"
                                        >
                                            Apply for an Apartment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} {landlord.company_name}. Powered by EstateOS.</p>
                    {landlord.support_email && (
                        <p className="mt-1">Contact Support: {landlord.support_email}</p>
                    )}
                </div>
            </footer>
        </div>
    );
}
LandlordHome.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;
