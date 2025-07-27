import ProtectWrapper from "@/components/ProtectWrapper";

export default function DetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectWrapper>{children}</ProtectWrapper>;
}
