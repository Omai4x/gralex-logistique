/* ==========================================================================
   GraLex Logistique — i18n.js
   English/French language switch. HTML is authored in English; when the user
   selects French, matching strings are translated at load time. The choice is
   stored in localStorage and the page reloads to re-apply cleanly (covers the
   typewriter, tracking timeline and any dynamically generated content).
   Runs immediately (before animations.js) so the hero typewords translate too.
   ========================================================================== */
(function () {
  "use strict";
  var STORE = "gralex_lang";
  var lang = localStorage.getItem(STORE) === "fr" ? "fr" : "en";

  /* ---- EN → FR dictionary --------------------------------------------- */
  var PAIRS = [
    // Nav & global CTAs
    [`Home`, `Accueil`], [`About`, `À propos`], [`Services`, `Services`],
    [`Track`, `Suivi`], [`Gallery`, `Galerie`], [`Blog`, `Blog`], [`Contact`, `Contact`],
    [`Track Shipment`, `Suivre un colis`], [`Get a Quote`, `Demander un devis`],
    [`Open menu`, `Ouvrir le menu`], [`GraLex Logistique home`, `Accueil GraLex Logistique`],
    [`Primary`, `Principal`], [`Back to top`, `Haut de page`], [`Chat on WhatsApp`, `Discuter sur WhatsApp`],

    // Hero
    [`Benin · Nigeria · West Africa`, `Bénin · Nigéria · Afrique de l'Ouest`],
    [`Delivering`, `Livrer`], [`Africa.`, `l'Afrique.`], [`Connecting the`, `Connecter le`], [`World.`, `monde.`],
    [`Fast, secure and reliable logistics solutions for`, `Des solutions logistiques rapides, sûres et fiables pour`],
    [`Track your shipment`, `Suivez votre colis`],
    [`e.g. GLX-4821-BN`, `ex. GLX-4821-BN`],
    [`Real-time updates · Insured cargo · 24/7 support`, `Suivi en temps réel · Fret assuré · Assistance 24/7`],
    [`Scroll`, `Défiler`],
    [`Deliveries completed`, `Livraisons effectuées`], [`Countries served`, `Pays desservis`], [`On-time rate`, `Taux de ponctualité`],
    // typewords
    [`food delivery`, `la livraison de repas`], [`local dispatch`, `la course locale`],
    [`cross-border freight`, `le fret transfrontalier`], [`international shipping`, `l'expédition internationale`],
    [`warehousing`, `l'entreposage`],

    // Partners
    [`Trusted by growing businesses across West Africa`, `La confiance d'entreprises en pleine croissance à travers l'Afrique de l'Ouest`],

    // About preview (home)
    [`Who we are`, `Qui nous sommes`],
    [`A logistics partner built for a moving continent`, `Un partenaire logistique conçu pour un continent en mouvement`],
    [`GraLex Logistique connects markets, businesses and people across Benin, Nigeria and the wider West African corridor — blending local expertise with world-class operational standards.`,
     `GraLex Logistique relie marchés, entreprises et personnes à travers le Bénin, le Nigéria et l'ensemble du corridor ouest-africain — en alliant expertise locale et standards opérationnels de classe mondiale.`],
    [`Nationwide & cross-border reach`, `Couverture nationale et transfrontalière`],
    [`— one network from first mile to final mile.`, `— un seul réseau, du premier au dernier kilomètre.`],
    [`Insured, tracked cargo`, `Fret assuré et suivi`],
    [`— full visibility from pickup to delivery.`, `— une visibilité totale, de l'enlèvement à la livraison.`],
    [`Dedicated account teams`, `Équipes de comptes dédiées`],
    [`— logistics tailored to your business.`, `— une logistique adaptée à votre entreprise.`],
    [`Discover our story`, `Découvrir notre histoire`],
    [`Live support`, `Assistance en direct`],

    // Services (home + page)
    [`What we do`, `Ce que nous faisons`],
    [`End-to-end logistics, engineered to deliver`, `Une logistique de bout en bout, pensée pour livrer`],
    [`From a single parcel to full-scale corporate supply chains — we move it, track it and deliver it, on time.`,
     `Du simple colis aux chaînes d'approvisionnement d'entreprise complètes — nous le transportons, le suivons et le livrons, à l'heure.`],
    [`Food Delivery`, `Livraison de repas`], [`Local Dispatch`, `Course locale`],
    [`International Shipping`, `Expédition internationale`], [`Cross-Border Logistics`, `Logistique transfrontalière`],
    [`Warehousing`, `Entreposage`], [`Corporate Logistics`, `Logistique d'entreprise`],
    [`Bulk Delivery`, `Livraison en gros`], [`Import & Export Assistance`, `Assistance import & export`],
    [`Cross-Border`, `Transfrontalier`],
    [`Temperature-aware, time-critical delivery for restaurants, grocers and food brands across the city.`,
     `Livraison à température maîtrisée et à délai critique pour restaurants, épiceries et marques alimentaires à travers la ville.`],
    [`Same-day rider and van dispatch for e-commerce, documents and urgent business errands.`,
     `Coursiers et camionnettes le jour même pour l'e-commerce, les documents et les démarches urgentes.`],
    [`Air and sea freight with customs handling for exports and imports beyond the region.`,
     `Fret aérien et maritime avec gestion douanière pour vos exports et imports au-delà de la région.`],
    [`Seamless Benin–Nigeria–regional corridors with documentation and clearance managed for you.`,
     `Des corridors Bénin–Nigéria–régionaux fluides, avec documentation et dédouanement gérés pour vous.`],
    [`Secure, organised storage with inventory management and pick-and-pack fulfilment.`,
     `Un stockage sécurisé et organisé avec gestion des stocks et préparation de commandes.`],
    [`Managed supply-chain programmes with SLAs, reporting and dedicated account teams.`,
     `Des programmes logistiques gérés avec SLA, reporting et équipes de comptes dédiées.`],
    [`Explore all services`, `Découvrir tous les services`],

    // Why choose us
    [`Why GraLex`, `Pourquoi GraLex`],
    [`The difference is in the delivery`, `La différence est dans la livraison`],
    [`Speed that scales`, `Une rapidité qui suit votre croissance`],
    [`Optimised routing and a dense partner network keep your goods moving without delay.`,
     `Un routage optimisé et un réseau de partenaires dense gardent vos marchandises en mouvement, sans délai.`],
    [`Security first`, `La sécurité avant tout`],
    [`Insured cargo, vetted drivers and tamper-evident handling at every touchpoint.`,
     `Fret assuré, chauffeurs vérifiés et manutention inviolable à chaque étape.`],
    [`Regional expertise`, `Expertise régionale`],
    [`We know the borders, the roads and the paperwork — so you don't have to.`,
     `Nous connaissons les frontières, les routes et les formalités — pour que vous n'ayez pas à le faire.`],
    [`Full visibility`, `Visibilité totale`],
    [`Live tracking and proactive updates from pickup to signed delivery.`,
     `Suivi en direct et mises à jour proactives, de l'enlèvement à la livraison signée.`],
    [`24/7 support`, `Assistance 24/7`],
    [`Real people, always reachable, ready to solve problems before they grow.`,
     `De vraies personnes, toujours joignables, prêtes à résoudre les problèmes avant qu'ils ne s'aggravent.`],
    [`Flexible & tailored`, `Flexible et sur mesure`],
    [`Solutions shaped around your volumes, timelines and budget — never one-size-fits-all.`,
     `Des solutions adaptées à vos volumes, délais et budget — jamais du prêt-à-porter.`],

    // Stats
    [`Deliveries`, `Livraisons`], [`Business clients`, `Clients professionnels`], [`Clients`, `Clients`],
    [`Countries`, `Pays`], [`On-time delivery`, `Livraison à l'heure`], [`Team members`, `Membres de l'équipe`],

    // Process
    [`How it works`, `Comment ça marche`],
    [`From request to doorstep in four simple steps`, `De la demande à votre porte, en quatre étapes simples`],
    [`Request a quote`, `Demander un devis`],
    [`Tell us what, where and how fast. Get a transparent price in minutes.`,
     `Dites-nous quoi, où et à quelle vitesse. Obtenez un prix transparent en quelques minutes.`],
    [`We pick up`, `Nous enlevons`],
    [`Our team collects your goods and checks them into the network.`,
     `Notre équipe récupère vos marchandises et les enregistre dans le réseau.`],
    [`In transit`, `En transit`],
    [`Track every movement in real time as your shipment travels.`,
     `Suivez chaque mouvement en temps réel pendant le trajet de votre colis.`],
    [`Delivered`, `Livré`],
    [`Safe handover at the destination with proof of delivery.`,
     `Remise en toute sécurité à destination, avec preuve de livraison.`],

    // Gallery preview + page
    [`On the ground`, `Sur le terrain`],
    [`Logistics in motion`, `La logistique en mouvement`],
    [`View full gallery`, `Voir toute la galerie`],
    [`A look inside GraLex operations — from our fleet and warehouses to the ports and roads that connect the region.`,
     `Un aperçu des opérations GraLex — de notre flotte et nos entrepôts aux ports et routes qui relient la région.`],
    [`All`, `Tout`], [`Fleet`, `Flotte`], [`Dispatch`, `Course`], [`Freight`, `Fret`],
    [`Close`, `Fermer`], [`Previous`, `Précédent`], [`Next`, `Suivant`],
    [`Our delivery fleet`, `Notre flotte de livraison`], [`Port operations`, `Opérations portuaires`],
    [`Warehouse aisles`, `Allées d'entrepôt`], [`City dispatch`, `Course en ville`],
    [`Inventory management`, `Gestion des stocks`], [`Container yard`, `Parc à conteneurs`],
    [`Long-haul transport`, `Transport longue distance`], [`Last-mile delivery`, `Livraison dernier kilomètre`],
    [`Pick & pack`, `Préparation de commandes`], [`Air cargo`, `Fret aérien`],
    [`Fleet at dawn`, `La flotte à l'aube`], [`Rider network`, `Réseau de coursiers`],

    // Testimonials
    [`Client stories`, `Témoignages clients`], [`Testimonials`, `Témoignages`],
    [`Trusted by the businesses we move`, `La confiance des entreprises que nous accompagnons`],
    [`5 out of 5 stars`, `5 étoiles sur 5`],
    [`"GraLex transformed how we reach customers across Cotonou and Lagos. Deliveries that used to take days now arrive same-day — and we can see every step."`,
     `« GraLex a transformé notre façon d'atteindre nos clients à Cotonou et Lagos. Des livraisons qui prenaient des jours arrivent désormais le jour même — et nous suivons chaque étape. »`],
    [`"Cross-border shipping used to be our biggest headache. GraLex handles the customs, the paperwork, everything. We just watch it move."`,
     `« L'expédition transfrontalière était notre plus grand casse-tête. GraLex gère la douane, les formalités, tout. Nous n'avons plus qu'à regarder avancer. »`],
    [`"Reliable, professional and genuinely responsive. Their team feels like an extension of ours. I recommend GraLex to every business I know."`,
     `« Fiable, professionnel et vraiment réactif. Leur équipe est comme une extension de la nôtre. Je recommande GraLex à toutes les entreprises que je connais. »`],
    [`Operations Lead, AfriMart`, `Responsable des opérations, AfriMart`],
    [`Founder, Delta Traders`, `Fondateur, Delta Traders`],
    [`Supply Manager, Sahel Foods`, `Responsable des achats, Sahel Foods`],

    // Trust / promise
    [`Our promise`, `Notre engagement`],
    [`Logistics you can count on`, `Une logistique sur laquelle compter`],
    [`Every shipment is backed by guarantees that protect your goods, your time and your peace of mind.`,
     `Chaque envoi est garanti pour protéger vos marchandises, votre temps et votre tranquillité d'esprit.`],
    [`Fully insured`, `Entièrement assuré`],
    [`Cargo protection on every shipment, from first mile to final handover.`,
     `Protection du fret sur chaque envoi, du premier kilomètre à la remise finale.`],
    [`On-time guarantee`, `Garantie de ponctualité`],
    [`We commit to your delivery window — and keep you posted if anything changes.`,
     `Nous nous engageons sur votre créneau de livraison — et vous informons si quelque chose change.`],
    [`Secure handling`, `Manutention sécurisée`],
    [`Vetted drivers and tamper-evident processes keep your cargo safe.`,
     `Des chauffeurs vérifiés et des procédures inviolables protègent votre fret.`],
    [`Transparent pricing`, `Tarifs transparents`],
    [`Clear, all-in quotes with no hidden fees or surprise surcharges.`,
     `Des devis clairs et tout compris, sans frais cachés ni suppléments surprises.`],

    // CTA bands
    [`Ready to move your business forward?`, `Prêt à faire avancer votre entreprise ?`],
    [`Get a tailored quote in minutes, or talk to our team about a logistics programme built around you.`,
     `Obtenez un devis sur mesure en quelques minutes, ou échangez avec notre équipe sur un programme logistique conçu pour vous.`],
    [`Talk to Sales`, `Parler aux ventes`], [`Contact Us`, `Nous contacter`],
    [`Let's build your supply chain together`, `Construisons ensemble votre chaîne logistique`],
    [`Join hundreds of businesses that trust GraLex to keep their goods moving.`,
     `Rejoignez des centaines d'entreprises qui font confiance à GraLex pour garder leurs marchandises en mouvement.`],
    [`Not sure which service fits?`, `Vous hésitez sur le service adapté ?`],
    [`Tell us what you need to move and our team will recommend the right solution — and price it in minutes.`,
     `Dites-nous ce que vous devez transporter et notre équipe vous recommandera la bonne solution — chiffrée en quelques minutes.`],
    [`Talk to an Expert`, `Parler à un expert`],
    [`Need to send something?`, `Un colis à envoyer ?`],
    [`Get a quote in minutes and receive a tracking number the moment your shipment is booked.`,
     `Obtenez un devis en quelques minutes et recevez un numéro de suivi dès la réservation de votre envoi.`],
    [`Never miss an update`, `Ne manquez aucune actualité`],
    [`Subscribe for logistics insights, guides and GraLex news — straight to your inbox.`,
     `Abonnez-vous aux analyses logistiques, guides et actualités GraLex — directement dans votre boîte mail.`],

    // Footer
    [`Fast, secure and reliable logistics across Benin, Nigeria and the wider West African corridor.`,
     `Une logistique rapide, sûre et fiable à travers le Bénin, le Nigéria et l'ensemble du corridor ouest-africain.`],
    [`Company`, `Entreprise`], [`About Us`, `À propos`], [`Get in touch`, `Nous joindre`],
    [`Your email`, `Votre e-mail`], [`Email address`, `Adresse e-mail`], [`Newsletter signup`, `Inscription à la newsletter`],
    [`Privacy Policy`, `Politique de confidentialité`], [`Terms of Service`, `Conditions d'utilisation`],
    [`Support`, `Assistance`], [`GraLex Logistique. All rights reserved.`, `GraLex Logistique. Tous droits réservés.`],

    // ABOUT page
    [`We move Africa forward, one delivery at a time`, `Nous faisons avancer l'Afrique, une livraison à la fois`],
    [`From a single van in Cotonou to a regional logistics network — this is the story of GraLex Logistique.`,
     `D'une seule camionnette à Cotonou à un réseau logistique régional — voici l'histoire de GraLex Logistique.`],
    [`Our story`, `Notre histoire`],
    [`Built in Africa, for Africa's momentum`, `Construit en Afrique, pour l'élan de l'Afrique`],
    [`GraLex Logistique was founded on a simple belief: that world-class logistics should be within reach of every business on the continent — not just the largest.`,
     `GraLex Logistique est née d'une conviction simple : une logistique de classe mondiale devrait être à la portée de chaque entreprise du continent — pas seulement des plus grandes.`],
    [`What began as a local dispatch service in Cotonou has grown into a trusted regional partner, moving goods across borders with the speed, care and visibility modern commerce demands. We combine deep local knowledge with disciplined operations to deliver where others can't.`,
     `Ce qui a commencé comme un service de course locale à Cotonou est devenu un partenaire régional de confiance, transportant des marchandises au-delà des frontières avec la rapidité, le soin et la visibilité qu'exige le commerce moderne. Nous combinons une connaissance locale approfondie et des opérations rigoureuses pour livrer là où d'autres ne le peuvent pas.`],
    [`Our Mission`, `Notre mission`], [`Our Vision`, `Notre vision`],
    [`To connect markets, businesses and people across Africa with logistics that are fast, secure, transparent and genuinely reliable — removing friction from every supply chain we touch.`,
     `Relier marchés, entreprises et personnes à travers l'Afrique grâce à une logistique rapide, sûre, transparente et véritablement fiable — en éliminant les frictions de chaque chaîne d'approvisionnement que nous touchons.`],
    [`To be West Africa's most trusted logistics network — the standard against which reliability, reach and service excellence are measured across the continent.`,
     `Devenir le réseau logistique le plus fiable d'Afrique de l'Ouest — la référence en matière de fiabilité, de portée et d'excellence de service sur le continent.`],
    [`What drives us`, `Ce qui nous anime`], [`Core values`, `Nos valeurs`],
    [`Reliability`, `Fiabilité`], [`Integrity`, `Intégrité`], [`Speed`, `Rapidité`], [`Reach`, `Portée`],
    [`We do what we say. Every shipment, every deadline, every time.`,
     `Nous faisons ce que nous disons. Chaque envoi, chaque délai, à chaque fois.`],
    [`Transparent pricing and honest communication at every step.`,
     `Des tarifs transparents et une communication honnête à chaque étape.`],
    [`Optimised operations that keep pace with modern commerce.`,
     `Des opérations optimisées qui suivent le rythme du commerce moderne.`],
    [`One network spanning Benin, Nigeria and beyond.`,
     `Un réseau couvrant le Bénin, le Nigéria et au-delà.`],
    [`Our journey`, `Notre parcours`], [`Milestones that made us`, `Les étapes qui nous ont façonnés`],
    [`The journey begins`, `L'aventure commence`],
    [`GraLex launches local dispatch operations in Cotonou with a small, determined team.`,
     `GraLex lance ses opérations de course locale à Cotonou avec une petite équipe déterminée.`],
    [`Crossing borders`, `Franchir les frontières`],
    [`We open our first cross-border corridor, connecting Benin and Nigeria markets.`,
     `Nous ouvrons notre premier corridor transfrontalier, reliant les marchés béninois et nigérian.`],
    [`Warehousing & fulfilment`, `Entreposage & préparation`],
    [`New warehouse capacity brings storage, inventory and pick-and-pack under one roof.`,
     `De nouvelles capacités d'entreposage réunissent stockage, inventaire et préparation de commandes sous un même toit.`],
    [`Regional network`, `Réseau régional`],
    [`Coverage expands across West Africa with international air and sea freight.`,
     `La couverture s'étend à toute l'Afrique de l'Ouest, avec du fret aérien et maritime international.`],
    [`Today`, `Aujourd'hui`], [`Delivering the future`, `Livrer l'avenir`],
    [`Thousands of shipments a month, powered by technology and a people-first culture.`,
     `Des milliers d'envois par mois, portés par la technologie et une culture centrée sur l'humain.`],

    // SERVICES page
    [`Logistics solutions for every need`, `Des solutions logistiques pour chaque besoin`],
    [`Whatever you move, wherever it's going — GraLex has a service engineered to deliver it safely and on time.`,
     `Quoi que vous transportiez, où que ce soit — GraLex propose un service conçu pour le livrer en toute sécurité et à l'heure.`],
    [`Our services`, `Nos services`],
    [`One partner, every logistics need`, `Un partenaire, tous vos besoins logistiques`],
    [`Explore the full range of services we offer businesses and individuals across the region.`,
     `Découvrez la gamme complète de services que nous proposons aux entreprises et aux particuliers dans la région.`],
    [`Get a quote`, `Demander un devis`],
    [`Temperature-aware, time-critical delivery for restaurants, grocers and food brands. Keep your customers happy with reliable same-day service.`,
     `Livraison à température maîtrisée et à délai critique pour restaurants, épiceries et marques alimentaires. Ravissez vos clients avec un service fiable le jour même.`],
    [`Same-day rider and van dispatch for e-commerce orders, documents and urgent errands across the city and suburbs.`,
     `Coursiers et camionnettes le jour même pour les commandes e-commerce, les documents et les courses urgentes en ville et en banlieue.`],
    [`Air and sea freight with full customs handling for imports and exports far beyond the region.`,
     `Fret aérien et maritime avec gestion douanière complète pour vos imports et exports bien au-delà de la région.`],
    [`Seamless Benin–Nigeria and regional corridors with documentation and clearance managed end-to-end.`,
     `Des corridors Bénin–Nigéria et régionaux fluides, avec documentation et dédouanement gérés de bout en bout.`],
    [`High-volume distribution for wholesalers and manufacturers, with consolidated routing that cuts cost.`,
     `Distribution à grand volume pour grossistes et fabricants, avec un routage consolidé qui réduit les coûts.`],
    [`Secure, organised storage with inventory management, pick-and-pack and fulfilment on demand.`,
     `Un stockage sécurisé et organisé avec gestion des stocks, préparation de commandes et logistique à la demande.`],
    [`Managed supply-chain programmes with SLAs, dedicated account teams and detailed reporting.`,
     `Des programmes logistiques gérés avec SLA, équipes de comptes dédiées et reporting détaillé.`],
    [`Documentation, duties and compliance handled by specialists so your goods clear without delay.`,
     `Documentation, droits et conformité pris en charge par des spécialistes pour que vos marchandises soient dédouanées sans délai.`],
    [`Questions`, `Questions`], [`Frequently asked`, `Questions fréquentes`],
    [`What areas do you cover?`, `Quelles zones couvrez-vous ?`],
    [`We operate across Benin and Nigeria with cross-border corridors into the wider West African region, plus international air and sea freight worldwide.`,
     `Nous opérons au Bénin et au Nigéria avec des corridors transfrontaliers vers toute l'Afrique de l'Ouest, ainsi que du fret aérien et maritime international dans le monde entier.`],
    [`How fast is local dispatch?`, `Quelle est la rapidité de la course locale ?`],
    [`Most local dispatch orders are collected within the hour and delivered same-day, depending on distance and traffic conditions.`,
     `La plupart des courses locales sont enlevées dans l'heure et livrées le jour même, selon la distance et les conditions de circulation.`],
    [`Is my cargo insured?`, `Mon fret est-il assuré ?`],
    [`Yes. All shipments are handled with insured, tamper-evident processes. Ask our team about coverage tiers for high-value goods.`,
     `Oui. Tous les envois sont traités avec des procédures assurées et inviolables. Demandez à notre équipe les niveaux de couverture pour les marchandises de grande valeur.`],
    [`Can I track my shipment?`, `Puis-je suivre mon envoi ?`],
    [`Absolutely. Every shipment gets a tracking number you can follow in real time on our Track page, with proactive status updates.`,
     `Absolument. Chaque envoi reçoit un numéro de suivi que vous pouvez suivre en temps réel sur notre page Suivi, avec des mises à jour proactives.`],

    // TRACKING page
    [`Enter your tracking number to see exactly where your package is — in real time, every step of the way.`,
     `Saisissez votre numéro de suivi pour voir exactement où se trouve votre colis — en temps réel, à chaque étape.`],
    [`Enter tracking number, e.g. GLX-4821-BN`, `Saisissez votre numéro de suivi, ex. GLX-4821-BN`],
    [`Track`, `Suivre`],
    [`Don't have one handy? Try a sample:`, `Vous n'en avez pas ? Essayez un exemple :`],
    [`Real-time updates`, `Suivi en temps réel`],
    [`Live status at every checkpoint from pickup to delivery.`,
     `Statut en direct à chaque point de contrôle, de l'enlèvement à la livraison.`],
    [`Insured in transit`, `Assuré en transit`],
    [`Your cargo is protected the moment it enters our network.`,
     `Votre fret est protégé dès son entrée dans notre réseau.`],
    [`Questions about a shipment? Our team is always reachable.`,
     `Des questions sur un envoi ? Notre équipe est toujours joignable.`],
    // tracking dynamic (timeline)
    [`Package Received`, `Colis reçu`], [`Processing`, `En traitement`], [`In Transit`, `En transit`],
    [`Customs Clearance`, `Dédouanement`], [`Out for Delivery`, `En cours de livraison`],
    [`Parcel checked in at the GraLex origin hub.`, `Colis enregistré au hub d'origine GraLex.`],
    [`Sorted, weighed and prepared for dispatch.`, `Trié, pesé et préparé pour l'expédition.`],
    [`On the move across our regional network.`, `En mouvement sur notre réseau régional.`],
    [`Cross-border documentation verified & cleared.`, `Documentation transfrontalière vérifiée et dédouanée.`],
    [`Loaded onto the final-mile vehicle.`, `Chargé sur le véhicule du dernier kilomètre.`],
    [`Handed to the recipient. Signature captured.`, `Remis au destinataire. Signature enregistrée.`],
    [`Tracking ID`, `N° de suivi`], [`Route`, `Itinéraire`], [`Status`, `Statut`],
    [`Est. delivery`, `Livraison estimée`], [`Delivered on`, `Livré le`], [`Pending`, `En attente`],

    // QUOTE page
    [`Get an instant quote`, `Obtenez un devis instantané`],
    [`Tell us about your shipment and we'll get back with a tailored price — usually within the hour.`,
     `Parlez-nous de votre envoi et nous vous répondrons avec un prix sur mesure — généralement dans l'heure.`],
    [`Pickup address`, `Adresse d'enlèvement`], [`Destination`, `Destination`], [`Package type`, `Type de colis`],
    [`Weight (kg)`, `Poids (kg)`], [`Vehicle`, `Véhicule`], [`Delivery speed`, `Délai de livraison`],
    [`Full name`, `Nom complet`], [`Phone`, `Téléphone`], [`Email`, `E-mail`], [`Notes`, `Notes`],
    [`Select type`, `Choisir un type`], [`Documents`, `Documents`], [`Parcel / Box`, `Colis / Carton`],
    [`Food / Perishable`, `Alimentaire / Périssable`], [`Fragile goods`, `Marchandises fragiles`],
    [`Bulk / Pallet`, `Vrac / Palette`], [`Other`, `Autre`], [`No preference`, `Sans préférence`],
    [`Motorbike`, `Moto`], [`Van`, `Camionnette`], [`Truck`, `Camion`], [`Refrigerated`, `Réfrigéré`],
    [`Select speed`, `Choisir un délai`], [`Same-day (express)`, `Jour même (express)`], [`Next-day`, `Lendemain`],
    [`Standard (2-4 days)`, `Standard (2-4 jours)`], [`Economy`, `Économique`],
    [`Street, city`, `Rue, ville`], [`Street, city / country`, `Rue, ville / pays`], [`e.g. 12.5`, `ex. 12,5`],
    [`Your name`, `Votre nom`], [`Anything else we should know?`, `Autre chose à nous signaler ?`],
    [`Request my quote`, `Demander mon devis`],
    [`Your details are safe with us and never shared.`, `Vos informations sont en sécurité et ne sont jamais partagées.`],
    [`Thank you!`, `Merci !`],
    [`Your quote request is in. A GraLex specialist will be in touch shortly with your tailored price.`,
     `Votre demande de devis est enregistrée. Un spécialiste GraLex vous contactera sous peu avec votre prix sur mesure.`],
    [`Back to home`, `Retour à l'accueil`],
    [`Why request a quote?`, `Pourquoi demander un devis ?`],
    [`Transparent, all-in pricing — no surprises.`, `Des tarifs transparents et tout compris — sans surprises.`],
    [`Fast turnaround, usually within the hour.`, `Une réponse rapide, généralement dans l'heure.`],
    [`Advice on the best service for your needs.`, `Des conseils sur le meilleur service pour vos besoins.`],
    [`Dedicated support from booking to delivery.`, `Un accompagnement dédié de la réservation à la livraison.`],
    [`Prefer to talk?`, `Vous préférez échanger ?`],
    [`Call our team and we'll quote you over the phone.`, `Appelez notre équipe et nous vous établirons un devis par téléphone.`],

    // GALLERY / CONTACT alts & captions
    [`Let's talk logistics`, `Parlons logistique`],
    [`Questions, quotes or partnerships — our team is ready to help. Reach out and we'll respond fast.`,
     `Questions, devis ou partenariats — notre équipe est prête à vous aider. Contactez-nous et nous répondrons vite.`],
    [`Note for the site owner:`, `Note pour le propriétaire du site :`],
    [`the phone, email, address and map below are placeholders. Share GraLex's real details and they'll be slotted straight in.`,
     `le téléphone, l'e-mail, l'adresse et la carte ci-dessous sont des espaces réservés. Communiquez les vraies coordonnées de GraLex et elles seront intégrées directement.`],
    [`Visit us`, `Nous rendre visite`], [`Call us`, `Appelez-nous`], [`Email us`, `Écrivez-nous`],
    [`Chat with us instantly`, `Discutez avec nous en direct`],
    [`Business hours`, `Horaires d'ouverture`], [`Monday – Friday`, `Lundi – Vendredi`],
    [`Saturday`, `Samedi`], [`Sunday`, `Dimanche`], [`Closed`, `Fermé`],
    [`Send us a message`, `Envoyez-nous un message`], [`Name`, `Nom`], [`Subject`, `Objet`], [`Message`, `Message`],
    [`How can we help?`, `Comment pouvons-nous vous aider ?`], [`Tell us more...`, `Dites-nous en plus...`],
    [`Send message`, `Envoyer le message`],

    // BLOG page
    [`Insights from the road`, `Perspectives de la route`],
    [`Guides, industry trends and stories from the GraLex team — everything logistics, made simple.`,
     `Guides, tendances du secteur et récits de l'équipe GraLex — toute la logistique, simplifiée.`],
    [`Search articles...`, `Rechercher des articles...`], [`Search articles`, `Rechercher des articles`],
    [`Logistics`, `Logistique`], [`Guides`, `Guides`],
    [`Read article`, `Lire l'article`],
    [`No articles match your search. Try a different keyword.`,
     `Aucun article ne correspond à votre recherche. Essayez un autre mot-clé.`],
    [`The future of cross-border trade in West Africa`, `L'avenir du commerce transfrontalier en Afrique de l'Ouest`],
    [`How digital logistics is reshaping the Benin–Nigeria corridor and unlocking new opportunities for businesses.`,
     `Comment la logistique numérique redessine le corridor Bénin–Nigéria et ouvre de nouvelles opportunités aux entreprises.`],
    [`5 ways to cut your shipping costs without cutting corners`, `5 façons de réduire vos coûts d'expédition sans rogner sur la qualité`],
    [`Practical strategies to optimise your supply chain and keep more margin in your pocket.`,
     `Des stratégies concrètes pour optimiser votre chaîne logistique et préserver votre marge.`],
    [`Inside the GraLex fleet: how we keep Africa moving`, `Au cœur de la flotte GraLex : comment nous gardons l'Afrique en mouvement`],
    [`A behind-the-scenes look at the vehicles, technology and people powering our deliveries.`,
     `Un regard en coulisses sur les véhicules, la technologie et les personnes qui font vivre nos livraisons.`],
    [`Warehousing 101: when to outsource your storage`, `Entreposage 101 : quand externaliser votre stockage`],
    [`Signs your business has outgrown the back room — and what a fulfilment partner can do for you.`,
     `Les signes que votre entreprise a dépassé l'arrière-boutique — et ce qu'un partenaire logistique peut faire pour vous.`],
    [`Last-mile delivery: solving the hardest part of the journey`, `Livraison du dernier kilomètre : résoudre l'étape la plus difficile`],
    [`Why the final mile is the most expensive and complex stage — and how we crack it.`,
     `Pourquoi le dernier kilomètre est l'étape la plus coûteuse et complexe — et comment nous la maîtrisons.`],
    [`Sustainability on the road: our greener logistics roadmap`, `Durabilité sur la route : notre feuille de route pour une logistique plus verte`],
    [`The steps GraLex is taking to reduce emissions across our growing network.`,
     `Les mesures que prend GraLex pour réduire les émissions sur son réseau en pleine croissance.`],
    [`How to pack fragile goods for a long journey`, `Comment emballer des marchandises fragiles pour un long trajet`],
    [`Expert tips to make sure delicate cargo arrives in perfect condition, every time.`,
     `Des conseils d'experts pour que le fret délicat arrive en parfait état, à chaque fois.`],
    [`Customs made simple: a small business guide`, `La douane en toute simplicité : le guide des petites entreprises`],
    [`Demystifying documentation, duties and clearance for first-time exporters.`,
     `Démystifier la documentation, les droits et le dédouanement pour les nouveaux exportateurs.`],
    [`Meet the team keeping your deliveries on track`, `Rencontrez l'équipe qui veille sur vos livraisons`],
    [`The dispatchers, drivers and support staff who make GraLex tick.`,
     `Les régulateurs, chauffeurs et équipes support qui font tourner GraLex.`],
    // reading time
    [`3 min read`, `3 min de lecture`], [`4 min read`, `4 min de lecture`], [`5 min read`, `5 min de lecture`],
    [`6 min read`, `6 min de lecture`], [`7 min read`, `7 min de lecture`], [`8 min read`, `8 min de lecture`],
    // dates
    [`Jul 12, 2026`, `12 juil. 2026`], [`Jul 5, 2026`, `5 juil. 2026`], [`Jun 28, 2026`, `28 juin 2026`],
    [`Jun 20, 2026`, `20 juin 2026`], [`Jun 11, 2026`, `11 juin 2026`], [`Jun 2, 2026`, `2 juin 2026`],
    [`May 24, 2026`, `24 mai 2026`], [`May 15, 2026`, `15 mai 2026`], [`May 6, 2026`, `6 mai 2026`],

    // alt texts
    [`Stacked shipping containers at a port terminal`, `Conteneurs empilés à un terminal portuaire`],
    [`Warehouse team coordinating deliveries`, `Équipe d'entrepôt coordonnant les livraisons`],
    [`GraLex warehouse operations`, `Opérations de l'entrepôt GraLex`],
    [`Delivery van on a city street`, `Camionnette de livraison dans une rue`],
    [`Cargo containers at port`, `Conteneurs de fret au port`],
    [`Warehouse storage aisles`, `Allées de stockage d'entrepôt`],
    [`Freight truck on the highway`, `Camion de fret sur l'autoroute`],
    [`GraLex Logistique location — Cotonou`, `Emplacement de GraLex Logistique — Cotonou`],

    // Newsletter/forms/toasts
    [`Subscribe`, `S'abonner`],
    [`You're subscribed. Welcome aboard!`, `Vous êtes abonné. Bienvenue à bord !`],
    [`Please enter a valid email address.`, `Veuillez saisir une adresse e-mail valide.`],
    [`Please fix the highlighted fields.`, `Veuillez corriger les champs en surbrillance.`],
    [`Enter a tracking number to continue.`, `Saisissez un numéro de suivi pour continuer.`],
    [`Thank you! Our team will be in touch shortly.`, `Merci ! Notre équipe vous contactera sous peu.`],
    [`Quote request received! Our team will reach out shortly.`, `Demande de devis reçue ! Notre équipe vous contactera sous peu.`],
    [`Message sent! We'll reply as soon as we can.`, `Message envoyé ! Nous répondrons dès que possible.`],
    [`You're subscribed. Welcome aboard!`, `Vous êtes abonné. Bienvenue à bord !`],

    // Page titles
    [`GraLex Logistique — Delivering Africa. Connecting the World.`, `GraLex Logistique — Livrer l'Afrique. Connecter le monde.`],
    [`About — GraLex Logistique`, `À propos — GraLex Logistique`],
    [`Services — GraLex Logistique`, `Services — GraLex Logistique`],
    [`Track Shipment — GraLex Logistique`, `Suivi de colis — GraLex Logistique`],
    [`Get a Quote — GraLex Logistique`, `Devis — GraLex Logistique`],
    [`Gallery — GraLex Logistique`, `Galerie — GraLex Logistique`],
    [`Contact — GraLex Logistique`, `Contact — GraLex Logistique`],
    [`Blog — GraLex Logistique`, `Blog — GraLex Logistique`]
  ];

  var MAP = new Map();
  PAIRS.forEach(function (p) { if (!MAP.has(p[0])) MAP.set(p[0], p[1]); });

  function tr(str) {
    if (lang !== "fr" || str == null) return str;
    var key = String(str).trim();
    return MAP.has(key) ? MAP.get(key) : str;
  }

  var ATTRS = ["placeholder", "aria-label", "alt", "title"];

  function translateEl(root) {
    if (lang !== "fr" || !root) return;
    // Text nodes
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var raw = n.nodeValue, key = raw.trim();
      if (MAP.has(key)) {
        var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
        n.nodeValue = lead + MAP.get(key) + trail;
      }
    });
    // Attributes
    var sel = ATTRS.map(function (a) { return "[" + a + "]"; }).join(",");
    var els = root.querySelectorAll ? root.querySelectorAll(sel) : [];
    [].forEach.call(els, function (el) {
      ATTRS.forEach(function (a) {
        if (el.hasAttribute(a)) {
          var v = el.getAttribute(a).trim();
          if (MAP.has(v)) el.setAttribute(a, MAP.get(v));
        }
      });
    });
  }

  function applyPage() {
    document.documentElement.lang = lang;
    if (lang === "fr") {
      // Translate hero typewords BEFORE animations.js reads them
      var tw = document.querySelector("[data-typewords]");
      if (tw) {
        try {
          var words = JSON.parse(tw.dataset.typewords).map(function (w) { return MAP.get(w) || w; });
          tw.dataset.typewords = JSON.stringify(words);
        } catch (e) {}
      }
      translateEl(document.body);
      if (MAP.has(document.title.trim())) document.title = MAP.get(document.title.trim());
    }
  }

  /* ---- Language toggle UI --------------------------------------------- */
  function makeToggle() {
    var wrap = document.createElement("div");
    wrap.className = "lang-toggle";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", lang === "fr" ? "Choix de la langue" : "Language selector");
    ["en", "fr"].forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-toggle__btn" + (code === lang ? " active" : "");
      b.textContent = code.toUpperCase();
      b.setAttribute("aria-pressed", String(code === lang));
      b.addEventListener("click", function () {
        if (code === lang) return;
        localStorage.setItem(STORE, code);
        location.reload();
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function injectToggles() {
    var navInner = document.querySelector(".nav__inner");
    var cta = navInner && navInner.querySelector(".nav__cta");
    if (navInner) {
      var t = makeToggle();
      if (cta) navInner.insertBefore(t, cta);
      else {
        var toggleBtn = navInner.querySelector(".nav__toggle");
        navInner.insertBefore(t, toggleBtn);
      }
    }
    var mm = document.querySelector(".mobile-menu__cta");
    if (mm) {
      var mt = makeToggle();
      mt.classList.add("lang-toggle--mobile");
      mm.appendChild(mt);
    }
  }

  // Apply immediately (DOM is parsed — script sits at end of body)
  applyPage();
  injectToggles();

  // Expose for dynamically generated content (tracking timeline, toasts)
  window.gralexI18n = { lang: lang, t: tr, translateEl: translateEl };
})();
