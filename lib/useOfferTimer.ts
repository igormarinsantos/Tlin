"use client";

import { useState, useEffect } from "react";

/**
 * Hook to manage a persistent countdown timer.
 * @param initialMinutes - Duration in minutes. Default 720 (12 hours).
 */
export function useOfferTimer(initialMinutes = 720) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const getOrSetTargetTime = () => {
      let target = localStorage.getItem("offer_target_time");
      const now = Date.now();
      
      // If no target exists or it has expired, set a new one
      if (!target || parseInt(target) <= now) {
        target = (now + initialMinutes * 60 * 1000).toString();
        localStorage.setItem("offer_target_time", target);
      }
      return parseInt(target);
    };

    const updateTimer = () => {
      const now = Date.now();
      const target = getOrSetTargetTime();
      const remaining = Math.max(0, Math.floor((target - now) / 1000));
      
      setTimeLeft(remaining);
      
      // Auto-restart if it hits zero
      if (remaining === 0) {
        localStorage.removeItem("offer_target_time");
        getOrSetTargetTime();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [initialMinutes]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    // Always show HH:MM:SS for the 12h feel
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { timeLeft, formattedTime: formatTime(timeLeft) };
}
