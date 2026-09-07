"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { EMAIL } from "@/data/contact";

const STORAGE_KEY = "umg-unlocked-v4";
const PASSWORD = "noir29";

function readPassword(form: EventTarget | null) {
  if (!(form instanceof HTMLFormElement)) return "";
  const entered = new FormData(form).get("password");
  return typeof entered === "string" ? entered.trim().toLowerCase() : "";
}

export function UmgPasswordGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEY) === "1");
    return () => {
      sessionStorage.removeItem(STORAGE_KEY);
    };
  }, []);

  const unlock = (form: EventTarget | null) => {
    if (readPassword(form) === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setWrong(false);
      return;
    }
    setWrong(true);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    unlock(event.currentTarget);
  };

  if (unlocked) return children;

  return (
    <div
      data-native-cursor
      className="flex min-h-screen w-full items-center justify-center bg-white px-8"
    >
      <button
        type="button"
        onClick={() => router.push("/")}
        className="fixed top-8 left-8 z-50 inline-flex items-center gap-1 text-[16px] leading-[27.5px] text-black/50 transition-colors hover:text-black"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
        Home
      </button>
      <div className="flex w-full max-w-[420px] flex-col items-start gap-8">
        <div className="flex items-center gap-3">
          <Lock
            className="size-5 shrink-0 text-black/50"
            strokeWidth={1.5}
            aria-hidden
          />
          <h1 className="text-[24px] leading-normal text-black">
            This page is password protected
          </h1>
        </div>

        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center rounded-full border border-[#c4a06a] pr-2 pl-5">
            <label className="sr-only" htmlFor="umg-password">
              Password
            </label>
            <input
              id="umg-password"
              type={show ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              autoFocus
              placeholder="Enter password"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (wrong) setWrong(false);
              }}
              className="min-w-0 flex-1 bg-transparent py-3 text-[16px] leading-normal text-black outline-none placeholder:text-black/40"
            />
            <button
              type="button"
              onClick={() => setShow((current) => !current)}
              className="flex size-10 shrink-0 items-center justify-center text-black/40 transition-colors hover:text-black"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? (
                <Eye className="size-4" strokeWidth={1.5} />
              ) : (
                <EyeOff className="size-4" strokeWidth={1.5} />
              )}
            </button>
            <button
              type="submit"
              className="flex size-10 shrink-0 items-center justify-center text-black/40 transition-colors hover:text-black"
              aria-label="Submit password"
            >
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          {wrong ? (
            <p className="px-1 text-[16px] leading-normal text-black/50 italic">
              That’s not it.
            </p>
          ) : null}
        </form>

        <a
          href={`mailto:${EMAIL}?subject=UMG%20case%20study%20access`}
          className="text-[16px] leading-normal text-black/50 underline decoration-solid underline-offset-[3px] transition-colors hover:text-black"
        >
          Need access?
        </a>
      </div>
    </div>
  );
}
