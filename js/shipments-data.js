/* ==========================================================================
   GraLex Logistique — shipments-data.js
   Mock shipment "database" for the tracking prototype.

   This file stands in for the real backend you'll build later. Each entry is
   keyed by its tracking ID and shaped exactly like an API/admin-panel record,
   so the front-end never needs to change: when the real system is ready, drop
   this file and have `fetchShipment()` in tracking.js call your endpoint
   (e.g. GET /api/track/:id) returning this same JSON shape.

   Record shape
   ------------
   {
     service:      string   // service line
     origin:       string   // "City, CC"
     destination:  string
     recipient:    string   // display name / initials
     weight:       string
     estDelivery:  "YYYY-MM-DD" | null   // null once delivered
     crossBorder:  boolean  // OPTIONAL — override the auto-detection below
     events: [            // chronological; the LAST event is the current status
       { step, time (ISO), location }
     ]
   }
   Valid step keys, in order:
   received → processing → transit → [customs] → out → delivered

   Domestic vs cross-border
   ------------------------
   The "customs" stage only applies to cross-border shipments. The front-end
   decides which by comparing the origin/destination country codes ("City, CC")
   — different countries ⇒ cross-border ⇒ customs step is shown; same country
   ⇒ domestic ⇒ no customs step. Set an explicit `crossBorder` boolean to
   override that inference. In-country records should simply omit any customs
   event (see GLX-8830-BN below).
   ========================================================================== */
(function () {
  "use strict";

  window.GRALEX_SHIPMENTS = {
    "GLX-4821-BN": {
      service: "Cross-Border Freight",
      origin: "Cotonou, BJ",
      destination: "Lagos, NG",
      recipient: "A. Okafor",
      weight: "12.5 kg",
      estDelivery: "2026-08-02",
      events: [
        { step: "received",   time: "2026-07-29T08:12:00", location: "Cotonou Origin Hub, BJ" },
        { step: "processing", time: "2026-07-29T14:40:00", location: "Cotonou Origin Hub, BJ" },
        { step: "transit",    time: "2026-07-30T06:15:00", location: "Sèmè-Kraké Corridor" }
      ]
    },

    "GLX-93KD-NG": {
      service: "International Shipping",
      origin: "Lagos, NG",
      destination: "Porto-Novo, BJ",
      recipient: "M. Dossou",
      weight: "3.2 kg",
      estDelivery: null,
      events: [
        { step: "received",   time: "2026-07-24T09:05:00", location: "Lagos Sorting Center, NG" },
        { step: "processing", time: "2026-07-24T16:20:00", location: "Lagos Sorting Center, NG" },
        { step: "transit",    time: "2026-07-25T07:30:00", location: "Idiroko Border, NG" },
        { step: "customs",    time: "2026-07-25T13:10:00", location: "Kraké Customs, BJ" },
        { step: "out",        time: "2026-07-26T08:45:00", location: "Porto-Novo Depot, BJ" },
        { step: "delivered",  time: "2026-07-26T11:52:00", location: "Porto-Novo, BJ" }
      ]
    },

    "GLX-5567-CI": {
      service: "Bulk Delivery",
      origin: "Abidjan, CI",
      destination: "Cotonou, BJ",
      recipient: "GraLex Warehouse",
      weight: "148 kg",
      estDelivery: "2026-08-01",
      events: [
        { step: "received",   time: "2026-07-28T10:00:00", location: "Abidjan Freight Terminal, CI" },
        { step: "processing", time: "2026-07-28T18:30:00", location: "Abidjan Freight Terminal, CI" },
        { step: "transit",    time: "2026-07-29T05:00:00", location: "Accra Transit Point, GH" },
        { step: "customs",    time: "2026-07-30T22:15:00", location: "Hillacondji Border, BJ" }
      ]
    },

    "GLX-1290-GH": {
      service: "Corporate Logistics",
      origin: "Accra, GH",
      destination: "Parakou, BJ",
      recipient: "N. Mensah",
      weight: "27.8 kg",
      estDelivery: "2026-08-03",
      events: [
        { step: "received",   time: "2026-07-31T07:48:00", location: "Accra Business Hub, GH" },
        { step: "processing", time: "2026-07-31T12:05:00", location: "Accra Business Hub, GH" }
      ]
    },

    "GLX-8830-BN": {
      service: "Local Dispatch",
      origin: "Cotonou, BJ",
      destination: "Calavi, BJ",
      recipient: "F. Aholou",
      weight: "1.8 kg",
      estDelivery: "2026-07-31",
      events: [
        { step: "received",   time: "2026-07-31T06:30:00", location: "Cotonou Dispatch Center, BJ" },
        { step: "processing", time: "2026-07-31T08:00:00", location: "Cotonou Dispatch Center, BJ" },
        { step: "transit",    time: "2026-07-31T09:20:00", location: "Godomey Junction, BJ" },
        { step: "out",        time: "2026-07-31T10:40:00", location: "Calavi Zone, BJ" }
      ]
    },

    /* ---- Domestic (in-country) shipments — no customs stage ------------- */
    "GLX-4410-BN": {
      service: "Food Delivery",
      origin: "Cotonou, BJ",
      destination: "Akpakpa, BJ",
      recipient: "R. Codjo",
      weight: "2.4 kg",
      estDelivery: "2026-07-31",
      events: [
        { step: "received",   time: "2026-07-31T11:05:00", location: "Cotonou Kitchen Hub, BJ" },
        { step: "processing", time: "2026-07-31T11:25:00", location: "Cotonou Kitchen Hub, BJ" },
        { step: "transit",    time: "2026-07-31T11:50:00", location: "Akpakpa Corridor, BJ" },
        { step: "out",        time: "2026-07-31T12:15:00", location: "Akpakpa, BJ" },
        { step: "delivered",  time: "2026-07-31T12:38:00", location: "Akpakpa, BJ" }
      ]
    },

    "GLX-6021-BN": {
      service: "Local Dispatch",
      origin: "Porto-Novo, BJ",
      destination: "Sèmè-Podji, BJ",
      recipient: "K. Adjovi",
      weight: "5.6 kg",
      estDelivery: "2026-08-01",
      events: [
        { step: "received",   time: "2026-07-30T15:10:00", location: "Porto-Novo Depot, BJ" },
        { step: "processing", time: "2026-07-30T17:35:00", location: "Porto-Novo Depot, BJ" }
      ]
    },

    "GLX-7148-NG": {
      service: "Bulk Delivery",
      origin: "Lagos, NG",
      destination: "Ibadan, NG",
      recipient: "C. Balogun",
      weight: "63 kg",
      estDelivery: "2026-08-01",
      events: [
        { step: "received",   time: "2026-07-30T09:40:00", location: "Lagos Freight Hub, NG" },
        { step: "processing", time: "2026-07-30T13:15:00", location: "Lagos Freight Hub, NG" },
        { step: "transit",    time: "2026-07-31T07:05:00", location: "Sagamu Expressway, NG" }
      ]
    },

    "GLX-9532-BN": {
      service: "Corporate Logistics",
      origin: "Cotonou, BJ",
      destination: "Parakou, BJ",
      recipient: "GraLex Regional Office",
      weight: "34.2 kg",
      estDelivery: null,
      events: [
        { step: "received",   time: "2026-07-28T08:20:00", location: "Cotonou Corporate Desk, BJ" },
        { step: "processing", time: "2026-07-28T10:50:00", location: "Cotonou Corporate Desk, BJ" },
        { step: "transit",    time: "2026-07-29T06:00:00", location: "Bohicon Relay, BJ" },
        { step: "out",        time: "2026-07-30T09:15:00", location: "Parakou Zone, BJ" },
        { step: "delivered",  time: "2026-07-30T13:07:00", location: "Parakou, BJ" }
      ]
    }
  };
})();
