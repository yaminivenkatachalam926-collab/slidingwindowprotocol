import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  // Config
  const [totalFrames, setTotalFrames] = useState(8);
  const [windowSize, setWindowSize] = useState(4);
  const [lossProbability, setLossProbability] = useState(20);
  const [transmissionDelay, setTransmissionDelay] = useState(1000);

  // Status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED'
  const [status, setStatus] = useState('IDLE');

  // Go-Back-N State
  const [currentBase, setCurrentBase] = useState(1);
  const [nextSeqNum, setNextSeqNum] = useState(1);

  // Frame States array: each item { id: 1..totalFrames, status: 'WAITING' | 'SENT' | 'ACKED' | 'LOST' | 'RETRANSMIT' | 'ACTIVE' }
  const [frames, setFrames] = useState([]);
  const [receiverFrames, setReceiverFrames] = useState([]);

  // Live in-transit animation data
  const [inTransitFrame, setInTransitFrame] = useState(null); // { id: number, type: 'DATA' | 'ACK', isLost: boolean, progress: number }

  // Metrics
  const [metrics, setMetrics] = useState({
    framesTransmitted: 0,
    acksReceived: 0,
    lostFrames: 0,
    retransmissions: 0,
    successfulFrames: 0,
    averageLatency: 0,
    totalTimeMs: 0
  });

  // Event Logs
  const [eventLog, setEventLog] = useState([]);

  // Time-series history for charts
  const [historyData, setHistoryData] = useState([]);

  // Refs for loop management
  const simTimerRef = useRef(null);
  const stateRef = useRef({});
  stateRef.current = {
    totalFrames,
    windowSize,
    lossProbability,
    transmissionDelay,
    status,
    currentBase,
    nextSeqNum,
    frames,
    receiverFrames,
    metrics
  };

  // Helper to add event
  const logEvent = (eventType, frameId, eventStatus, details) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setEventLog(prev => [
      {
        id: Date.now() + Math.random(),
        time: timeStr,
        event: eventType,
        frame: frameId ? `F${frameId}` : '—',
        status: eventStatus,
        details: details
      },
      ...prev
    ]);
  };

  // Initialize frames
  const initFrames = (total = totalFrames, win = windowSize) => {
    const newFrames = [];
    const newRecv = [];
    for (let i = 1; i <= total; i++) {
      newFrames.push({
        id: i,
        status: i <= win ? 'ACTIVE' : 'WAITING'
      });
      newRecv.push({
        id: i,
        status: 'WAITING'
      });
    }
    setFrames(newFrames);
    setReceiverFrames(newRecv);
    setCurrentBase(1);
    setNextSeqNum(1);
  };

  // Reset Everything
  const resetSimulation = () => {
    if (simTimerRef.current) {
      clearTimeout(simTimerRef.current);
      simTimerRef.current = null;
    }
    setStatus('IDLE');
    setInTransitFrame(null);
    initFrames(totalFrames, windowSize);
    setMetrics({
      framesTransmitted: 0,
      acksReceived: 0,
      lostFrames: 0,
      retransmissions: 0,
      successfulFrames: 0,
      averageLatency: 0,
      totalTimeMs: 0
    });
    setEventLog([]);
    setHistoryData([]);
    logEvent('Reset', null, 'IDLE', 'Simulation reset to initial state');
  };

  // Apply Presets
  const applyPreset = (presetType) => {
    resetSimulation();
    if (presetType === 'PERFECT') {
      setTotalFrames(8);
      setWindowSize(4);
      setLossProbability(0);
      setTransmissionDelay(600);
      initFrames(8, 4);
    } else if (presetType === 'LOW_LOSS') {
      setTotalFrames(8);
      setWindowSize(4);
      setLossProbability(10);
      setTransmissionDelay(800);
      initFrames(8, 4);
    } else if (presetType === 'HIGH_LOSS') {
      setTotalFrames(8);
      setWindowSize(4);
      setLossProbability(40);
      setTransmissionDelay(1000);
      initFrames(8, 4);
    }
  };

  // Step Simulation Logic
  const runSimulationStep = () => {
    const {
      totalFrames: total,
      windowSize: win,
      lossProbability: lossProb,
      transmissionDelay: delay,
      currentBase: base,
      nextSeqNum: nextSeq,
      frames: currFrames,
      status: currStatus
    } = stateRef.current;

    if (currStatus !== 'RUNNING') return;

    // Check if completed
    if (base > total) {
      setStatus('COMPLETED');
      setInTransitFrame(null);
      logEvent('Completion', null, 'COMPLETED', 'All frames acknowledged successfully.');
      return;
    }

    // Determine if we can send a new frame within window
    if (nextSeq < base + win && nextSeq <= total) {
      const frameToSend = nextSeq;
      const isLost = Math.random() * 100 < lossProb;

      // Update next sequence
      setNextSeqNum(frameToSend + 1);

      // Update frame status in Sender
      setFrames(prev => prev.map(f => f.id === frameToSend ? { ...f, status: 'SENT' } : f));
      setMetrics(prev => ({ ...prev, framesTransmitted: prev.framesTransmitted + 1 }));

      logEvent('Transmission', frameToSend, 'SENT', `Frame F${frameToSend} transmitted on TX channel`);

      // Start TX Channel Animation
      setInTransitFrame({
        id: frameToSend,
        type: 'DATA',
        isLost: isLost,
        from: 'SENDER',
        to: 'RECEIVER'
      });

      // Half delay for TX travel
      simTimerRef.current = setTimeout(() => {
        if (stateRef.current.status !== 'RUNNING') return;

        if (isLost) {
          // Frame lost in transit!
          setFrames(prev => prev.map(f => f.id === frameToSend ? { ...f, status: 'LOST' } : f));
          setMetrics(prev => ({ ...prev, lostFrames: prev.lostFrames + 1 }));
          setInTransitFrame(null);

          logEvent('Frame Loss', frameToSend, 'LOST', `Frame F${frameToSend} dropped in TX channel (Loss Prob: ${lossProb}%)`);

          // Timeout & Go-Back-N Retransmission trigger
          simTimerRef.current = setTimeout(() => {
            if (stateRef.current.status !== 'RUNNING') return;

            logEvent('Timeout', frameToSend, 'TIMEOUT', `Timer expired for unacknowledged frame F${frameToSend}. Initiating Go-Back-N.`);
            logEvent('Retransmission', base, 'RETRANSMIT', `Go-Back-N: Rewinding nextSeq to base F${base}`);

            // Mark unACKed frames as RETRANSMIT
            setFrames(prev => prev.map(f => (f.id >= base && f.id <= total) ? { ...f, status: f.id === base ? 'RETRANSMIT' : 'ACTIVE' } : f));
            setMetrics(prev => ({ ...prev, retransmissions: prev.retransmissions + 1 }));

            // Rewind nextSeqNum back to current base
            setNextSeqNum(base);

            // Schedule next step
            simTimerRef.current = setTimeout(runSimulationStep, delay / 2);
          }, delay * 1.2);

        } else {
          // Frame arrived safely at Receiver!
          setReceiverFrames(prev => prev.map(f => f.id === frameToSend ? { ...f, status: 'ACTIVE' } : f));
          
          // Animate ACK returning
          setInTransitFrame({
            id: frameToSend,
            type: 'ACK',
            isLost: false,
            from: 'RECEIVER',
            to: 'SENDER'
          });

          logEvent('Frame Arrived', frameToSend, 'RECEIVED', `Frame F${frameToSend} reached receiver. Generating ACK${frameToSend}.`);

          // ACK travel time
          simTimerRef.current = setTimeout(() => {
            if (stateRef.current.status !== 'RUNNING') return;

            setInTransitFrame(null);

            // If this frame was the current base, slide the window!
            if (frameToSend === base) {
              const newBase = base + 1;
              setCurrentBase(newBase);

              // Update sender frames: marked as ACKED
              setFrames(prev => prev.map(f => {
                if (f.id === frameToSend) return { ...f, status: 'ACKED' };
                if (f.id >= newBase && f.id < newBase + win) return { ...f, status: f.status === 'WAITING' ? 'ACTIVE' : f.status };
                return f;
              }));

              setReceiverFrames(prev => prev.map(f => f.id === frameToSend ? { ...f, status: 'ACKED' } : f));

              setMetrics(prev => {
                const newAcks = prev.acksReceived + 1;
                const newSucc = prev.successfulFrames + 1;
                return {
                  ...prev,
                  acksReceived: newAcks,
                  successfulFrames: newSucc,
                  averageLatency: Math.round(delay * 0.75)
                };
              });

              logEvent('ACK Received', frameToSend, 'ACK', `ACK${frameToSend} received. Window slides forward to F${newBase}.`);

              // Track history point for charts
              setHistoryData(prev => [
                ...prev,
                {
                  step: prev.length + 1,
                  frame: `F${frameToSend}`,
                  base: newBase,
                  transmitted: stateRef.current.metrics.framesTransmitted + 1,
                  acked: stateRef.current.metrics.acksReceived + 1,
                  lost: stateRef.current.metrics.lostFrames
                }
              ]);

              // Check if all complete
              if (newBase > total) {
                setStatus('COMPLETED');
                logEvent('Completion', null, 'COMPLETED', 'All frames transmitted and acknowledged successfully!');
                return;
              }
            } else {
              // Out of order ACK
              setFrames(prev => prev.map(f => f.id === frameToSend ? { ...f, status: 'ACKED' } : f));
              setReceiverFrames(prev => prev.map(f => f.id === frameToSend ? { ...f, status: 'ACKED' } : f));
              setMetrics(prev => ({ ...prev, acksReceived: prev.acksReceived + 1 }));
              logEvent('ACK Received', frameToSend, 'ACK', `Cumulative ACK${frameToSend} processed.`);
            }

            // Next step in loop
            simTimerRef.current = setTimeout(runSimulationStep, delay / 2);
          }, delay / 2);
        }
      }, delay / 2);

    } else {
      // Window is full; wait for timeout or ACK
      simTimerRef.current = setTimeout(runSimulationStep, delay / 2);
    }
  };

  // Start Simulation
  const startSimulation = () => {
    if (status === 'COMPLETED') {
      resetSimulation();
    }
    setStatus('RUNNING');
    logEvent('Start', null, 'RUNNING', `Starting Go-Back-N simulation (Total: ${totalFrames}, Win: ${windowSize}, Loss: ${lossProbability}%)`);
  };

  // Pause Simulation
  const pauseSimulation = () => {
    if (simTimerRef.current) {
      clearTimeout(simTimerRef.current);
      simTimerRef.current = null;
    }
    setStatus('PAUSED');
    logEvent('Pause', null, 'PAUSED', 'Simulation paused by user');
  };

  // Resume Simulation
  const resumeSimulation = () => {
    setStatus('RUNNING');
    logEvent('Resume', null, 'RUNNING', 'Simulation resumed');
  };

  // Watch status changes to trigger loop
  useEffect(() => {
    if (status === 'RUNNING') {
      simTimerRef.current = setTimeout(runSimulationStep, 200);
    }
    return () => {
      if (simTimerRef.current) {
        clearTimeout(simTimerRef.current);
      }
    };
  }, [status]);

  // Initialize on mount
  useEffect(() => {
    initFrames(totalFrames, windowSize);
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        totalFrames,
        setTotalFrames,
        windowSize,
        setWindowSize,
        lossProbability,
        setLossProbability,
        transmissionDelay,
        setTransmissionDelay,
        status,
        currentBase,
        nextSeqNum,
        frames,
        receiverFrames,
        inTransitFrame,
        metrics,
        eventLog,
        historyData,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        applyPreset,
        clearLog: () => setEventLog([])
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
}
