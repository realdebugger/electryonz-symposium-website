export const eventsData = [
  {
    id: "paper-presentation",
    title: "Paper Presentation",
    category: "Technical",
    venue: "Seminar Hall",
    time: "10:40 AM – 1 PM ",
    duration: 2.4,
    modes: ["SOLO", "TEAM"],
    fee: { SOLO: 350, TEAM: 350 },
    maxMembers: 2,
    rules: [
      "Papers must be related to Electrical Engineering",
      "Maximum 15-20 slides allowed",
      "Presentation time: 10 minutes + 2 minutes Q&A",
      "Judge's decision will be final",
    ],
  },

  {
    id: "voltex",
    title: "voltex",
    category: "Technical",
    venue: "AC-MACHINES LAB",
    time: " 3:15 PM – 4 PM",
    duration: 0.75,
    rules: [
      "The rules for the Voltex event will be announced at the venue"
    ],
  },

  {
    id: "relay-rush",
    title: "Relay rush",
    category: "Technical",
    venue: "Workshop",
    time: "2:30 AM – 3:15 PM",
    duration: 0.75,
    rules: [
      "The rules for the Relay rush event will be announced at the venue",
      "Judges’ decision is final",
    ],
  },

  {
    id: "grid-wars",
    title: "grid wars",
    category: "Technical",
    venue: "DC-MACHINES LAB",
    time: "3:00 PM – 3:45 PM",
    duration: 0.75,
    rules: [
      "Questions based on Electrical",
      "The other rules for the Grid wars event will be announced at the venue"
    ],
  },

  {
    id: "components-scavenger-hunt",
    title: "Components scavenger hunt",
    category: "Technical",
    venue: "DC-MACHINES LAB",
    time: "2:30 PM – 3:00 PM",
    duration: 0.5,
    rules: [
      "Identify Electrical components correctly",
      "Wrong answers lead to point deduction",
      "Judges’ decision is final",
    ],
  },



  {
    id: "project-expo",
    title: "Project Expo",
    category: "Technical",
    venue: "ELECTRONICS LAB",
    time: "1:30 PM – 2:30 PM",
    duration: 1,
    modes: ["TEAM"],
    fee: { SOLO: 350, TEAM: 350 },
    maxMembers: 3,
    rules: [
      "Working model or prototype preferred",
      "Participants must explain working principle",
      "Judging based on innovation and feasibility"
    ],
  },

  /* ===============================
   NON-TECHNICAL EVENTS
================================ */

  {
    id: "ipl-auction",
    title: "IPL Auction",
    category: "Non-Technical",
    venue: "3rd year class room",
    time: "8:15 AM - 12:15 PM",
    duration: 4,
    modes: ["TEAM"],
    fee: { TEAM: 200 },
    maxMembers: 4,
    rules: [
      "Team 11's Rules will be Provided on time"
    ]
  },

  {
    id: "treasure-hunt",
    title: "Treasure hunt",
    category: "Non-Technical",
    venue: "EEE-DEPT",
    time: "9 AM - 11 AM",
    duration: 2,
    modes: ["TEAM"],
    fee: { TEAM: 200 },
    maxMembers: 4,
    rules: [
      "Respect college property",
      "No asking non-participants for answers",
      "If time ends → team with maximum clues wins.",
      "If tie → fastest completion time wins."
    ]
  },

  {
    id: "snakes-and-ladder",
    title: "Snakes & Ladder",
    category: "Non-Technical",
    venue: "Final year class room",
    time: "10 AM - 11:30 AM",
    duration: 1.5,
    modes: ["TEAM"],
    fee: { TEAM: 200 },
    maxMembers: 4,
    rules: [

    ]
  },

  {
    id: "carrom",
    title: "Carrom",
    category: "Non-Technical",
    venue: "2nd Class Room",
    time: "10 AM - 11:30 AM",
    duration: 1.5,
    modes: ["TEAM"],
    fee: { TEAM: 150 },
    maxMembers: 2,
    rules: [
      "Pockets striker → 1 coin returned",
      "Touches coins with hand → 1 coin penalty",
      "Double touch → foul",
      "Illegally strikes → foul",
      "Match time limit: 20–30 minutes",
      "If time exceeds → player with highest points wins"
    ]
  },

  {
    id: "free-fire",
    title: "Free Fire",
    category: "Non-Technical",
    venue: "DCMT Lab",
    time: "11 AM - 12 PM",
    duration: 1,
    modes: ["TEAM"],
    fee: { TEAM: 200 },
    maxMembers: 4,
    rules: [
      "No Gun Skins",
      "NO Unlimited Walls",
      "No unlimited Grenade",
      "No hacks, scripts, or mod apps",
      "Arrive 15 minutes before match",
      "No Revival",
      "Single Match"
    ]
  },

  {
    id: "chess",
    title: "Chess",
    category: "Non-Technical",
    venue: "2nd Year class Room",
    time: "10 AM - 11:30 AM",
    duration: 1.5,
    modes: ["SOLO"],
    fee: { SOLO: 100 },
    maxMembers: 1,
    rules: [
      "Rapid – 10 minutes per player",
      "First illegal move → Warning",
      "Second illegal move → Game loss"
    ]
  },
];
