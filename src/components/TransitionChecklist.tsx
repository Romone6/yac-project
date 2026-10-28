"use client";

import { useEffect, useMemo, useState } from "react";

const stages = [
  { id: "explore", label: "Explore and choose" },
  { id: "apply", label: "Apply" },
  { id: "offer", label: "After an offer or placement" },
  { id: "prepare", label: "Before the first day" },
  { id: "first-weeks", label: "First weeks" },
] as const;

const tasks = [
  { id: "interests", stage: "explore", pathways: ["all"], title: "Write down what you want from your next step", text: "List interests, preferred locations, practical needs and questions to ask.", url: "https://www.yourcareer.gov.au/" },
  { id: "compare-routes", stage: "explore", pathways: ["all"], title: "Compare at least two routes into an area that interests you", text: "A university course, vocational course, apprenticeship or another route may lead to related work.", url: "/search" },
  { id: "adviser", stage: "explore", pathways: ["all"], title: "Talk through your options with someone you trust", text: "A school careers adviser or provider can help you check local details.", url: "/get-involved" },
  { id: "uni-prerequisites", stage: "apply", pathways: ["university"], title: "Check course entry requirements and subject advice", text: "Use the university's current course page to confirm prerequisites and entry routes.", url: "/toolkit/subject-alignment" },
  { id: "uac-dates", stage: "apply", pathways: ["university"], title: "Add your application and preference dates", text: "Check the current UAC dates and set a personal reminder for anything that applies to you.", url: "https://uac.edu.au/key-dates/" },
  { id: "vet-enrolment", stage: "apply", pathways: ["tafe-vet"], title: "Check the course, location and enrolment process", text: "Search Skills NSW, then ask the provider to confirm current places, fees and eligibility.", url: "https://education.nsw.gov.au/skills-nsw/students-and-job-seekers/how-to-enrol/find-a-course" },
  { id: "vet-course", stage: "apply", pathways: ["tafe-vet"], title: "Confirm the qualification is current", text: "Check the qualification code and current status in the National Training Register.", url: "https://training.gov.au/search" },
  { id: "apprentice-employer", stage: "apply", pathways: ["apprenticeship"], title: "Find an employer and an Apprentice Connect Australia Provider", text: "An apprenticeship or traineeship involves both paid work and formal training.", url: "https://www.apprenticeships.gov.au/about-apprenticeships/types-apprenticeships" },
  { id: "apprentice-steps", stage: "apply", pathways: ["apprenticeship"], title: "Check the NSW starting steps", text: "Confirm how the employer, provider and training plan fit together before you begin.", url: "https://education.nsw.gov.au/skills-nsw/apprentices-and-trainees/how-to-enrol/getting-started/7-steps-for-starting-your-apprenticeship-or-traineeship" },
  { id: "confirm-offer", stage: "offer", pathways: ["university"], title: "Read the offer and enrolment instructions carefully", text: "Record the university's official accept and enrol steps and their dates.", url: "https://uac.edu.au/current-applicants/undergraduate-applications-and-offers/" },
  { id: "confirm-vet-placement", stage: "offer", pathways: ["tafe-vet"], title: "Confirm your place and enrolment steps with the provider", text: "Ask when you need to accept, complete enrolment and attend orientation.", url: "https://education.nsw.gov.au/skills-nsw/students-and-job-seekers/how-to-enrol/find-a-course" },
  { id: "confirm-apprenticeship-placement", stage: "offer", pathways: ["apprenticeship"], title: "Confirm the training and employment arrangements", text: "Check the contract, training provider and first work and training dates.", url: "https://education.nsw.gov.au/skills-nsw/apprentices-and-trainees/how-to-enrol/getting-started/7-steps-for-starting-your-apprenticeship-or-traineeship" },
  { id: "funding-check", stage: "offer", pathways: ["all"], title: "Check support you may be eligible to apply for", text: "Use the official agency or provider to check individual rules and application timing.", url: "https://www.servicesaustralia.gov.au/online-estimators?context=64107" },
  { id: "course-costs", stage: "offer", pathways: ["all"], title: "Confirm course, equipment and travel costs", text: "Ask the provider what applies to your course, location and study period.", url: "/toolkit/financial-pathways" },
  { id: "accommodation", stage: "prepare", pathways: ["all"], title: "Plan where you will live and how you will travel", text: "Check current accommodation and transport details directly with the provider or operator.", url: "/toolkit/financial-pathways" },
  { id: "device", stage: "prepare", pathways: ["all"], title: "Check what equipment, software or uniform you need", text: "Use the course or employer's current instructions before buying anything.", url: "/search" },
  { id: "support-contacts", stage: "prepare", pathways: ["all"], title: "Save the right support contact", text: "Find your provider's student support, accessibility and wellbeing contact details.", url: "/support" },
  { id: "timetable", stage: "prepare", pathways: ["university", "tafe-vet"], title: "Check your timetable, start date and campus travel", text: "Confirm the details in your provider account and plan a first trip if you can.", url: "https://transportnsw.info/tickets-opal/ticket-eligibility-concessions/child-student-concessions/tertiary-or-tafe-students" },
  { id: "census", stage: "first-weeks", pathways: ["university"], title: "Find your provider and course census date", text: "Dates vary by provider, course and study period. Check the official course information.", url: "https://www.studyassist.gov.au/starting-study-basics/key-dates-and-terminology" },
  { id: "where-support", stage: "first-weeks", pathways: ["all"], title: "Find out how to ask for academic or practical support", text: "Save your provider's contact route and ask early if something is getting in the way.", url: "/support" },
] as const;

type SavedState = { done: Record<string, boolean>; due: Record<string, string> };
const storageKey = "pathway-to-entry-transition-checklist-v1";

export function TransitionChecklist() {
  const [pathway, setPathway] = useState("not-sure");
  const [stage, setStage] = useState<(typeof stages)[number]["id"]>("explore");
  const [saved, setSaved] = useState<SavedState>({ done: {}, due: {} });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const value = localStorage.getItem(storageKey);
        if (value) {
          const parsed: unknown = JSON.parse(value);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) setSaved(parsed as SavedState);
        }
      } catch {
        // The checklist still works for this visit if device storage is unavailable.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(saved));
    } catch {
      // Keep the checklist usable in memory when local storage is unavailable.
    }
  }, [ready, saved]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const appliesTo = task.pathways as readonly string[];
    return task.stage === stage && (appliesTo.includes("all") || appliesTo.includes(pathway));
  }), [pathway, stage]);
  const completed = visibleTasks.filter((task) => saved.done[task.id]).length;

  return (
    <div className="space-y-7">
      <section aria-label="Choose your checklist" className="grid gap-5 border-y border-[var(--line)] py-6 sm:grid-cols-2">
        <label className="font-semibold">Pathway
          <select value={pathway} onChange={(event) => setPathway(event.target.value)} className="mt-2 block w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-3 font-normal">
            <option value="not-sure">I&apos;m not sure yet</option><option value="university">University</option><option value="tafe-vet">TAFE / VET</option><option value="apprenticeship">Apprenticeship / traineeship</option><option value="other">Work or another route</option>
          </select>
        </label>
        <label className="font-semibold">Where are you up to?
          <select value={stage} onChange={(event) => setStage(event.target.value as (typeof stages)[number]["id"])} className="mt-2 block w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-3 font-normal">
            {stages.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
      </section>

      <section aria-labelledby="checklist-stage-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--green)]">{stages.find((item) => item.id === stage)?.label}</p><h2 id="checklist-stage-title" className="mt-2 text-2xl font-bold">Your next actions</h2></div>
          <p className="text-sm text-[var(--muted)]">{completed} of {visibleTasks.length} done</p>
        </div>
        <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {visibleTasks.map((task) => (
            <li key={task.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <label className="flex items-start gap-3"><input type="checkbox" checked={Boolean(saved.done[task.id])} onChange={(event) => setSaved((current) => ({ ...current, done: { ...current.done, [task.id]: event.target.checked } }))} className="mt-1 h-5 w-5 accent-[var(--green)]" /><span><span className="block font-bold">{task.title}</span><span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{task.text}</span><a href={task.url} target={task.url.startsWith("http") ? "_blank" : undefined} rel={task.url.startsWith("http") ? "noreferrer" : undefined} className="mt-2 inline-block text-sm font-semibold text-[var(--green)] underline underline-offset-4">Open official information ↗</a></span></label>
              <label className="text-sm text-[var(--muted)]">Personal target date<input type="date" value={saved.due[task.id] ?? ""} onChange={(event) => setSaved((current) => ({ ...current, due: { ...current.due, [task.id]: event.target.value } }))} className="mt-1 block rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-2 text-[var(--foreground)]" /></label>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-end gap-4 pt-3"><button type="button" onClick={() => window.print()} className="font-semibold text-[var(--green)] underline underline-offset-4">Print checklist</button><button type="button" onClick={() => setSaved({ done: {}, due: {} })} className="font-semibold text-[var(--green)] underline underline-offset-4">Clear saved progress</button></div>
      </section>
      <p className="text-sm leading-6 text-[var(--muted)]">Progress and personal target dates are saved in this browser on this device only. Official dates and requirements always need to be checked with the linked provider or agency.</p>
    </div>
  );
}
