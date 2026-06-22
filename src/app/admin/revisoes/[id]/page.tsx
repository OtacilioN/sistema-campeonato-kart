import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { confirmReviewAction } from "@/app/actions";
import { PageHeader } from "@/components/PageHeader";
import { ADMIN_COOKIE, isAdminCookieValid } from "@/lib/admin-auth";
import { reviewStatusLabel } from "@/lib/domain/labels";
import type { ReviewPayload } from "@/lib/domain/review";
import { formatDateTime } from "@/lib/domain/time";
import { prisma } from "@/lib/prisma";

type ReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const cookieStore = await cookies();
  if (!isAdminCookieValid(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }

  const { id } = await params;
  const review = await prisma.resultReview.findUnique({
    where: { id },
    include: { battery: { include: { season: true } } },
  });

  if (!review) notFound();
  const payload = review.reviewPayload as unknown as ReviewPayload;
  const rows = payload.rows ?? [];
  const currentPole = rows.findIndex((row) => row.poleBonus > 0);
  const visibleMessages = review.messages.filter((message) => !message.startsWith("Nome truncado detectado:"));

  return (
    <div className="grid wide">
      <PageHeader
        eyebrow={`${review.battery.season.name} · ${review.battery.label}`}
        title="Revisão de resultado"
        description="Revise todos os campos, marque a pole position e confirme somente quando o resultado estiver pronto para o ranking público."
      />

      {visibleMessages.length ? (
        <section className="notice">
          {visibleMessages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </section>
      ) : null}

      <section className="card">
        <div className="section-row">
          <div>
            <h2>{payload.batteryLabel ?? review.battery.label}</h2>
            <p className="muted">
              {payload.circuit ?? "Circuito Internacional Paladino"} · {payload.category ?? "Categoria não informada"} · {payload.occurredAtText ?? formatDateTime(review.battery.scheduledAt)}
            </p>
          </div>
          <span className="pill">{reviewStatusLabel(review.status)}</span>
        </div>

        <form action={confirmReviewAction} className="review-form">
          <input type="hidden" name="reviewId" value={review.id} />
          <input type="hidden" name="rowCount" value={rows.length} />

          <section className="notice neutral">
            <p>Selecione obrigatoriamente o piloto que fez a pole position antes de confirmar o resultado.</p>
          </section>

          <div className="review-grid header">
            <span>Pole</span>
            <span>Pos</span>
            <span>#</span>
            <span>Piloto</span>
            <span>UF</span>
            <span>Status</span>
            <span>MV</span>
            <span>TMV</span>
            <span>TT</span>
            <span>DL</span>
            <span>DA</span>
            <span>TUV</span>
            <span>TV</span>
            <span>VM</span>
            <span>Pen.</span>
            <span>Motivo</span>
            <span>Total</span>
          </div>

          {rows.map((row, index) => (
            <div className="review-grid" key={`${row.fullName}-${index}`}>
              <input
                type="radio"
                name="poleIndex"
                value={index}
                defaultChecked={currentPole === index}
                required
                disabled={row.status === "NC" || review.status === "CONFIRMED"}
                aria-label={`Pole ${row.fullName}`}
              />
              <input name={`rows.${index}.position`} defaultValue={row.position ?? ""} />
              <input name={`rows.${index}.pilotNumber`} defaultValue={row.pilotNumber ?? ""} />
              <input name={`rows.${index}.fullName`} defaultValue={row.fullName} required />
              <input name={`rows.${index}.uf`} defaultValue={row.uf ?? ""} />
              <select name={`rows.${index}.status`} defaultValue={row.status}>
                <option value="CLASSIFIED">Classificado</option>
                <option value="NC">NC</option>
              </select>
              <input name={`rows.${index}.bestLapNumber`} defaultValue={row.bestLapNumber ?? ""} />
              <input name={`rows.${index}.bestLapTime`} defaultValue={row.bestLapTime ?? ""} />
              <input name={`rows.${index}.totalTime`} defaultValue={row.totalTime ?? ""} />
              <input name={`rows.${index}.gapToLeader`} defaultValue={row.gapToLeader ?? ""} />
              <input name={`rows.${index}.gapToPrevious`} defaultValue={row.gapToPrevious ?? ""} />
              <input name={`rows.${index}.lastLapTime`} defaultValue={row.lastLapTime ?? ""} />
              <input name={`rows.${index}.totalLaps`} defaultValue={row.totalLaps ?? ""} />
              <input name={`rows.${index}.averageSpeed`} defaultValue={row.averageSpeed ?? ""} />
              <input name={`rows.${index}.penaltyPoints`} defaultValue={row.penaltyPoints} min="0" step="1" type="number" />
              <input name={`rows.${index}.penaltyReason`} defaultValue={row.penaltyReason ?? ""} />
              <input name={`rows.${index}.finalPoints`} value={row.finalPoints} readOnly />
              <input type="hidden" name={`rows.${index}.bestLapBonus`} value={row.bestLapBonus} />
            </div>
          ))}

          {rows.length === 0 ? <p className="muted">Nenhum piloto encontrado nesta revisão.</p> : null}

          <button className="button" type="submit" disabled={review.status === "CONFIRMED" || rows.length === 0}>
            Confirmar resultado e recalcular ranking
          </button>
        </form>
      </section>
    </div>
  );
}
