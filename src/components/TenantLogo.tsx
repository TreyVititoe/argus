import Image from "next/image";

// Map tenant slug → logo path under /public. Aspect ratio is preserved automatically.
const TENANT_LOGO: Record<string, { src: string; width: number; height: number }> = {
  cohesity: { src: "/cohesity.png", width: 2000, height: 1000 },
};

export default function TenantLogo({ company }: { company?: string }) {
  if (!company) return null;
  const meta = TENANT_LOGO[company.toLowerCase()];
  if (!meta) return null;
  return (
    <div className="flex items-center justify-end">
      <Image
        src={meta.src}
        alt={company}
        width={meta.width}
        height={meta.height}
        priority
        style={{ width: "auto", height: 60 }}
      />
    </div>
  );
}
