import type { Metadata } from "next";
import { Footer, Masthead } from "@/components/chrome";
import { EVIDENCE } from "@/lib/wings";

export const metadata: Metadata = { title: "About the house" };

export default function About() {
  return (
    <div className="page" data-side="day">
      <Masthead />
      <main id="main" className="piece about">
        <header className="piece-head">
          <p className="piece-trail">About the house</p>
          <h1 className="piece-title">A pharmacy you can read in bed.</h1>
          <p className="piece-dek">
            Six wings, one rule: explain the mechanism so well that the reader could teach it at dinner.
          </p>
        </header>
        <div className="prose">
          <p>
            The Apothecary started as a handful of herbarium-style notes on aspirin, doxycycline and Ray Peat. It grew
            into a house with six wings: drugs and hormones, food, the body&rsquo;s warning signs, whole schools of
            thought, the evolution of attraction, and finally pleasure itself, where the lights go down.
          </p>
          <h2 id="how-evidence-is-marked">How evidence is marked</h2>
          <ul>
            {Object.entries(EVIDENCE).map(([key, e]) => (
              <li key={key}>
                <strong>{e.label}.</strong> {e.note}
              </li>
            ))}
          </ul>
          <h2 id="what-you-will-not-find">What you will not find</h2>
          <p>
            Doses, cycles, protocols or shopping lists. When a page mentions what a study used, it does so to explain
            the science, never as a recommendation. Your doctor knows your blood work; this house only knows the
            molecules.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
