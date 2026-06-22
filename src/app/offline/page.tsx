import { VzCard, VzIcon } from "@/components/VelozesUI";

export default function OfflinePage() {
  return (
    <div className="vz-page offline-page">
      <VzCard>
        <div className="offline-state">
          <span className="offline-icon">
            <VzIcon name="flag" size={28} />
          </span>
          <div>
            <h1>Sem conexão</h1>
            <p>Não foi possível carregar esta página agora. Verifique sua internet e tente novamente.</p>
          </div>
        </div>
      </VzCard>
    </div>
  );
}
