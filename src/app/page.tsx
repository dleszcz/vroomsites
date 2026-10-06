import { getAllTenants } from "@/lib/data";
import Link from "next/link";
import { headers } from "next/headers";
import { Car, MapPin, Phone, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Komisów Samochodowych | Vroomdealer",
  description: "Baza autoryzowanych komisów samochodowych korzystających z platformy Vroomdealer.",
};

export default async function DirectoryPage() {
  const tenants = await getAllTenants();
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      {/* Header */}
      <header className="bg-neutral-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Katalog Komisów Samochodowych
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Odkryj listę autoryzowanych dealerów i komisów samochodowych, które wybrały platformę Vroomdealer do zarządzania swoją ofertą.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Znaleziono {tenants.length} {tenants.length === 1 ? 'komis' : tenants.length > 1 && tenants.length < 5 ? 'komisy' : 'komisów'}
          </h2>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => {
            // Prefer custom domain if available AND not running locally, otherwise relative path
            const tenantUrl = (tenant.custom_domain && !isLocal)
              ? `https://${tenant.custom_domain}`
              : `/${tenant.slug}`;

            return (
              <Link 
                key={tenant.id} 
                href={tenantUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Branding / Cover */}
                <div 
                  className="h-32 w-full relative flex items-center justify-center bg-black" 
                >
                  {tenant.branding?.media?.heroImageUrl && (
                    <img 
                      src={tenant.branding.media.heroImageUrl} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                  )}
                  
                  {/* Logo or Fallback */}
                  {tenant.logo_url || tenant.branding?.logoUrl ? (
                    <img 
                      src={tenant.logo_url || tenant.branding?.logoUrl || ''} 
                      alt={`Logo ${tenant.business_name}`} 
                      className="relative z-10 max-h-16 max-w-[80%] object-contain"
                    />
                  ) : (
                    <span className="relative z-10 text-white font-bold text-xl px-4 text-center drop-shadow-sm line-clamp-2">
                      {tenant.business_name}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {tenant.business_name}
                  </h3>
                  
                  <p className="text-sm text-neutral-500 mb-6 line-clamp-3 flex-grow">
                    {tenant.business_description || "Brak opisu komisu."}
                  </p>

                  <div className="space-y-3 mb-6">
                    {tenant.city && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
                        <span className="truncate">{tenant.city}</span>
                      </div>
                    )}
                    {tenant.contact_phone && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Phone className="w-4 h-4 mr-2 text-neutral-400" />
                        <span className="truncate">{tenant.contact_phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    Odwiedź stronę
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        {tenants.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-neutral-200">
            <Car className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900">Brak dodanych komisów</h3>
            <p className="text-neutral-500 mt-2">Katalog jest obecnie pusty.</p>
          </div>
        )}
      </main>
    </div>
  );
}
