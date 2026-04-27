import { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTemplate from "@/components/PageTemplate";
import CircularProgress from "@/components/CircularProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Gamepad2, RotateCcw, Sparkles, Timer, Trophy, CheckCircle2, XCircle, Info } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "idle" | "running" | "finished";

type Question = {
  prompt: string;
  answer: number;
};

const GAME_SECONDS = 60;

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function randIntInclusive(min: number, max: number) {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function createQuestion(difficulty: Difficulty): Question {
  if (difficulty === "easy") {
    const a = randIntInclusive(1, 20);
    const b = randIntInclusive(1, 20);
    const isAdd = Math.random() < 0.65;
    if (isAdd) return { prompt: `${a} + ${b}`, answer: a + b };
    const [hi, lo] = a >= b ? [a, b] : [b, a];
    return { prompt: `${hi} − ${lo}`, answer: hi - lo };
  }

  if (difficulty === "medium") {
    const op = Math.random();
    if (op < 0.45) {
      const a = randIntInclusive(10, 99);
      const b = randIntInclusive(10, 99);
      return { prompt: `${a} + ${b}`, answer: a + b };
    }
    if (op < 0.9) {
      const a = randIntInclusive(10, 99);
      const b = randIntInclusive(10, 99);
      const [hi, lo] = a >= b ? [a, b] : [b, a];
      return { prompt: `${hi} − ${lo}`, answer: hi - lo };
    }
    const a = randIntInclusive(2, 12);
    const b = randIntInclusive(2, 12);
    return { prompt: `${a} × ${b}`, answer: a * b };
  }

  // hard
  const pick = Math.random();
  if (pick < 0.5) {
    const a = randIntInclusive(25, 250);
    const b = randIntInclusive(25, 250);
    return { prompt: `${a} + ${b}`, answer: a + b };
  }
  if (pick < 0.82) {
    const a = randIntInclusive(25, 250);
    const b = randIntInclusive(25, 250);
    const [hi, lo] = a >= b ? [a, b] : [b, a];
    return { prompt: `${hi} − ${lo}`, answer: hi - lo };
  }
  const a = randIntInclusive(6, 19);
  const b = randIntInclusive(6, 19);
  return { prompt: `${a} × ${b}`, answer: a * b };
}

export default function StudentGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [secondsLeft, setSecondsLeft] = useState<number>(GAME_SECONDS);
  const [question, setQuestion] = useState<Question>(() => createQuestion("easy"));
  const [inputValue, setInputValue] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lastResult, setLastResult] = useState<null | { correct: boolean; expected: number }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const accuracy = useMemo(() => {
    if (attempts <= 0) return 0;
    return clampInt((score / attempts) * 100, 0, 100);
  }, [attempts, score]);

  const timePercent = useMemo(() => {
    return clampInt((secondsLeft / GAME_SECONDS) * 100, 0, 100);
  }, [secondsLeft]);

  const start = () => {
    setGameState("running");
    setSecondsLeft(GAME_SECONDS);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setLastResult(null);
    setInputValue("");
    setQuestion(createQuestion(difficulty));
    queueMicrotask(() => inputRef.current?.focus());
  };

  const stop = () => {
    setGameState("finished");
    setIsSubmitting(false);
    setLastResult(null);
  };

  const reset = () => {
    setGameState("idle");
    setSecondsLeft(GAME_SECONDS);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setLastResult(null);
    setInputValue("");
    setQuestion(createQuestion(difficulty));
  };

  useEffect(() => {
    if (gameState !== "running") return;

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === "running" && secondsLeft <= 0) stop();
  }, [gameState, secondsLeft]);

  useEffect(() => {
    if (gameState === "idle") setQuestion(createQuestion(difficulty));
  }, [difficulty, gameState]);

  useEffect(() => {
    if (gameState === "running" && !isSubmitting) {
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [gameState, isSubmitting, question]);

  const submitAnswer = async () => {
    if (gameState !== "running" || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const parsed = Number(inputValue.trim());
      const isValid = Number.isFinite(parsed);
      const isCorrect = isValid && parsed === question.answer;

      setAttempts((a) => a + 1);
      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((st) => st + 1);
      } else {
        setStreak(0);
      }
      setLastResult({ correct: isCorrect, expected: question.answer });
      setQuestion(createQuestion(difficulty));
      setInputValue("");
      queueMicrotask(() => inputRef.current?.focus());
    } finally {
      // Short micro-delay keeps button UI responsive and prevents double-submits.
      window.setTimeout(() => {
        setIsSubmitting(false);
        inputRef.current?.focus();
      }, 120);
    }
  };

  return (
    <DashboardLayout>
      <PageTemplate
        title="Game"
        description="A 60‑second quick math challenge to sharpen your speed. Pick a difficulty, start the timer, and aim for a streak."
      >
        <div className="grid grid-cols-12 gap-6">
          {/* ── Main Content (Left) ── */}
          <Card className="col-span-12 xl:col-span-8 border-border/60 bg-card/80 shadow-sm backdrop-blur-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight text-foreground">Quick Math Sprint</CardTitle>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">
                      Answer as many as you can. Wrong answers reset your streak.
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
                  <Select
                    value={difficulty}
                    onValueChange={(v) => setDifficulty(v as Difficulty)}
                    disabled={gameState === "running"}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl border-border/60 bg-background/60 text-xs font-bold uppercase tracking-widest shadow-sm sm:w-auto sm:min-w-[140px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="easy" className="text-xs font-bold">Easy</SelectItem>
                      <SelectItem value="medium" className="text-xs font-bold">Medium</SelectItem>
                      <SelectItem value="hard" className="text-xs font-bold">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  {gameState !== "running" ? (
                    <Button
                      onClick={start}
                      className="min-h-11 w-full rounded-xl px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 sm:w-auto"
                      disabled={isSubmitting}
                    >
                      Start Game
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="min-h-11 w-full rounded-xl border-border/60 px-6 text-[10px] font-black uppercase tracking-widest sm:w-auto"
                          disabled={isSubmitting}
                        >
                          <RotateCcw className="mr-2 h-3.5 w-3.5" />
                          Restart
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-full max-w-md rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Restart the game?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your current score and streak will be reset.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="rounded-xl"
                            onClick={start}
                          >
                            Restart
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid min-h-[60vh] grid-cols-1 items-stretch xl:min-h-[550px] xl:grid-cols-12">
                
                {/* Left Column: Timer & Stats */}
                <div className="flex flex-col border-b border-border/40 p-4 sm:p-6 xl:col-span-5 xl:border-b-0 xl:border-r xl:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <Timer className="h-3.5 w-3.5 text-primary" />
                      Time left
                    </div>
                    <Badge className={cn(
                      "rounded-full font-black text-[8px] uppercase px-2 py-0",
                      gameState === "running" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-muted text-muted-foreground"
                    )}>
                      {gameState === "running" ? "Live" : gameState === "finished" ? "Finished" : "Ready"}
                    </Badge>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-full max-w-[12.5rem] sm:max-w-[14.5rem] md:max-w-[16rem] xl:max-w-[18rem]">
                      <CircularProgress
                        value={timePercent}
                        size={192}
                        strokeWidth={14}
                        className="h-auto w-full max-w-full transition-all duration-1000 ease-linear"
                      >
                        <div className="text-center">
                          <div className="text-[clamp(2.25rem,1.6rem+2.8vw,4.5rem)] font-black tabular-nums tracking-tighter">
                            {secondsLeft}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1">
                            seconds
                          </div>
                        </div>
                      </CircularProgress>
                      {gameState === "finished" && (
                         <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-[2px] rounded-full animate-in fade-in">
                           <div className="p-3 rounded-2xl bg-white shadow-xl border border-border/50">
                              <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
                           </div>
                         </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[
                        { label: "Score", val: score, color: "text-foreground" },
                        { label: "Streak", val: streak, color: "text-primary" },
                        { label: "Accuracy", val: `${accuracy}%`, color: "text-foreground" }
                      ].map((stat, idx) => (
                        <div
                          key={stat.label}
                          className={cn(
                            "min-w-0 rounded-3xl sm:rounded-[2rem] border border-border/60 bg-muted/5 px-1.5 py-3 sm:p-5 text-center shadow-inner",
                            idx === 2 && "col-span-2 mx-auto w-full max-w-[220px]",
                          )}
                        >
                          <p className="text-[7px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.12em] sm:tracking-widest mb-1">
                            {stat.label}
                          </p>
                          <p className={cn("text-lg sm:text-2xl font-black tabular-nums tracking-tight", stat.color)}>{stat.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Question & Interaction */}
                <div className="flex flex-col bg-muted/5 p-4 sm:p-6 xl:col-span-7 xl:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Current question
                    </div>
                    {gameState === "finished" && (
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 font-black tracking-widest">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Session Complete
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-30 mb-4">Solve the problem</p>
                      <div className="max-w-full break-words text-[clamp(2rem,1.2rem+5vw,4.75rem)] font-black tracking-tighter tabular-nums text-foreground animate-in zoom-in-95 duration-500">
                        {question.prompt}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    {gameState !== "finished" ? (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <Input
                            ref={inputRef}
                            inputMode="numeric"
                            placeholder={gameState === "running" ? "Type your answer…" : "Press Start above"}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") submitAnswer();
                            }}
                            disabled={gameState !== "running" || isSubmitting}
                            className="h-16 min-h-11 w-full min-w-0 flex-1 rounded-[1.5rem] border-border/60 bg-white text-center text-2xl font-black tabular-nums shadow-md transition-all focus:scale-[1.02] focus:ring-primary/20 sm:h-20 sm:rounded-[2rem] sm:text-3xl"
                          />
                          <Button
                            onClick={submitAnswer}
                            onMouseDown={(e) => e.preventDefault()}
                            disabled={gameState !== "running" || isSubmitting}
                            className="min-h-11 h-16 w-full rounded-[1.5rem] px-6 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02] sm:h-20 sm:w-auto sm:min-w-[170px] sm:rounded-[2rem] sm:px-10"
                          >
                            {isSubmitting ? "..." : "Submit"}
                          </Button>
                        </div>

                        <div className="h-16 flex items-center justify-center">
                          {lastResult ? (
                            <div
                              className={cn(
                                "w-full rounded-2xl border px-6 py-4 text-sm font-black flex items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4",
                                lastResult.correct
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                                  : "border-rose-500/30 bg-rose-500/10 text-rose-700",
                              )}
                            >
                              {lastResult.correct ? (
                                <><CheckCircle2 className="w-5 h-5" /> Perfect! Correct.</>
                              ) : (
                                <><XCircle className="w-5 h-5" /> Incorrect. Answer: {lastResult.expected}</>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em]">Waiting for your move</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-primary/20 bg-primary/5 p-4 sm:p-8 animate-in zoom-in-95">
                        <div className="flex flex-col items-stretch gap-4 sm:gap-6 2xl:flex-row 2xl:items-center">
                          <div className="flex-1 min-w-0 text-center 2xl:text-left space-y-2">
                            <h4 className="text-lg font-black tracking-tight text-primary">Session Over!</h4>
                            <p className="mx-auto max-w-sm text-sm 2xl:mx-0 2xl:max-w-none 2xl:text-xs font-medium text-muted-foreground leading-relaxed">
                              Great run! You can review your accuracy or change difficulty before your next attempt.
                            </p>
                          </div>
                          <div className="mx-auto flex w-full max-w-sm flex-col gap-2 sm:gap-3 2xl:mx-0 2xl:w-auto 2xl:min-w-[220px]">
                            <Button 
                              className="h-11 sm:h-12 w-full px-6 sm:px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/30"
                              onClick={start}
                            >
                              Play Again
                            </Button>
                            <Button 
                              variant="outline"
                              className="h-11 sm:h-12 w-full px-6 sm:px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-white"
                              onClick={reset}
                            >
                              Back to Ready
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Sidebar (Right) ── */}
          <div className="col-span-12 xl:col-span-4 space-y-6">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm overflow-hidden h-full">
              <CardHeader className="pb-2 border-b border-border/40 bg-muted/5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  How it works
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Rules</p>
                  <ul className="space-y-4">
                    {[
                      { text: "You have 60 seconds.", sub: "Timer starts on first answer." },
                      { text: "Each correct answer adds +1.", sub: "Accuracy affects final streak." },
                      { text: "Wrong answers reset streak.", sub: "Consistent wins bonus points." }
                    ].map((rule, i) => (
                      <li key={i} className="flex gap-4 group">
                        <div className="w-8 h-8 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                           <span className="text-xs font-black text-primary">{i+1}</span>
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-xs font-black text-foreground">{rule.text}</p>
                           <p className="text-[10px] font-medium text-muted-foreground">{rule.sub}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-[2rem] border border-border/60 bg-muted/5 space-y-3">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Tips</p>
                   <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                         Use Enter for rapid fire
                      </li>
                      <li className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                         Prioritize speed over hard mode
                      </li>
                   </ul>
                </div>

                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/20">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Objective</p>
                   <p className="text-sm font-black mt-2 leading-tight">
                      Build mental math speed & confidence with daily 60s sprints.
                   </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTemplate>
    </DashboardLayout>
  );
}
