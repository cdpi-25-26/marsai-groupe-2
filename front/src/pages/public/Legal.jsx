export default function Legal() {
    return (
 <section className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-12 border-b border-fuchsia-500 pb-6">
          <h1 className="text-4xl font-bold text-fuchsia-500 md:text-5xl pt-10">
            Mentions légales / Legal Notice
          </h1>
          <p className="mt-4 text-gray-300">
            Version française et anglaise des informations légales.
          </p>
        </div>

        {/* GRID 2 COLS */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* ================= FR ================= */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-fuchsia-400">
              🇫🇷 Français
            </h2>

            <div className="space-y-6 text-sm text-gray-200 leading-7">

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Données personnelles
                </h3>
                <p>
                  Les « données personnelles » désignent toutes les informations
                  permettant de vous identifier directement ou indirectement.
                  Elles sont collectées uniquement lorsque vous les fournissez
                  volontairement (inscription, etc.).
                </p>
                <p className="mt-2">
                  Aucun cookie de suivi ou de profilage n’est utilisé.
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Données collectées
                </h3>
                <p>
                  Données nominatives (nom, email…) et données nécessaires à
                  l’identification (pseudo, mot de passe).
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Partage des données
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>avec votre consentement</li>
                  <li>avec des prestataires techniques</li>
                  <li>si la loi l’exige</li>
                </ul>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Durée de conservation
                </h3>
                <p>Maximum 2 ans après votre dernière activité.</p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Vos droits
                </h3>
                <p>
                  Accès, rectification et suppression :
                </p>
                <a
                  href="mailto:info@mobilevent.com"
                  className="text-fuchsia-400 hover:text-fuchsia-300"
                >
                  info@mobilevent.com
                </a>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Sécurité
                </h3>
                <p>
                  Mesures techniques et organisationnelles mises en place pour
                  protéger vos données.
                </p>
              </div>

            </div>
          </div>

          {/* ================= EN ================= */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-fuchsia-400">
              🇬🇧 English
            </h2>

            <div className="space-y-6 text-sm text-gray-200 leading-7">

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Personal Data
                </h3>
                <p>
                  "Personal data" refers to any information that can identify
                  you directly or indirectly. It is only collected when you
                  voluntarily provide it (registration, etc.).
                </p>
                <p className="mt-2">
                  No tracking or profiling cookies are used.
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Data Collected
                </h3>
                <p>
                  Personal data (name, email) and identification data (username,
                  password).
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Data Sharing
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>with your consent</li>
                  <li>with technical service providers</li>
                  <li>when required by law</li>
                </ul>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Data Retention
                </h3>
                <p>Maximum 2 years after your last activity.</p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Your Rights
                </h3>
                <p>
                  Access, correction and deletion:
                </p>
                <a
                  href="mailto:info@mobilevent.com"
                  className="text-fuchsia-400 hover:text-fuchsia-300"
                >
                  info@mobilevent.com
                </a>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold mb-2">
                  Security
                </h3>
                <p>
                  Technical and organizational measures are implemented to
                  protect your data.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}