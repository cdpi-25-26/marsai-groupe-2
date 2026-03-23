export default function Contact() {
    return (

<section class="min-h-screen bg-black text-white px-6 py-16">
  <div class="mx-auto max-w-4xl">
    <div class="mb-12 border-b border-fuchsia-500 pb-6">
      <h1 class="text-4xl font-bold text-fuchsia-500 md:text-5xl pt-10">
        Contact
      </h1>
      <p class="mt-4 max-w-2xl text-sm text-gray-300 md:text-base">
        Pour toute demande d’information, de collaboration ou de contact
        administratif, vous pouvez utiliser les coordonnées ci-dessous.
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-2">
      <div class="rounded-2xl border border-fuchsia-500/30 bg-zinc-950 p-6 shadow-lg shadow-fuchsia-500/10">
        <h2 class="mb-4 text-xl font-semibold text-fuchsia-400">
          Informations légales
        </h2>

        <div class="space-y-4 text-sm leading-7 text-gray-200 md:text-base">
          <div>
            <p class="font-semibold text-white">Directeur de la Publication</p>
            <p>Bruno Smadja</p>
          </div>

          <div>
            <p class="font-semibold text-white">Raison sociale</p>
            <p>Agence MobilEvent</p>
          </div>

          <div>
            <p class="font-semibold text-white">Adresse</p>
            <p>4, impasse Truillot</p>
            <p>75011 Paris</p>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-fuchsia-500/30 bg-zinc-950 p-6 shadow-lg shadow-fuchsia-500/10">
        <h2 class="mb-4 text-xl font-semibold text-fuchsia-400">
          Coordonnées
        </h2>

        <div class="space-y-5 text-sm leading-7 text-gray-200 md:text-base">
          <div>
            <p class="font-semibold text-white">Email principal</p>
            <a
              href="mailto:bruno@mobilevent.com"
              class="text-fuchsia-400 transition hover:text-fuchsia-300"
            >
              bruno@mobilevent.com
            </a>
          </div>

          <div>
            <p class="font-semibold text-white">Contact secondaire</p>
            <a
              href="mailto:jules.fournier@laplateforme.io"
              class="text-fuchsia-400 transition hover:text-fuchsia-300"
            >
              jules.fournier@laplateforme.io
            </a>
          </div>

          <div>
            <p class="font-semibold text-white">Adresse</p>
            <p>155 Rue Peyssonnel, 13002 Marseille</p>
          </div>

          <div>
            <p class="font-semibold text-white">Téléphone</p>
            <a
              href="tel:0627377849"
              class="text-fuchsia-400 transition hover:text-fuchsia-300"
            >
              06.27.37.78.49
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    );
}