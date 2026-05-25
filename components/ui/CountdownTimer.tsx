"use client";

import { useEffect, useState } from "react";

interface Props {
  goesLiveAt: string; // ISO date string
  onLive?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculate(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ goesLiveAt, onLive }: Props) {
  const target = new Date(goesLiveAt);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculate(target));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculate(target);
      setTimeLeft(remaining);
      if (!remaining) {
        clearInterval(interval);
        onLive?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [goesLiveAt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!timeLeft) {
    return (
      <p className="text-clay-600 font-medium text-sm tracking-widest uppercase">
        Available now
      </p>
    );
  }

  const units = [
    { label: "Days",    value: timeLeft.days    },
    { label: "Hours",   value: timeLeft.hours   },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 items-end">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="text-3xl font-serif text-clay-700 tabular-nums w-14">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-xs text-stone-400 tracking-widest uppercase mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
