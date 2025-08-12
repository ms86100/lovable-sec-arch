import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

export type TourStep = {
  selector: string;
  title: string;
  content: string;
  padding?: number; // extra space around the target
  radius?: number; // corner radius of the spotlight
};

interface OnboardingTourProps {
  steps: TourStep[];
  autoStart?: boolean;
  storageKey?: string; // localStorage key to mark completion
  onFinish?: () => void;
}

function useElementRect(selector: string | null) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!selector) return;
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }

    const update = () => {
      const r = el.getBoundingClientRect();
      setRect(new DOMRect(r.left, r.top, r.width, r.height));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [selector]);

  return rect;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  autoStart = true,
  storageKey = "onboarding:v1",
  onFinish,
}) => {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  const step = steps[index];
  const rect = useElementRect(step ? step.selector : null);
  const padding = step?.padding ?? 12;
  const radius = step?.radius ?? 12;

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipAbove, setTooltipAbove] = useState(false);

  // Start automatically for new users
  useEffect(() => {
    if (!autoStart) return;
    const done = localStorage.getItem(storageKey);
    if (!done && steps.length > 0) setActive(true);
  }, [autoStart, storageKey, steps.length]);

  // Ensure the target is visible
  useEffect(() => {
    if (!active || !step) return;
    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [active, step]);

  // Compute spotlight clip-path values
  const clipPath = useMemo(() => {
    if (!rect) return undefined;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const top = Math.max(0, rect.top - padding);
    const left = Math.max(0, rect.left - padding);
    const right = Math.max(0, vw - (rect.right + padding));
    const bottom = Math.max(0, vh - (rect.bottom + padding));
    return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
  }, [rect, padding, radius]);

  // Tooltip positioning decision (above or below)
  useEffect(() => {
    if (!rect) return;
    const spaceBelow = window.innerHeight - rect.bottom;
    const preferred = spaceBelow < 180; // if space is tight, place above
    setTooltipAbove(preferred);
  }, [rect]);

  const next = () => {
    if (index < steps.length - 1) {
      setIndex((i) => i + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    localStorage.setItem(storageKey, "true");
    setActive(false);
    onFinish?.();
  };

  if (!active || !step) return null;

  const portalTarget = document.body;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Dim + blur background with spotlight */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all duration-300"
        style={{ clipPath }}
        aria-hidden
      />

      {/* Tooltip/Card */}
      {rect && (
        <div
          className="absolute w-full h-full pointer-events-none"
          style={{ inset: 0 }}
        >
          <div
            ref={tooltipRef}
            className="pointer-events-auto max-w-sm w-[min(90vw,360px)] bg-card text-card-foreground border border-border rounded-md shadow-lg p-4 animate-enter"
            style={{
              position: "absolute",
              left: Math.min(
                Math.max(16, rect.left + rect.width / 2 - 180),
                window.innerWidth - 16 - Math.min(360, window.innerWidth * 0.9)
              ),
              top: tooltipAbove ? Math.max(16, rect.top - 12 - 140) : Math.min(window.innerHeight - 16 - 140, rect.bottom + 12),
            }}
          >
            <div className="mb-2 font-semibold leading-tight">{step.title}</div>
            <div className="text-sm text-muted-foreground mb-4">{step.content}</div>

            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={finish}>Skip</Button>
              <Button size="sm" onClick={next}>{index < steps.length - 1 ? "Next" : "Finish"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>,
    portalTarget
  );
};

export default OnboardingTour;
