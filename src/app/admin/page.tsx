import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ADMIN_COOKIE, isAdminCookieValid } from "@/lib/admin-auth";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const configured = Boolean(process.env.ADMIN_PASSWORD);
  const authenticated = isAdminCookieValid(cookieStore.get(ADMIN_COOKIE)?.value);

  if (authenticated) {
    return (
      <div className="grid">
        <PageHeader
          eyebrow="Acesso administrativo"
          title="Admin"
          description="Área inicial para futuras importações, revisões de resultado, confirmação de baterias e correções administrativas."
        />
        <section className="card">
          <h2>Autenticado como administrador</h2>
          <p className="muted">O parser de PDF e as telas de revisão serão implementados em uma fase posterior.</p>
          <div style={{ height: 14 }} />
          <form action="/admin/logout" method="post">
            <button className="button secondary" type="submit">Sair</button>
          </form>
        </section>
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
