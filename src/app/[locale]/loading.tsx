import { CarLoader } from "@/components/ui/CarLoader";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <CarLoader label="Yükleniyor..." />
    </div>
  );
}
