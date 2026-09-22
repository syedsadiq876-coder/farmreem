import Link from "next/link";
import Logo from "@/components/layout/Logo";
import EmailTemplatesPreview from "@/components/email/EmailTemplatesPreview";

export const metadata = {
  title: "Email Templates Preview | FarmReem Admin",
};

export default function EmailTemplatesPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Logo variant="compact" />
          <Link href="/admin/dashboard" className="text-xs font-bold text-[#0F2E23] hover:underline">
            ← Back to Admin Dashboard
          </Link>
        </div>

        <EmailTemplatesPreview />
      </div>
    </div>
  );
}
