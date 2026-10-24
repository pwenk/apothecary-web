import Link from "next/link";
import { Footer, Masthead } from "@/components/chrome";

export default function NotFound() {
  return (
    <div className="page" data-side="day">
      <Masthead />
      <main id="main" className="piece">
        <header className="piece-head">
          <p className="piece-trail">Error 404</p>
          <h1 className="piece-title">This bottle is empty.</h1>
          <p className="piece-dek">
            The page you wanted is not on the shelf. <Link href="/">Back to the front room</Link>.
          </p>
        </header>
      </main>
      <Footer />
    </div>
  );
}
