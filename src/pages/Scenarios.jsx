import React from 'react';
import {
  Zap,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Activity,
  Layers
} from 'lucide-react';
import Header from '../components/Header';
import ScenarioCard from '../components/ScenarioCard';
import { useNetwork } from '../context/NetworkContext';
import { CHAOS_SCENARIOS } from '../data/mockData';

export default function Scenarios() {
  const { activeScenarios, triggerScenario, restoreNominal, metrics } = useNetwork();

  const recoveryScenario = {
    id: "restore-all",
    tag: "RECOVERY",
    tagColor: "cyan",
    title: "Restore Normal Network State (Clear All Faults)",
    description: "Restore all simulated network links, queues, and telemetry metrics to their baseline operational state.",
    expected: "All campus services, fiber routes, and device statuses return to normal operational baseline.",
    buttonLabel: "● Restore All Nominal States"
  };

  return (
    <div>
      <Header
        title="Scenarios & Chaos"
        subtitle="Inject network faults, fiber cuts, DDoS floods and test dynamic resilience"
      />

      <div className="page-wrapper">
        {/* Active Chaos Status Banner */}
        <div
          className="card"
          style={{
            marginBottom: '24px',
            border: activeScenarios.length > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
            background: activeScenarios.length > 0
              ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)'
              : 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: activeScenarios.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: activeScenarios.length > 0 ? '#f87171' : '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {activeScenarios.length > 0 ? <Zap size={24} className="animate-pulse-dot" /> : <CheckCircle2 size={24} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                  {activeScenarios.length > 0
                    ? `Active Chaos Injections (${activeScenarios.length} Faults Active)`
                    : "Network Operating at Nominal Baseline"}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activeScenarios.length > 0
                    ? `Current RTT: ${metrics.latency}ms • Loss: ${metrics.packetLoss}% • Throughput: ${metrics.throughput} Mbps`
                    : "All 16 links online • Zero anomalous packet drops • OSPF cost tables converged"}
                </p>
              </div>
            </div>

            {activeScenarios.length > 0 && (
              <button onClick={restoreNominal} className="btn btn-restore">
                <RotateCcw size={16} />
                Restore Nominal Baseline
              </button>
            )}
          </div>
        </div>

        {/* Chaos Scenario Cards Grid */}
        <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
          {CHAOS_SCENARIOS.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isActive={activeScenarios.includes(scenario.id)}
              onTrigger={() => triggerScenario(scenario.id)}
            />
          ))}

          {/* Recovery Card (Card 5) */}
          <ScenarioCard
            scenario={recoveryScenario}
            isActive={false}
            onTrigger={restoreNominal}
          />
        </div>
      </div>
    </div>
  );
}
