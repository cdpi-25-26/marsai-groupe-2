export default function Legal() {
    return (
        <section className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-12 border-b border-fuchsia-500 pb-6">
          <h1 className="text-4xl font-bold text-fuchsia-500 md:text-5xl pt-10">
            Mentions légales
          </h1>
          <p className="mt-4 text-gray-300">
            Données personnelles et respect de votre vie privée.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-7 text-gray-200 md:text-base">
          
          {/* SECTION */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fuchsia-400">
              Données personnelles
            </h2>
            <p>
              Les « données personnelles » désignent toutes les informations permettant
              de vous identifier directement ou indirectement en tant que personne
              physique. Dans le cadre du Festival MarsAI, ces données sont collectées
              uniquement lorsque vous les fournissez volontairement, notamment lors de
              votre inscription sur le site.
            </p>
            <p className="mt-3">
              Contrairement à certaines pratiques douteuses du web moderne, le site du
              Festival MarsAI n’utilise pas de cookies à des fins de suivi ou de
              profilage.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fuchsia-400">
              Données collectées
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <p className="font-semibold text-white">– Données nominatives</p>
                <p>
                  Il s’agit des informations que vous renseignez lors de votre
                  inscription (nom, prénom, adresse e-mail, etc.). Ces données sont
                  strictement personnelles et ne sont accessibles ni aux autres
                  utilisateurs ni au public.
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">
                  – Données d’identification électronique
                </p>
                <p>
                  Ces données correspondent aux éléments nécessaires à votre connexion
                  et à l’utilisation du service (pseudo, adresse e-mail, mot de passe).
                  Dans le cadre du sous-titrage des vidéos, certaines informations
                  peuvent être transmises à des prestataires techniques, uniquement
                  lorsque cela est nécessaire au bon fonctionnement du service.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fuchsia-400">
              Partage des données personnelles
            </h2>
            <p>
              Vos données personnelles ne sont jamais vendues ni utilisées n’importe
              comment. Elles peuvent être partagées uniquement dans les cas suivants :
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>avec votre consentement explicite</li>
              <li>
                avec des prestataires techniques indispensables au fonctionnement du
                service
              </li>
              <li>lorsque la loi ou une autorité judiciaire l’exige</li>
            </ul>

            <p className="mt-3">
              En dehors de ces situations, vos données restent confidentielles.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fuchsia-400">
              Durée de conservation
            </h2>
            <p>
              Les données personnelles sont conservées pour une durée maximale de 2 ans
              à compter de votre dernière activité sur le site, sauf obligation légale
              contraire.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fuchsia-400">
              Vos droits
            </h2>
            <p>
              Conformément à la réglementation en vigueur, vous disposez des droits
              suivants :
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>droit d’accès à vos données</li>
              <li>droit de rectification</li>
              <li>droit de suppression</li>
            </ul>

            <p className="mt-3">
              Vous pouvez exercer ces droits à tout moment en contactant :
            </p>

            <a
              href="mailto:info@mobilevent.com"
              className="mt-2 inline-block text-fuchsia-400 hover:text-fuchsia-300"
            >
              info@mobilevent.com
            </a>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fuchsia-400">
              Sécurité
            </h2>
            <p>
              Le Festival MarsAI met en œuvre toutes les mesures techniques et
              organisationnelles nécessaires pour protéger vos données personnelles
              contre toute perte, accès non autorisé, altération ou divulgation.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}