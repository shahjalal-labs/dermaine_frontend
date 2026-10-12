import { RefreshCw } from "lucide-react";

export default function PricingUpdateBanner() {
  return (
    <section className=" pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#00A63E33] flex items-center justify-center text-primary shrink-0">
            <RefreshCw size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-title poppins  mb-2">
              Need an update report ?
            </h3>
            <p className="text-base md:text-lg text-description poppins  leading-relaxed">
              Your profile, eligibility, or program options may change over
              time. Purchase a new assessment anytime to generate an updated
              strategy report with the latest recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
