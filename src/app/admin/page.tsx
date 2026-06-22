import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import {
  activateSeasonAction,
  cancelBatteryAction,
  createBatteryAction,
  createManualReviewAction,
  createSeasonAction,
  importOfficialPdfAction,
} from "@/app/actions";
import { ADMIN_COOKIE, isAdminCookieValid } from "@/lib/admin-auth";
import { batteryStatusLabel, reviewSourceLabel, reviewStatusLabel } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/time";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const configured = Boolean(process.env.ADMIN_PASSWORD);
  const authenticated = isAdminCookieValid(cookieStore.get(ADMIN_COOKIE)?.value);

  if (authenticated) {
    const seasons = await prisma.season.findMany({
      orderBy: [{ year: "desc" }, { period: "desc" }],
      include: {
        batteries: {
          orderBy: { number: "asc" },
          include: {
            reviews: { orderBy: { createdAt: "desc" } },
            results: true,
          },
        },
      },
    });

    return (
      <div className="grid">
        <PageHeader
          eyebrow="Acesso administrativo"
          title="Admin"
          description="Cadastre temporadas e baterias, importe resultados oficiais, revise dados e confirme o ranking público."
        />

        <section className="grid two">
          <form className="card form" action={createSeasonAction}>
            <h2>Nova temporada</h2>
            <label htmlFor="year">Ano</label>
            <input className="input" id="year" name="year" type="number" min="2024" placeholder="2026" required />
            <label htmlFor="period">Período</label>
            <select className="input" id="period" name="period" required>
              <option value="1">1º semestre</option>
              <option value="2">2º semestre</option>
            </select>
            <button className="button" type="submit">Criar temporada</button>
          </form>

          <section className="card">
            <h2>Status</h2>
            <p className="muted">Resultados públicos usam apenas baterias confirmadas. Uploads e edições ficam em revisão até confirmação.</p>
            <div style={{ height: 14 }} />
            <form action="/admin/logout" method="post">
              <button className="button secondary" type="submit">Sair</button>
            </form>
          </section>
        </section>

        {seasons.length === 0 ? (
          <section className="card">
            <h2>Nenhuma temporada cadastrada</h2>
            <p className="muted">Crie uma temporada para cadastrar as sete baterias e começar a alimentar o ranking.</p>
          </section>
        ) : null}

        {seasons.map((season) => (
          <section className="card" key={season.id}>
            <div className="section-row">
              <div>
                <h2>{season.name}</h2>
                <p className="muted">{season.active ? "Temporada ativa nas telas públicas." : "Temporada cadastrada."}</p>
              </div>
              {!season.active ? (
                <form action={activateSeasonAction}>
                  <input type="hidden" name="seasonId" value={season.id} />
                  <button className="button secondary" type="submit">Ativar</button>
                </form>
              ) : (
                <span className="pill">Ativa</span>
              )}
            </div>

            <form className="inline-form" action={createBatteryAction}>
              <input type="hidden" name="seasonId" value={season.id} />
              <input className="input" name="number" type="number" min="1" max="12" placeholder="Nº" required />
              <input className="input" name="monthLabel" placeholder="Mês ou rótulo, ex: Junho 1" />
              <input className="input" name="scheduledAt" type="datetime-local" />
              <button className="button" type="submit">Adicionar bateria</button>
            </form>

            <div className="admin-list">
              {season.batteries.length === 0 ? <p className="muted">Nenhuma bateria cadastrada.</p> : null}
              {season.batteries.map((battery) => (
                <article className="admin-item" key={battery.id}>
                  <div>
                    <h3>{battery.label}</h3>
                    <p className="meta">{battery.monthLabel ?? "Sem rótulo"} · {formatDateTime(battery.scheduledAt)} · {batteryStatusLabel(battery.status)}</p>
                    <p className="meta">{battery.results.length} resultados confirmados · {battery.reviews.length} revisões</p>
                  </div>
                  <div className="admin-actions">
                    <form action={importOfficialPdfAction} className="compact-upload" encType="multipart/form-data">
                      <input type="hidden" name="batteryId" value={battery.id} />
                      <input className="input file" name="file" type="file" accept="application/pdf" required />
                      <button className="button" type="submit">Importar PDF</button>
                    </form>
                    <details>
                      <summary className="button secondary">Inserção manual</summary>
                      <form className="manual-form" action={createManualReviewAction}>
                        <input type="hidden" name="batteryId" value={battery.id} />
                        <textarea
                          className="textarea"
                          name="rows"
                          placeholder="POS;#;Nome completo;UF;MV;TMV;TT;DL;DA;TUV;TV;VM"
                          required
                        />
                        <button className="button" type="submit">Criar revisão manual</button>
                      </form>
                    </details>
                    {battery.status !== "CANCELED" ? (
                      <form action={cancelBatteryAction}>
                        <input type="hidden" name="batteryId" value={battery.id} />
                        <button className="button danger" type="submit">Cancelar</button>
                      </form>
                    ) : null}
                  </div>
                  {battery.reviews.length ? (
                    <div className="review-list">
                      {battery.reviews.map((review) => (
                        <Link href={`/admin/revisoes/${review.id}`} className="review-link" key={review.id}>
                          {reviewSourceLabel(review.source)} · {reviewStatusLabel(review.status)} · {formatDateTime(review.createdAt)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="grid">
        <PageHeader
          eyebrow="Configuração necessária"
          title="Admin bloqueado"
          description="Defina ADMIN_PASSWORD no ambiente local ou na Vercel para habilitar o acesso administrativo."
        />
        <div className="notice">Não existe senha padrão de desenvolvimento.</div>
      </div>
    );
  }

  async function login(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");

    if (password !== process.env.ADMIN_PASSWORD) {
      redirect("/admin?erro=senha");
    }

    const { adminToken, ADMIN_COOKIE: cookieName } = await import("@/lib/admin-auth");
    const token = adminToken();
    if (!token) {
      redirect("/admin");
    }

    const nextCookies = await cookies();
    nextCookies.set(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect("/admin");
  }

  return (
    <div className="grid">
      <PageHeader
        eyebrow="Acesso administrativo"
        title="Entrar"
        description="Use a senha configurada em ADMIN_PASSWORD. O acesso inicial usa senha única, sem conta de administrador."
      />
      <form className="card form" action={login}>
        <label htmlFor="password">Senha administrativa</label>
        <input className="input" id="password" name="password" type="password" required />
        <button className="button" type="submit">Entrar</button>
      </form>
    </div>
  );
}
