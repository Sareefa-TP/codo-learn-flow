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
import { Gamepad2, RotateCcw, Sparkles, Timer, Trophy } from "lucide-react";

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
      window.setTimeout(() => setIsSubmitting(false), 120);
    }
  };

  return (
    <DashboardLayout>
      <PageTemplate
        title="Game"
        description="A 60‑second quick math challenge to sharpen your speed. Pick a difficulty, start the timer, and aim for a streak."
      >
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          <Card className="col-span-12 lg:col-span-8 min-w-0 overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/15">
                      <Gamepad2 className="h-5 w-5" />
                    </span>
                    <span className="truncate">Quick Math Sprint</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Answer as many as you can. Wrong answers reset your streak.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    value={difficulty}
                    onValueChange={(v) => setDifficulty(v as Difficulty)}
                    disabled={gameState === "running"}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] rounded-xl bg-background/60 border-border/60 shadow-sm">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  {gameState !== "running" ? (
                    <Button
                      onClick={start}
                      className="rounded-xl shadow-sm"
                      disabled={isSubmitting}
                    >
                      Start
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          disabled={isSubmitting}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restart
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[400px] rounded-2xl">
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

            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="rounded-3xl border border-border/60 bg-background/40 p-4 sm:p-6 shadow-sm w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        Time left
                      </div>
                      <Badge variant="secondary" className="rounded-full">
                        {gameState === "running" ? "Live" : gameState === "finished" ? "Finished" : "Ready"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-center">
                      <CircularProgress
                        value={timePercent}
                        size={132}
                        strokeWidth={10}
                        className="sm:hidden"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold tabular-nums">
                            {secondsLeft}
                          </div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            seconds
                          </div>
                        </div>
                      </CircularProgress>
                      <CircularProgress
                        value={timePercent}
                        size={150}
                        strokeWidth={10}
                        className="hidden sm:inline-flex"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold tabular-nums">
                            {secondsLeft}
                          </div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            seconds
                          </div>
                        </div>
                      </CircularProgress>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center">
                        <div className="text-xs text-muted-foreground">Score</div>
                        <div className="text-lg font-semibold tabular-nums">{score}</div>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center">
                        <div className="text-xs text-muted-foreground">Streak</div>
                        <div className="text-lg font-semibold tabular-nums">{streak}</div>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center">
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                        <div className="text-lg font-semibold tabular-nums">{accuracy}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-3xl border border-border/60 bg-background/40 p-4 sm:p-6 shadow-sm min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Current question
                      </div>
                      {gameState === "finished" && (
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span className="font-medium">Great run.</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-3xl border border-border/60 bg-card/70 p-4 sm:p-6 min-w-0">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                          Solve
                        </div>
                        <div className="text-3xl sm:text-5xl font-bold tracking-tight tabular-nums leading-tight break-words">
                          {question.prompt}
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
                        <div className="sm:col-span-8">
                          <Input
                            ref={inputRef}
                            inputMode="numeric"
                            placeholder={gameState === "running" ? "Type your answer…" : "Press Start to begin"}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") submitAnswer();
                            }}
                            disabled={gameState !== "running" || isSubmitting}
                            className="h-11 rounded-xl bg-background/60 border-border/60 shadow-sm text-base"
                            aria-label="Answer input"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <Button
                            onClick={submitAnswer}
                            disabled={gameState !== "running" || isSubmitting}
                            className="w-full h-11 rounded-xl shadow-sm"
                          >
                            {isSubmitting ? "Checking…" : "Submit"}
                          </Button>
                        </div>
                      </div>

                      {lastResult && (
                        <div
                          className={cn(
                            "mt-4 rounded-2xl border p-3 text-sm",
                            lastResult.correct
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
                          )}
                          role="status"
                          aria-live="polite"
                        >
                          {lastResult.correct ? (
                            <span className="font-medium">Correct.</span>
                          ) : (
                            <>
                              <span className="font-medium">Not quite.</span>{" "}
                              <span className="opacity-90">Correct answer: {lastResult.expected}</span>
                            </>
                          )}
                        </div>
                      )}

                      {gameState === "finished" && (
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-muted-foreground">
                            Want another run? You can change difficulty before starting.
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={reset}
                            >
                              Back to Ready
                            </Button>
                            <Button className="rounded-xl" onClick={start}>
                              Play Again
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-4 border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base">How it works</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="text-sm font-semibold">Rules</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span>You have <span className="font-medium text-foreground">60 seconds</span>.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span>Each correct answer adds <span className="font-medium text-foreground">+1</span> score.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span>Wrong answers reset your <span className="font-medium text-foreground">streak</span>.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="text-sm font-semibold">Tips</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span>Use <span className="font-medium text-foreground">Enter</span> to submit faster.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span>Go for consistency first, then raise difficulty.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
                <div className="text-sm font-semibold text-foreground">Goal</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Build speed and confidence with small daily sprints.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTemplate>
    </DashboardLayout>
  );
}

