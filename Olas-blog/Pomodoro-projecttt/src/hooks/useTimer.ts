import { useEffect, useRef, useState } from 'react';

export type TimerMode = 'work' | 'short' | 'long';

export type TimerConfig = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  roundsBeforeLongBreak: number;
};

type UseTimerReturn = {
  secondsLeft: number;
  mode: TimerMode;
  isRunning: boolean;
  roundsCompleted: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  setConfig: (c: TimerConfig) => void;
};

function secondsForMode(mode: TimerMode, cfg: TimerConfig) {
  if (mode === 'work') return cfg.workMinutes * 60;
  if (mode === 'short') return cfg.shortBreakMinutes * 60;
  return cfg.longBreakMinutes * 60;
}

export default function useTimer(initialConfig: TimerConfig): UseTimerReturn {
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem('pomodoro-state') : null;
  const parsed = saved ? JSON.parse(saved) : null;

  const [config, setConfig] = useState<TimerConfig>(initialConfig);
  const [mode, setMode] = useState<TimerMode>(parsed?.mode ?? 'work');
  const [isRunning, setIsRunning] = useState<boolean>(parsed?.isRunning ?? false);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => parsed?.secondsLeft ?? secondsForMode(parsed?.mode ?? 'work', initialConfig));
  const [roundsCompleted, setRoundsCompleted] = useState<number>(parsed?.roundsCompleted ?? 0);

  const intervalRef = useRef<number | null>(null);

  // play a short beep (WebAudio API)
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.value = 0.05;
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 200);
    } catch (e) {
      // ignore if audio is blocked
      console.warn('beep failed', e);
    }
  };

  // save state to localStorage on changes
  useEffect(() => {
    const state = { mode, secondsLeft, isRunning, roundsCompleted, config };
    localStorage.setItem('pomodoro-state', JSON.stringify(state));
  }, [mode, secondsLeft, isRunning, roundsCompleted, config]);

  // sync when initialConfig changes externally
  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current !== null) return;
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // when timer reaches 0 -> transition
  useEffect(() => {
    if (secondsLeft > 0) return;

    // ensure we don't trigger multiple times
    setIsRunning(false);
    playBeep();

    setTimeout(() => {
      if (mode === 'work') {
        const nextRounds = roundsCompleted + 1;
        setRoundsCompleted(nextRounds);
        if (nextRounds % config.roundsBeforeLongBreak === 0) {
          setMode('long');
          setSecondsLeft(secondsForMode('long', config));
        } else {
          setMode('short');
          setSecondsLeft(secondsForMode('short', config));
        }
      } else {
        setMode('work');
        setSecondsLeft(secondsForMode('work', config));
      }
      // auto-start next session
      setIsRunning(true);
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, mode, roundsCompleted, config]);

  // public actions
  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setMode('work');
    setSecondsLeft(secondsForMode('work', config));
    setRoundsCompleted(0);
  };
  const skip = () => {
    setIsRunning(false);
    // Similar to expiration logic but immediate
    if (mode === 'work') {
      const nextRounds = roundsCompleted + 1;
      setRoundsCompleted(nextRounds);
      if (nextRounds % config.roundsBeforeLongBreak === 0) {
        setMode('long');
        setSecondsLeft(secondsForMode('long', config));
      } else {
        setMode('short');
        setSecondsLeft(secondsForMode('short', config));
      }
    } else {
      setMode('work');
      setSecondsLeft(secondsForMode('work', config));
    }
    
    setTimeout(() => setIsRunning(true), 100);
  };

  const setCfg = (c: TimerConfig) => {
    setConfig(c);
    
    setSecondsLeft(secondsForMode(mode, c));
  };

  return {
    secondsLeft,
    mode,
    isRunning,
    roundsCompleted,
    start,
    pause,
    reset,
    skip,
    setConfig: setCfg,
  };
}
