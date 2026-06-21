import { Upload } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

type BatteryPageProps = {
  params: Promise<{
    season: string;
    battery: string;
  }>;
};

export default async function BatteryPage({ params }: BatteryPageProps) {
  const { season, battery } = await params;

  return (
    <div className="grid">
      <PageHeader
        eyebrow={`Temporada ${season}`}
        title={battery.replaceAll("-", " ")}
        description="Detalhe público da bateria. Resultados aparecerão aqui apenas depois da confirmação administrativa."
      />
      <section className="card">
        <h2>Resultado em preparação</h2>
        <p className="muted">Quando houver resultado confirmado, esta tela exibirá posição, status, tempos, pontos e acesso à análise volta a volta.</p>
        <div style={{ height: 14 }} />
        <Link className="button" href="/pilotos">
          <Upload size={18} /> Enviar lap-to-lap pelo perfil do piloto
        </Link>
      </section>
    </div>
  );
}
