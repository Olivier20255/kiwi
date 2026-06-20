import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Truck, Package, ThumbsUp, Play, Square, RotateCcw, Clock, MapPin, Archive } from "lucide-react";

interface OrderTrackerProps {
  orderId: string;
  createdAt: string;
  shippingAddress: string;
}

type DeliveryStage = "processing" | "transit" | "delivered";

const STAGES: { id: DeliveryStage; label: string; description: string; icon: any }[] = [
  {
    id: "processing",
    label: "Processing",
    description: "Curation & packaging",
    icon: Package,
  },
  {
    id: "transit",
    label: "In Transit",
    description: "Dispatched with Kiwi Express",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Signature confirmed",
    icon: ThumbsUp,
  },
];

const STAGE_LOGS: Record<DeliveryStage, { title: string; desc: string; timeOffset: string }[]> = {
  processing: [
    { title: "Order Placed & Confirmed", desc: "Payment cleared via system gateway routing protocols.", timeOffset: "0 mins ago" },
    { title: "Item Inventory Allocated", desc: "Archival items successfully drawn from the central stock vault.", timeOffset: "12 mins ago" },
    { title: "Quality Curation Complete", desc: "Garment inspected, pressed, and finalized for seasonal storage wrap.", timeOffset: "Just now" },
  ],
  transit: [
    { title: "Handed over to Kiwi Carrier", desc: "Consignment picked up by premium courier distribution fleet.", timeOffset: "3 hrs ago" },
    { title: "In Transit - Hub Crossing", desc: "In-route cargo scanned at regional dispatch terminal.", timeOffset: "45 mins ago" },
    { title: "Out for final courier drop", desc: "Vehicle dispatch initiated. Direct delivery route is active.", timeOffset: "Just now" },
  ],
  delivered: [
    { title: "Recipient Contact Handshake", desc: "Delivery representative confirmed contact at coordinates.", timeOffset: "10 mins ago" },
    { title: "Delivered & Signed", desc: "Package handed over in original high-fidelity wrap. Secured confirmation.", timeOffset: "Just now" },
  ],
};

export default function OrderTracker({ orderId, createdAt, shippingAddress }: OrderTrackerProps) {
  const [currentStage, setCurrentStage] = useState<DeliveryStage>("processing");
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-simulation progression logic
  useEffect(() => {
    if (isSimulating) {
      simulationTimerRef.current = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev === "processing") return "transit";
          if (prev === "transit") return "delivered";
          // If reached delivered, loop back or loop stop
          setIsSimulating(false);
          return "delivered";
        });
      }, 3500);
    } else {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    }

    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, [isSimulating]);

  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      // If already at delivered, restart from processing when play is pressed
      if (currentStage === "delivered") {
        setCurrentStage("processing");
      }
      setIsSimulating(true);
    }
  };

  const handleStageSelect = (stageId: DeliveryStage) => {
    setIsSimulating(false); // Stop auto-play on manual override
    setCurrentStage(stageId);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStage("processing");
  };

  // Compute progress line width percentage based on stage
  const getProgressPercentage = () => {
    if (currentStage === "processing") return 15;
    if (currentStage === "transit") return 60;
    return 100;
  };

  const getStageIndex = (stageId: DeliveryStage) => {
    if (stageId === "processing") return 0;
    if (stageId === "transit") return 1;
    return 2;
  };

  const activeIdx = getStageIndex(currentStage);

  return (
    <div
      id={`order-tracker-card-${orderId}`}
      className="mt-4 border border-neutral-150 rounded-xl bg-white p-5 shadow-sm space-y-4 text-xs font-sans"
    >
      {/* Tracker Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-kiwi animate-ping" />
          <h4 className="font-display font-bold text-neutral-800 uppercase tracking-tight text-[11px] inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-neutral-500" /> Dispatch Tracking Gateway
          </h4>
        </div>

        {/* Action simulator control center */}
        <div className="flex items-center gap-2">
          <button
            id={`btn-play-sim-${orderId}`}
            type="button"
            onClick={toggleSimulation}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-mono tracking-wider uppercase font-bold transition-all border shadow-2xs ${
              isSimulating
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                : "bg-kiwi-light border-kiwi/20 text-kiwi-dark hover:bg-kiwi/10"
            }`}
          >
            {isSimulating ? (
              <>
                <Square className="h-2.5 w-2.5 fill-current" /> Pause Demo
              </>
            ) : (
              <>
                <Play className="h-2.5 w-2.5 fill-current" /> Play Simulation
              </>
            )}
          </button>

          <button
            id={`btn-reset-sim-${orderId}`}
            type="button"
            onClick={resetSimulation}
            className="p-1.5 rounded border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-neutral-500"
            title="Reset to Processing stage"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Visual Tracking Map (Custom premium progress line & bubbles) */}
      <div className="relative pt-4 pb-2 px-1">
        {/* Background connector track line */}
        <div className="absolute top-[37px] left-[10%] right-[10%] h-[3px] bg-neutral-100 rounded-full" />

        {/* Highlighted colored filling line with Framer Motion spring transition */}
        <motion.div
          className="absolute top-[37px] left-[10%] h-[3px] bg-neutral-900 rounded-full"
          initial={{ width: "15%" }}
          animate={{ width: `${getProgressPercentage() - 20}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        />

        {/* Milestone circle nodes */}
        <div className="relative flex justify-between items-start">
          {STAGES.map((stage, idx) => {
            const IconComponent = stage.icon;
            const isCompleted = idx < activeIdx;
            const isActive = idx === activeIdx;
            const isPending = idx > activeIdx;

            return (
              <div
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className="flex flex-col items-center group w-[30%] cursor-pointer group select-none"
              >
                {/* Visual indicator Node Bubble */}
                <div className="relative mb-2">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      borderColor: isActive ? "#0a0a0a" : isCompleted ? "#8bf10c" : "#e5e5e5",
                    }}
                    transition={{ duration: 0.3 }}
                    className={`h-11 w-11 rounded-full border-2 bg-white flex items-center justify-center shadow-xs transition-colors group-hover:border-neutral-900`}
                  >
                    {isCompleted ? (
                      <div className="h-7 w-7 rounded-full bg-kiwi/20 text-dark flex items-center justify-center">
                        <Check className="h-4 w-4 stroke-[3.5] text-[#4d8c00]" />
                      </div>
                    ) : isActive ? (
                      <div className="h-7 w-7 rounded-full bg-neutral-900 text-white flex items-center justify-center relative">
                        {/* Interactive dynamic loader ring */}
                        {isSimulating && (
                          <span className="absolute inset-0 rounded-full border-2 border-kiwi border-t-transparent animate-spin" />
                        )}
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <IconComponent className="h-4 w-4 text-neutral-300 group-hover:text-neutral-500" />
                    )}
                  </motion.div>

                  {/* Little pulsing accent rings around active step */}
                  {isActive && (
                    <span className="absolute -inset-1.5 -z-10 rounded-full bg-neutral-950/5 animate-pulse" />
                  )}
                </div>

                {/* Typography Labels */}
                <div className="text-center space-y-0.5 max-w-[120px]">
                  <p className={`font-display text-[10px] font-bold tracking-tight uppercase transition-colors ${
                    isActive ? "text-neutral-950" : isCompleted ? "text-neutral-700" : "text-neutral-450"
                  }`}>
                    {stage.label}
                  </p>
                  <p className="text-[9px] text-[#78716c] leading-tight hidden sm:block">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Logs & Activity timeline updates based on selected step */}
      <div className="rounded-lg bg-neutral-50/55 p-3.5 border border-neutral-100 font-sans mt-3">
        <div className="flex items-center justify-between text-[10px] text-neutral-450 uppercase font-mono mb-3">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-neutral-400" /> Package coordinates status
          </span>
          <span className="font-semibold text-neutral-600 bg-white border border-neutral-200 px-1.5 py-0.5 rounded uppercase">
            {currentStage}
          </span>
        </div>

        {/* Vertical step list layout */}
        <div className="space-y-3 pl-1.5">
          <AnimatePresence mode="popLayout">
            {STAGE_LOGS[currentStage].map((log, i) => {
              const isLatest = i === STAGE_LOGS[currentStage].length - 1;
              return (
                <motion.div
                  key={`${currentStage}-${i}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                  className="relative pl-4 flex flex-col gap-0.5 border-l border-neutral-200 pb-0.5 last:border-0"
                >
                  <div className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-white ${
                    isLatest ? "bg-kiwi" : "bg-neutral-300"
                  }`}>
                    {isLatest && <span className="absolute inset-0 rounded-full bg-kiwi animate-ping opacity-75" />}
                  </div>

                  <div className="flex justify-between items-start gap-1">
                    <span className={`text-[11px] font-bold ${isLatest ? "text-neutral-900" : "text-neutral-600"}`}>
                      {log.title}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 shrink-0">{log.timeOffset}</span>
                  </div>
                  <p className="text-[10px] text-[#78716c] leading-relaxed max-w-md">
                    {log.desc}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
